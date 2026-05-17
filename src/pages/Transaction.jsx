import React from "react";
import { Download, Search } from "lucide-react";
import { DataContext } from "../context/DataContext";
import {
  formatCurrency,
  getAnalytics,
  normalizeTransaction,
} from "../lib/analytics";

function toCsv(rows) {
  const headers = [
    "Date",
    "Description",
    "Amount",
    "Channel",
    "Type",
    "Product",
    "Quantity",
    "Customer",
  ];
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\n");
}

export default function Transaction() {
  const { transactions, products } = React.useContext(DataContext);
  const analytics = React.useMemo(
    () => getAnalytics(transactions, products),
    [products, transactions],
  );
  const [query, setQuery] = React.useState("");
  const [channel, setChannel] = React.useState("Semua");
  const [type, setType] = React.useState("Semua");

  const channels = [
    "Semua",
    ...new Set(analytics.transactions.map((item) => item.Channel)),
  ];
  const types = ["Semua", ...new Set(analytics.transactions.map((item) => item.Type))];

  const filtered = analytics.transactions.filter((item) => {
    const text = `${item.Description} ${item.Product} ${item.Customer}`.toLowerCase();
    const matchQuery = text.includes(query.toLowerCase());
    const matchChannel = channel === "Semua" || item.Channel === channel;
    const matchType = type === "Semua" || item.Type === type;
    return matchQuery && matchChannel && matchType;
  });

  const downloadCsv = () => {
    const blob = new Blob([toCsv(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "geraicerdas-transaksi.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="app-card p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari transaksi, produk, pelanggan"
            />
          </label>
          <select
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
          >
            {channels.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <select
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {types.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <button type="button" className="secondary-button" onClick={downloadCsv}>
            <Download size={18} />
            Export
          </button>
        </div>
      </section>

      <section className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">Tanggal</th>
                <th className="px-5 py-4 font-medium">Deskripsi</th>
                <th className="px-5 py-4 font-medium">Channel</th>
                <th className="px-5 py-4 font-medium">Kategori</th>
                <th className="px-5 py-4 text-right font-medium">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((raw, index) => {
                const item = normalizeTransaction(raw);
                return (
                  <tr
                    key={`${item.Date}-${item.Description}-${index}`}
                    className="border-t border-slate-100"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {item.Date}
                    </td>
                    <td className="min-w-[320px] px-5 py-4">
                      <p className="font-medium text-slate-950">
                        {item.Description}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.Product || "Operasional"}{" "}
                        {item.Customer ? `- ${item.Customer}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.Channel}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {item.Type}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                        item.Amount >= 0 ? "text-teal-700" : "text-rose-700"
                      }`}
                    >
                      {formatCurrency(item.Amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
