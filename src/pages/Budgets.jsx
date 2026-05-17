import React from "react";
import { Calculator, PackagePlus, PiggyBank, Target } from "lucide-react";
import { DataContext } from "../context/DataContext";
import {
  formatCurrency,
  formatNumber,
  getAnalytics,
  toNumber,
} from "../lib/analytics";
import { getPricingAdvice } from "../lib/aiCopilot";

function BudgetRow({ label, value, total, color }) {
  const ratio = total ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-slate-800">{label}</span>
        <span className="text-sm text-slate-500">{formatCurrency(value)}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full"
          style={{ width: `${ratio}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">{ratio}% dari pendapatan</p>
    </div>
  );
}

export default function Budgets() {
  const { transactions, products, profile, setProducts } =
    React.useContext(DataContext);
  const analytics = React.useMemo(
    () => getAnalytics(transactions, products),
    [products, transactions],
  );
  const [selectedId, setSelectedId] = React.useState(products[0]?.id || "");
  const selectedProduct =
    products.find((product) => product.id === selectedId) || products[0];
  const pricing = selectedProduct ? getPricingAdvice(selectedProduct) : null;

  const updateProduct = (field, value) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, [field]: toNumber(value) }
          : product,
      ),
    );
  };

  const addProduct = () => {
    const id = `prd-${Date.now()}`;
    const product = {
      id,
      name: "Produk Baru UMKM",
      stock: 20,
      avgDailySales: 2,
      leadTimeDays: 5,
      unitCost: 10000,
      sellingPrice: 22000,
      marketplaceFeeRate: 0.08,
      competitorPrice: 21000,
    };
    setProducts((current) => [...current, product]);
    setSelectedId(id);
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="app-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Target bulanan</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {formatCurrency(profile.monthlyTarget)}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <Target size={22} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Realisasi demo saat ini {formatCurrency(analytics.totalRevenue)}.
          </p>
        </article>

        <article className="app-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Rasio biaya</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {analytics.totalRevenue
                  ? Math.round((analytics.totalExpense / analytics.totalRevenue) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <PiggyBank size={22} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Idealnya biaya operasional tetap terkendali sebelum budget iklan
            dinaikkan.
          </p>
        </article>

        <article className="app-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Unit aktif</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {formatNumber(products.length)} produk
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
              <PackagePlus size={22} />
            </div>
          </div>
          <button type="button" className="secondary-button mt-4" onClick={addProduct}>
            Tambah produk
          </button>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="app-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
              <Calculator size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Kalkulator harga
              </h2>
              <p className="text-sm text-slate-500">
                Rekomendasi margin setelah modal dan fee marketplace.
              </p>
            </div>
          </div>

          {selectedProduct && (
            <div className="mt-5 space-y-4">
              <label className="form-field">
                <span>Produk</span>
                <select
                  value={selectedProduct.id}
                  onChange={(event) => setSelectedId(event.target.value)}
                >
                  {products.map((product) => (
                    <option value={product.id} key={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="form-field">
                  <span>Modal per unit</span>
                  <input
                    type="number"
                    value={selectedProduct.unitCost}
                    onChange={(event) =>
                      updateProduct("unitCost", event.target.value)
                    }
                  />
                </label>
                <label className="form-field">
                  <span>Harga jual</span>
                  <input
                    type="number"
                    value={selectedProduct.sellingPrice}
                    onChange={(event) =>
                      updateProduct("sellingPrice", event.target.value)
                    }
                  />
                </label>
                <label className="form-field">
                  <span>Fee marketplace</span>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedProduct.marketplaceFeeRate}
                    onChange={(event) =>
                      updateProduct("marketplaceFeeRate", event.target.value)
                    }
                  />
                </label>
                <label className="form-field">
                  <span>Harga kompetitor</span>
                  <input
                    type="number"
                    value={selectedProduct.competitorPrice}
                    onChange={(event) =>
                      updateProduct("competitorPrice", event.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {pricing && selectedProduct && (
          <div className="app-card p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Saran harga AI
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Laba per unit</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {formatCurrency(pricing.profit)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Margin</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {Math.round(pricing.margin * 100)}%
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Harga target</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {formatCurrency(pricing.targetPrice)}
                </p>
              </div>
            </div>
            <p className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-900">
              {pricing.advice}
            </p>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Alokasi biaya
          </h2>
          <div className="mt-5 space-y-3">
            {analytics.expenseData.map((item, index) => (
              <BudgetRow
                key={item.name}
                label={item.name}
                value={item.value}
                total={analytics.totalRevenue}
                color={["#0f766e", "#2563eb", "#f59e0b", "#dc2626"][index % 4]}
              />
            ))}
          </div>
        </div>

        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Rencana restock
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">Produk</th>
                  <th className="px-3 py-3 font-medium">Stok</th>
                  <th className="px-3 py-3 font-medium">Hari tersisa</th>
                  <th className="px-3 py-3 font-medium">Saran</th>
                </tr>
              </thead>
              <tbody>
                {analytics.productInsights.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{product.stock}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {product.daysLeft.toFixed(1)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.status === "Restock"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
