import { format, parse, parseISO } from "date-fns";
import categorize from "../components/utils/categorize";

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const formatNumber = (value = 0) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );

export function toNumber(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value ?? "0")
    .replace(/[^\d,-.]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseDate(value) {
  if (!value) return new Date();
  const stringValue = String(value).trim();
  const formats = ["yyyy-MM-dd", "dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy"];

  for (const dateFormat of formats) {
    try {
      const parsed =
        dateFormat === "yyyy-MM-dd"
          ? parseISO(stringValue)
          : parse(stringValue, dateFormat, new Date());
      if (!Number.isNaN(parsed.getTime())) return parsed;
    } catch {
      // Try the next supported format.
    }
  }

  const nativeDate = new Date(stringValue);
  return Number.isNaN(nativeDate.getTime()) ? new Date() : nativeDate;
}

export function normalizeTransaction(transaction = {}) {
  const amount = toNumber(transaction.Amount ?? transaction.amount);
  const description =
    transaction.Description ?? transaction.description ?? transaction.Keterangan ?? "";
  const explicitType = transaction.Type ?? transaction.type ?? "";
  const category = categorize(description, explicitType);

  return {
    Date: transaction.Date ?? transaction.date ?? format(new Date(), "yyyy-MM-dd"),
    Description: description,
    Amount: amount,
    Channel: transaction.Channel ?? transaction.channel ?? "Offline",
    Type: category,
    Product: transaction.Product ?? transaction.product ?? "",
    Quantity: toNumber(transaction.Quantity ?? transaction.quantity),
    Customer: transaction.Customer ?? transaction.customer ?? "",
  };
}

export function aggregateBy(items, key, valueKey = "value") {
  const map = items.reduce((acc, item) => {
    const name = item[key] || "Lainnya";
    acc[name] = (acc[name] || 0) + Math.abs(toNumber(item[valueKey]));
    return acc;
  }, {});

  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getProductInsights(transactions = [], products = []) {
  const revenueByProduct = transactions
    .filter((item) => item.Amount > 0 && item.Product)
    .reduce((acc, item) => {
      if (!acc[item.Product]) {
        acc[item.Product] = {
          name: item.Product,
          revenue: 0,
          quantity: 0,
        };
      }
      acc[item.Product].revenue += item.Amount;
      acc[item.Product].quantity += item.Quantity || 0;
      return acc;
    }, {});

  return products.map((product) => {
    const sales = revenueByProduct[product.name] || {
      revenue: 0,
      quantity: 0,
    };
    const fee = product.sellingPrice * (product.marketplaceFeeRate || 0);
    const grossProfit = product.sellingPrice - product.unitCost - fee;
    const margin = product.sellingPrice ? grossProfit / product.sellingPrice : 0;
    const daysLeft = product.avgDailySales
      ? product.stock / product.avgDailySales
      : product.stock;
    const reorderPoint = product.avgDailySales * (product.leadTimeDays + 3);
    const status =
      product.stock <= reorderPoint
        ? "Restock"
        : margin < 0.35
          ? "Cek Harga"
          : "Sehat";

    return {
      ...product,
      revenue: sales.revenue,
      quantity: sales.quantity,
      grossProfit,
      margin,
      daysLeft,
      reorderPoint,
      status,
    };
  });
}

export function getAnalytics(transactions = [], products = []) {
  const normalized = transactions.map(normalizeTransaction);
  const revenueRows = normalized.filter((item) => item.Amount > 0);
  const expenseRows = normalized.filter((item) => item.Amount < 0);
  const totalRevenue = revenueRows.reduce((sum, item) => sum + item.Amount, 0);
  const totalExpense = expenseRows.reduce(
    (sum, item) => sum + Math.abs(item.Amount),
    0,
  );
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue ? netProfit / totalRevenue : 0;
  const marketingSpend = expenseRows
    .filter((item) => item.Type === "Marketing")
    .reduce((sum, item) => sum + Math.abs(item.Amount), 0);
  const marketingRatio = totalRevenue ? marketingSpend / totalRevenue : 0;

  const dailyMap = normalized.reduce((acc, item) => {
    const dateKey = format(parseDate(item.Date), "dd MMM");
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, revenue: 0, expense: 0, profit: 0 };
    }
    if (item.Amount > 0) acc[dateKey].revenue += item.Amount;
    if (item.Amount < 0) acc[dateKey].expense += Math.abs(item.Amount);
    acc[dateKey].profit = acc[dateKey].revenue - acc[dateKey].expense;
    return acc;
  }, {});

  const channelData = aggregateBy(
    revenueRows.map((item) => ({ ...item, value: item.Amount })),
    "Channel",
  );

  const expenseData = aggregateBy(
    expenseRows.map((item) => ({ ...item, value: Math.abs(item.Amount) })),
    "Type",
  );

  const productInsights = getProductInsights(normalized, products);
  const restockCount = productInsights.filter(
    (item) => item.status === "Restock",
  ).length;
  const topChannel = channelData[0]?.name || "Belum ada";
  const topProduct =
    [...productInsights].sort((a, b) => b.revenue - a.revenue)[0]?.name ||
    "Belum ada";

  const scoreParts = [
    profitMargin >= 0.35 ? 25 : Math.max(0, profitMargin * 70),
    marketingRatio > 0 && marketingRatio <= 0.12 ? 20 : marketingRatio <= 0.2 ? 12 : 6,
    channelData.length >= 3 ? 20 : channelData.length * 6,
    restockCount === 0 ? 20 : Math.max(6, 20 - restockCount * 5),
    normalized.length >= 12 ? 15 : normalized.length,
  ];

  return {
    transactions: normalized,
    totalRevenue,
    totalExpense,
    netProfit,
    profitMargin,
    marketingSpend,
    marketingRatio,
    dailyData: Object.values(dailyMap),
    channelData,
    expenseData,
    productInsights,
    restockCount,
    topChannel,
    topProduct,
    aiReadinessScore: Math.round(
      scoreParts.reduce((sum, score) => sum + score, 0),
    ),
  };
}
