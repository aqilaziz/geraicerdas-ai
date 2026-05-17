import { Link, useLocation } from "react-router-dom";
import {
  Bot,
  ChartNoAxesCombined,
  Database,
  ReceiptText,
  Store,
  WalletCards,
} from "lucide-react";

const links = [
  { name: "Dashboard", to: "/", icon: ChartNoAxesCombined },
  { name: "AI Copilot", to: "/copilot", icon: Bot },
  { name: "Pricing & Stok", to: "/budgets", icon: WalletCards },
  { name: "Transaksi", to: "/transaction", icon: ReceiptText },
  { name: "Data & AI", to: "/settings", icon: Database },
];

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-400 text-slate-950">
            <Store size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold">GeraiCerdas AI</p>
            <p className="text-sm text-slate-400">UMKM Growth Copilot</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = path === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                const drawer = document.getElementById("mobile-drawer");
                if (drawer) drawer.checked = false;
              }}
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 text-sm text-slate-400">
        <p className="font-medium text-slate-200">Challenge 973</p>
        <p className="mt-1">Digitalization & Acceleration of MSMEs with AI</p>
      </div>
    </aside>
  );
}
