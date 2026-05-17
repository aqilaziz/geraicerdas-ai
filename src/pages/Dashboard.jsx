import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Banknote,
  Megaphone,
  PackageCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { DataContext } from "../context/DataContext";
import { useMarketSignal } from "../hooks/useMarketSignal";
import { formatCurrency, formatNumber, getAnalytics } from "../lib/analytics";
import { buildLocalRecommendations } from "../lib/aiCopilot";

const chartColors = ["#0f766e", "#2563eb", "#f59e0b", "#dc2626", "#7c3aed"];

function useMeasuredWidth() {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(0, Math.floor(entry.contentRect.width)));
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

function ChartFrame({ height, children }) {
  const [ref, width] = useMeasuredWidth();

  return (
    <div ref={ref} className="min-w-0" style={{ height }}>
      {width > 0 ? children(width, height) : null}
    </div>
  );
}

function MetricCard({ icon, label, value, detail, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <article className="app-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`rounded-lg border p-2 ${tones[tone]}`}>
          {React.createElement(icon, { size: 20 })}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{detail}</p>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="app-card flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <Sparkles className="text-teal-700" size={34} />
      <h2 className="mt-4 text-xl font-semibold text-slate-950">
        Data usaha belum tersedia
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Muat data demo atau unggah CSV transaksi di halaman Data & AI.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { transactions, products, profile } = React.useContext(DataContext);
  const analytics = React.useMemo(
    () => getAnalytics(transactions, products),
    [products, transactions],
  );
  const marketSignal = useMarketSignal();
  const aiPlan = React.useMemo(
    () => buildLocalRecommendations(profile, transactions, products),
    [products, profile, transactions],
  );

  if (!transactions?.length) return <EmptyState />;

  const marginLabel = `${Math.round(analytics.profitMargin * 100)}% margin`;
  const marketingLabel = `${Math.round(
    analytics.marketingRatio * 100,
  )}% dari revenue`;
  const urgentProducts = analytics.productInsights.filter(
    (item) => item.status === "Restock",
  );

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Banknote}
          label="Pendapatan"
          value={formatCurrency(analytics.totalRevenue)}
          detail={`Channel utama: ${analytics.topChannel}`}
          tone="teal"
        />
        <MetricCard
          icon={TrendingUp}
          label="Laba bersih"
          value={formatCurrency(analytics.netProfit)}
          detail={marginLabel}
          tone="blue"
        />
        <MetricCard
          icon={Megaphone}
          label="Belanja marketing"
          value={formatCurrency(analytics.marketingSpend)}
          detail={marketingLabel}
          tone="amber"
        />
        <MetricCard
          icon={PackageCheck}
          label="Kesiapan scale"
          value={`${analytics.aiReadinessScore}/100`}
          detail={`${analytics.restockCount} produk perlu diawasi`}
          tone={analytics.restockCount ? "rose" : "teal"}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="app-card p-5">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Cashflow harian
              </h2>
              <p className="text-sm text-slate-500">
                Revenue, biaya, dan laba operasional.
              </p>
            </div>
            <span className="text-sm font-medium text-teal-700">
              Produk unggulan: {analytics.topProduct}
            </span>
          </div>
          <ChartFrame height={340}>
            {(width, height) => (
              <AreaChart width={width} height={height} data={analytics.dailyData}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expense" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Area
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#0f766e"
                  fill="url(#revenue)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="expense"
                  name="Biaya"
                  stroke="#dc2626"
                  fill="url(#expense)"
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ChartFrame>
        </div>

        <div className="app-card p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Rekomendasi AI
            </h2>
            <p className="text-sm text-slate-500">
              Prioritas yang dihitung dari transaksi dan stok.
            </p>
          </div>
          <div className="space-y-3">
            {aiPlan.findings.map((finding) => (
              <article
                key={finding.title}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">
                    {finding.title}
                  </h3>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    {finding.impact}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {finding.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Revenue per channel
          </h2>
          <div className="mt-5">
            <ChartFrame height={280}>
              {(width, height) => (
              <BarChart
                width={width}
                height={height}
                data={analytics.channelData}
                layout="vertical"
              >
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={88}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
              )}
            </ChartFrame>
          </div>
        </div>

        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Komposisi biaya
          </h2>
          <div className="mt-5">
            <ChartFrame height={280}>
              {(width, height) => (
              <PieChart width={width} height={height}>
                <Pie
                  data={analytics.expenseData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={94}
                  paddingAngle={3}
                >
                  {analytics.expenseData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
              )}
            </ChartFrame>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {analytics.expenseData.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: chartColors[index % chartColors.length] }}
                />
                <span className="truncate text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="app-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Alarm stok
              </h2>
              <p className="text-sm text-slate-500">
                Berdasarkan lead time dan rata-rata penjualan.
              </p>
            </div>
            {urgentProducts.length > 0 && (
              <AlertTriangle className="text-amber-600" size={22} />
            )}
          </div>
          <div className="mt-5 space-y-3">
            {analytics.productInsights.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-950">
                    {product.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    Stok {product.stock} pcs, {product.daysLeft.toFixed(1)} hari
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    product.status === "Restock"
                      ? "bg-rose-50 text-rose-700"
                      : product.status === "Cek Harga"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-teal-50 text-teal-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-card p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Live market signal
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kurs publik USD/IDR untuk membaca risiko bahan baku, kemasan, dan
              iklan platform global.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">USD/IDR</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {marketSignal.usdIdr
                  ? formatNumber(marketSignal.usdIdr)
                  : marketSignal.status === "loading"
                    ? "Memuat"
                    : "Offline"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Tanggal data</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {marketSignal.date || "-"}
              </p>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Sinyal AI</p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                {marketSignal.usdIdr && marketSignal.usdIdr > 16500
                  ? "Review harga kemasan dan bahan impor sebelum promo besar."
                  : "Biaya eksternal relatif aman untuk eksperimen promo pendek."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
