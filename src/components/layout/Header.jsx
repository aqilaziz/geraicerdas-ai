import { useContext } from "react";
import { Menu, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../../context/DataContext";

const titles = {
  "/": "Dashboard UMKM",
  "/copilot": "AI Copilot",
  "/budgets": "Pricing & Restock",
  "/transaction": "Transaksi",
  "/settings": "Data & AI",
};

export default function Header() {
  const location = useLocation();
  const { profile } = useContext(DataContext);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <label
          htmlFor="mobile-drawer"
          className="icon-button lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </label>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-950">
            {titles[location.pathname] || "GeraiCerdas AI"}
          </h1>
          <p className="truncate text-sm text-slate-500">
            {profile.name} - {profile.category}
          </p>
        </div>
      </div>
      <div className="hidden items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 sm:flex">
        <Sparkles size={16} />
        Generative AI MVP
      </div>
    </header>
  );
}
