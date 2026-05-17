import React from "react";
import {
  Bot,
  Copy,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import { DataContext } from "../context/DataContext";
import {
  buildLocalRecommendations,
  generateAdCopy,
  generateCustomerReply,
  generateWithRemoteAI,
} from "../lib/aiCopilot";

function TextPanel({
  title,
  value,
  onGenerate,
  isGenerating,
  generateDisabled,
  sourceLabel,
}) {
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
  };

  return (
    <section className="app-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {sourceLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="secondary-button min-h-10 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onGenerate}
            disabled={generateDisabled || isGenerating}
            title={
              generateDisabled
                ? "Isi dan simpan Endpoint AI di menu Data & AI"
                : "Generate ulang memakai endpoint AI"
            }
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            Generate AI
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={copy}
            title="Salin teks"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>
      <pre className="min-h-[260px] whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {value}
      </pre>
    </section>
  );
}

export default function Copilot() {
  const { profile, transactions, products, aiSettings } =
    React.useContext(DataContext);
  const productNames = products.map((item) => item.name);
  const [selectedProduct, setSelectedProduct] = React.useState(
    productNames[0] || "",
  );
  const [goal, setGoal] = React.useState("menaikkan repeat order minggu ini");
  const [tone, setTone] = React.useState("ramah, praktis, dan tidak hard sell");
  const [channel, setChannel] = React.useState("WhatsApp");
  const [question, setQuestion] = React.useState(
    "Kak, produk ini tahan berapa lama dan bisa kirim hari ini?",
  );
  const [customPrompt, setCustomPrompt] = React.useState(
    "Buat rencana growth 7 hari yang realistis untuk usaha ini.",
  );
  const [remoteResult, setRemoteResult] = React.useState("");
  const [remoteState, setRemoteState] = React.useState("idle");
  const [generatedAdCopy, setGeneratedAdCopy] = React.useState("");
  const [generatedReply, setGeneratedReply] = React.useState("");
  const [generatedDiagnosis, setGeneratedDiagnosis] = React.useState("");
  const [generatedExperiments, setGeneratedExperiments] = React.useState("");
  const [contentState, setContentState] = React.useState({
    adCopy: "idle",
    reply: "idle",
  });
  const [insightState, setInsightState] = React.useState({
    diagnosis: "idle",
    experiments: "idle",
  });

  const localPlan = React.useMemo(
    () => buildLocalRecommendations(profile, transactions, products),
    [products, profile, transactions],
  );

  const adCopy = React.useMemo(
    () =>
      generateAdCopy({
        profile,
        productName: selectedProduct,
        goal,
        tone,
        channel,
      }),
    [channel, goal, profile, selectedProduct, tone],
  );

  const customerReply = React.useMemo(
    () =>
      generateCustomerReply({
        profile,
        productName: selectedProduct,
        question,
      }),
    [profile, question, selectedProduct],
  );
  const hasRemoteAI = Boolean(aiSettings?.endpoint && aiSettings?.apiKey);

  React.useEffect(() => {
    setGeneratedAdCopy("");
  }, [adCopy]);

  React.useEffect(() => {
    setGeneratedReply("");
  }, [customerReply]);

  React.useEffect(() => {
    setGeneratedDiagnosis("");
    setGeneratedExperiments("");
  }, [localPlan]);

  const runInsightAI = async (type) => {
    const isDiagnosis = type === "diagnosis";
    const prompt = isDiagnosis
      ? [
          "Buat diagnosis bisnis UMKM berbasis data yang siap dibaca pemilik usaha.",
          "Format: ringkasan kondisi, masalah paling penting, peluang terbesar, risiko, dan 5 langkah prioritas minggu ini.",
          `Skor lokal: ${localPlan.score}/100.`,
          `Insight lokal: ${localPlan.actions.join(" | ")}`,
        ].join("\n")
      : [
          "Buat 5 eksperimen growth untuk UMKM ini.",
          "Setiap eksperimen harus punya nama, hipotesis, langkah eksekusi, channel, metrik sukses, durasi, dan risiko.",
          "Eksperimen harus realistis untuk pemilik UMKM tanpa tim marketing besar.",
        ].join("\n");

    setInsightState((current) => ({ ...current, [type]: "loading" }));
    try {
      const result = await generateWithRemoteAI({
        settings: aiSettings,
        profile,
        transactions,
        products,
        userPrompt: prompt,
      });

      if (isDiagnosis) setGeneratedDiagnosis(result);
      else setGeneratedExperiments(result);

      setInsightState((current) => ({ ...current, [type]: "done" }));
    } catch (error) {
      const message = `Gagal memakai endpoint AI: ${error.message}`;
      if (isDiagnosis) setGeneratedDiagnosis(message);
      else setGeneratedExperiments(message);
      setInsightState((current) => ({ ...current, [type]: "error" }));
    }
  };

  const runContentAI = async (type) => {
    const isAdCopy = type === "adCopy";
    const prompt = isAdCopy
      ? [
          `Buat copy promosi siap pakai untuk ${channel}.`,
          `Produk: ${selectedProduct}.`,
          `Goal: ${goal}.`,
          `Tone: ${tone}.`,
          "Formatkan dalam bahasa Indonesia, singkat, natural, ada penawaran, benefit, dan CTA.",
        ].join("\n")
      : [
          "Buat balasan pelanggan yang siap dikirim lewat chat.",
          `Produk: ${selectedProduct}.`,
          `Pertanyaan pelanggan: ${question}.`,
          `Tone: ${tone}.`,
          "Jawab ramah, jelas, tidak terlalu panjang, dan akhiri dengan pertanyaan lanjutan agar pelanggan membalas.",
        ].join("\n");

    setContentState((current) => ({ ...current, [type]: "loading" }));
    try {
      const result = await generateWithRemoteAI({
        settings: aiSettings,
        profile,
        transactions,
        products,
        userPrompt: prompt,
      });

      if (isAdCopy) setGeneratedAdCopy(result || adCopy);
      else setGeneratedReply(result || customerReply);

      setContentState((current) => ({ ...current, [type]: "done" }));
    } catch (error) {
      const message = `Gagal memakai endpoint AI: ${error.message}`;
      if (isAdCopy) setGeneratedAdCopy(message);
      else setGeneratedReply(message);
      setContentState((current) => ({ ...current, [type]: "error" }));
    }
  };

  const runRemoteAI = async () => {
    setRemoteState("loading");
    try {
      const result = await generateWithRemoteAI({
        settings: aiSettings,
        profile,
        transactions,
        products,
        userPrompt: customPrompt,
      });
      setRemoteResult(result || "Endpoint belum mengembalikan jawaban.");
      setRemoteState("done");
    } catch (error) {
      setRemoteResult(error.message);
      setRemoteState("error");
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="app-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Diagnosis AI
                </h2>
                <p className="text-sm text-slate-500">
                  Skor dan prioritas dari transaksi, channel, dan stok produk.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="secondary-button min-h-10 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => runInsightAI("diagnosis")}
              disabled={!hasRemoteAI || insightState.diagnosis === "loading"}
              title={
                hasRemoteAI
                  ? "Generate diagnosis memakai endpoint AI"
                  : "Isi dan simpan Endpoint AI di menu Data & AI"
              }
            >
              {insightState.diagnosis === "loading" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              Generate AI
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-end justify-between gap-4">
              <span className="text-sm text-slate-500">Skor kesiapan</span>
              <strong className="text-3xl text-slate-950">
                {localPlan.score}/100
              </strong>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-teal-600"
                style={{ width: `${Math.min(localPlan.score, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {localPlan.actions.slice(0, 5).map((action) => (
              <div
                key={action}
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700"
              >
                {action}
              </div>
            ))}
          </div>
          {generatedDiagnosis && (
            <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
              {generatedDiagnosis}
            </pre>
          )}
        </div>

        <div className="app-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Eksperimen growth
                </h2>
                <p className="text-sm text-slate-500">
                  Ide yang bisa diuji oleh UMKM tanpa tim marketing khusus.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="secondary-button min-h-10 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => runInsightAI("experiments")}
              disabled={!hasRemoteAI || insightState.experiments === "loading"}
              title={
                hasRemoteAI
                  ? "Generate eksperimen memakai endpoint AI"
                  : "Isi dan simpan Endpoint AI di menu Data & AI"
              }
            >
              {insightState.experiments === "loading" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              Generate AI
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {localPlan.experiments.map((item) => (
              <article
                key={item.name}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <h3 className="font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-1 text-xs font-medium text-blue-700">
                  {item.metric}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.idea}
                </p>
              </article>
            ))}
          </div>
          {generatedExperiments && (
            <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
              {generatedExperiments}
            </pre>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Generator konten
          </h2>
          <div className="mt-5 space-y-4">
            <label className="form-field">
              <span>Produk</span>
              <select
                value={selectedProduct}
                onChange={(event) => setSelectedProduct(event.target.value)}
              >
                {productNames.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Channel</span>
              <select
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
              >
                <option>WhatsApp</option>
                <option>Instagram</option>
                <option>Shopee</option>
                <option>Offline</option>
              </select>
            </label>
            <label className="form-field">
              <span>Goal</span>
              <input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />
            </label>
            <label className="form-field">
              <span>Tone</span>
              <input
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              />
            </label>
            <label className="form-field">
              <span>Pertanyaan pelanggan</span>
              <textarea
                rows={4}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TextPanel
            title="Copy promosi"
            value={generatedAdCopy || adCopy}
            onGenerate={() => runContentAI("adCopy")}
            isGenerating={contentState.adCopy === "loading"}
            generateDisabled={!hasRemoteAI}
            sourceLabel={generatedAdCopy ? "Hasil AI endpoint" : "Template lokal"}
          />
          <TextPanel
            title="Balasan pelanggan"
            value={generatedReply || customerReply}
            onGenerate={() => runContentAI("reply")}
            isGenerating={contentState.reply === "loading"}
            generateDisabled={!hasRemoteAI}
            sourceLabel={generatedReply ? "Hasil AI endpoint" : "Template lokal"}
          />
        </div>
      </section>

      <section className="app-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <MessageSquareText size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Mode AI endpoint
                </h2>
                <p className="text-sm text-slate-500">
                  Pakai endpoint OpenAI-compatible dari halaman Data & AI.
                </p>
              </div>
            </div>
            <textarea
              className="mt-5 min-h-[130px] w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              value={customPrompt}
              onChange={(event) => setCustomPrompt(event.target.value)}
            />
            <button
              type="button"
              className="primary-button mt-4"
              onClick={runRemoteAI}
              disabled={remoteState === "loading"}
            >
              {remoteState === "loading" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              Generate
            </button>
          </div>
          <pre className="min-h-[250px] flex-1 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {remoteResult ||
              "Jika endpoint kosong, gunakan diagnosis lokal dan generator konten di atas."}
          </pre>
        </div>
      </section>
    </div>
  );
}
