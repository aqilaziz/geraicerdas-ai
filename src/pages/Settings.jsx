import { useContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { CheckCircle2, Database, RefreshCw, Save, UploadCloud } from "lucide-react";
import { DataContext } from "../context/DataContext";
import { demoData } from "../data/demoData";
import { normalizeTransaction } from "../lib/analytics";

const fieldNames = [
  "Date",
  "Description",
  "Amount",
  "Channel",
  "Type",
  "Product",
  "Quantity",
  "Customer",
];

function demoCsv() {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    fieldNames.join(","),
    ...demoData.map((row) => fieldNames.map((field) => escape(row[field])).join(",")),
  ].join("\n");
}

export default function Settings() {
  const {
    transactions,
    setTransactions,
    profile,
    setProfile,
    aiSettings,
    setAiSettings,
    resetDemo,
    clearAll,
  } = useContext(DataContext);
  const [manual, setManual] = useState({
    Date: new Date().toISOString().slice(0, 10),
    Description: "Penjualan WhatsApp - Produk UMKM",
    Amount: "250000",
    Channel: "WhatsApp",
    Type: "Revenue",
    Product: "",
    Quantity: "1",
    Customer: "",
  });
  const [uploadStatus, setUploadStatus] = useState("");
  const [profileDraft, setProfileDraft] = useState(profile);
  const [profileSaveStatus, setProfileSaveStatus] = useState("Tersimpan");
  const [aiDraft, setAiDraft] = useState(aiSettings);
  const [aiSaveStatus, setAiSaveStatus] = useState("Tersimpan otomatis");

  useEffect(() => {
    setProfileDraft(profile);
  }, [profile]);

  useEffect(() => {
    setAiDraft(aiSettings);
  }, [aiSettings]);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(normalizeTransaction);
        setTransactions(rows);
        setUploadStatus(`${rows.length} transaksi dimuat`);
      },
    });
  };

  const addManualTransaction = () => {
    setTransactions((current) => [normalizeTransaction(manual), ...current]);
    setManual((current) => ({
      ...current,
      Description: "",
      Amount: "",
      Product: "",
      Quantity: "",
      Customer: "",
    }));
  };

  const downloadTemplate = () => {
    const blob = new Blob([demoCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template-transaksi-umkm.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveProfile = () => {
    setProfile(profileDraft);
    setProfileSaveStatus("Profil UMKM tersimpan");
  };

  const updateProfileDraft = (field, value) => {
    setProfileDraft((current) => ({ ...current, [field]: value }));
    setProfileSaveStatus("Belum disimpan");
  };

  const saveAiSettings = () => {
    setAiSettings(aiDraft);
    setAiSaveStatus("Konfigurasi AI tersimpan");
  };

  const updateAiDraft = (field, value) => {
    setAiDraft((current) => ({ ...current, [field]: value }));
    setAiSaveStatus("Belum disimpan");
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="app-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                <Database size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Profil UMKM
                </h2>
                <p className="text-sm text-slate-500">
                  Dipakai AI untuk membaca konteks bisnis.
                </p>
              </div>
            </div>
            <span className="hidden rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 sm:inline-flex">
              {profileSaveStatus}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="form-field">
              <span>Nama usaha</span>
              <input
                value={profileDraft.name}
                onChange={(event) =>
                  updateProfileDraft("name", event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span>Pemilik</span>
              <input
                value={profileDraft.owner}
                onChange={(event) =>
                  updateProfileDraft("owner", event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span>Kota</span>
              <input
                value={profileDraft.city}
                onChange={(event) =>
                  updateProfileDraft("city", event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span>Kategori</span>
              <input
                value={profileDraft.category}
                onChange={(event) =>
                  updateProfileDraft("category", event.target.value)
                }
              />
            </label>
            <label className="form-field sm:col-span-2">
              <span>Value proposition</span>
              <textarea
                rows={3}
                value={profileDraft.uniqueValue}
                onChange={(event) =>
                  updateProfileDraft("uniqueValue", event.target.value)
                }
              />
            </label>
          </div>
          <button
            type="button"
            className="primary-button mt-5 w-full sm:w-auto"
            onClick={saveProfile}
          >
            <Save size={18} />
            Simpan profil UMKM
          </button>
          <p className="mt-3 text-sm text-slate-500 sm:hidden">
            {profileSaveStatus}
          </p>
        </div>

        <div className="app-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <UploadCloud size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Data transaksi
              </h2>
              <p className="text-sm text-slate-500">
                Format CSV: Date, Description, Amount, Channel, Type, Product,
                Quantity, Customer.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-teal-600">
              <UploadCloud className="text-slate-500" size={24} />
              <span className="mt-2 text-sm font-medium text-slate-700">
                Upload CSV
              </span>
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={handleFile}
              />
            </label>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Data aktif</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {transactions.length} transaksi
              </p>
              <p className="mt-2 text-sm text-teal-700">{uploadStatus}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="secondary-button" onClick={downloadTemplate}>
              <Save size={18} />
              Template CSV
            </button>
            <button type="button" className="secondary-button" onClick={resetDemo}>
              <RefreshCw size={18} />
              Muat demo
            </button>
            <button type="button" className="danger-button" onClick={clearAll}>
              Kosongkan
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Tambah transaksi cepat
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="form-field">
              <span>Tanggal</span>
              <input
                type="date"
                value={manual.Date}
                onChange={(event) =>
                  setManual({ ...manual, Date: event.target.value })
                }
              />
            </label>
            <label className="form-field md:col-span-2">
              <span>Deskripsi</span>
              <input
                value={manual.Description}
                onChange={(event) =>
                  setManual({ ...manual, Description: event.target.value })
                }
              />
            </label>
            <label className="form-field">
              <span>Nominal</span>
              <input
                type="number"
                value={manual.Amount}
                onChange={(event) =>
                  setManual({ ...manual, Amount: event.target.value })
                }
              />
            </label>
            <label className="form-field">
              <span>Channel</span>
              <select
                value={manual.Channel}
                onChange={(event) =>
                  setManual({ ...manual, Channel: event.target.value })
                }
              >
                <option>WhatsApp</option>
                <option>Instagram</option>
                <option>Shopee</option>
                <option>Offline</option>
                <option>Logistik</option>
              </select>
            </label>
            <label className="form-field">
              <span>Kategori</span>
              <select
                value={manual.Type}
                onChange={(event) =>
                  setManual({ ...manual, Type: event.target.value })
                }
              >
                <option>Revenue</option>
                <option>Bahan Baku</option>
                <option>Marketing</option>
                <option>Logistik</option>
                <option>Operasional</option>
                <option>Gaji</option>
                <option>Marketplace Fee</option>
              </select>
            </label>
            <label className="form-field">
              <span>Produk</span>
              <input
                value={manual.Product}
                onChange={(event) =>
                  setManual({ ...manual, Product: event.target.value })
                }
              />
            </label>
            <label className="form-field">
              <span>Pelanggan</span>
              <input
                value={manual.Customer}
                onChange={(event) =>
                  setManual({ ...manual, Customer: event.target.value })
                }
              />
            </label>
          </div>
          <button
            type="button"
            className="primary-button mt-5"
            onClick={addManualTransaction}
          >
            Simpan transaksi
          </button>
        </div>

        <div className="app-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Endpoint AI
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Isi provider AI, lalu klik simpan sebelum memakai Mode AI endpoint.
              </p>
            </div>
            <span className="hidden items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 sm:inline-flex">
              <CheckCircle2 size={14} />
              {aiSaveStatus}
            </span>
          </div>
          <div className="mt-5 space-y-4">
            <label className="form-field">
              <span>Provider</span>
              <input
                value={aiDraft.providerName}
                onChange={(event) =>
                  updateAiDraft("providerName", event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span>Endpoint chat completions</span>
              <input
                value={aiDraft.endpoint}
                placeholder="https://api.example.com/v1/chat/completions"
                onChange={(event) =>
                  updateAiDraft("endpoint", event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span>Model</span>
              <input
                value={aiDraft.model}
                onChange={(event) =>
                  updateAiDraft("model", event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span>API key</span>
              <input
                type="password"
                value={aiDraft.apiKey}
                onChange={(event) =>
                  updateAiDraft("apiKey", event.target.value)
                }
              />
            </label>
          </div>
          <button
            type="button"
            className="primary-button mt-5 w-full sm:w-auto"
            onClick={saveAiSettings}
          >
            <Save size={18} />
            Simpan konfigurasi AI
          </button>
          <p className="mt-3 text-sm text-slate-500 sm:hidden">{aiSaveStatus}</p>
        </div>
      </section>
    </div>
  );
}
