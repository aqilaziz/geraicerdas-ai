import { formatCurrency, formatNumber, getAnalytics } from "./analytics";

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

export function createBusinessSnapshot(profile, analytics) {
  return [
    `Bisnis: ${profile.name} (${profile.category}) di ${profile.city}.`,
    `Pendapatan: ${formatCurrency(analytics.totalRevenue)}.`,
    `Laba bersih: ${formatCurrency(analytics.netProfit)} dengan margin ${percent(
      analytics.profitMargin,
    )}.`,
    `Channel terbaik: ${analytics.topChannel}. Produk terkuat: ${analytics.topProduct}.`,
    `Belanja marketing: ${formatCurrency(
      analytics.marketingSpend,
    )} atau ${percent(analytics.marketingRatio)} dari pendapatan.`,
    `Produk butuh restock: ${analytics.restockCount}.`,
  ].join(" ");
}

export function buildLocalRecommendations(profile, transactions, products) {
  const analytics = getAnalytics(transactions, products);
  const productRisks = analytics.productInsights
    .filter((item) => item.status !== "Sehat")
    .slice(0, 3);

  const findings = [
    {
      title: "Fokus channel paling cepat closing",
      body: `${analytics.topChannel} memberi kontribusi pendapatan terbesar. Gandakan format penawaran yang sudah terbukti di channel ini sebelum menambah eksperimen baru.`,
      impact: "Tinggi",
    },
    {
      title: "Jaga margin sebelum scale iklan",
      body: `Margin saat ini ${percent(
        analytics.profitMargin,
      )}. Target aman untuk makanan ringan adalah 35-45% setelah biaya kemasan, subsidi ongkir, dan fee marketplace.`,
      impact: analytics.profitMargin >= 0.35 ? "Stabil" : "Prioritas",
    },
    {
      title: "Otomasi respons pelanggan",
      body: `Produk seperti ${analytics.topProduct} bisa dipaketkan dengan template jawaban WhatsApp agar pemilik usaha tidak kehilangan calon pembeli saat jam produksi.`,
      impact: "Cepat",
    },
  ];

  const actions = [
    `Buat 3 variasi konten: testimoni pelanggan, proses produksi higienis, dan bundling hemat untuk ${analytics.topProduct}.`,
    `Pasang minimum order reseller dan bonus margin bertingkat di ${analytics.topChannel}.`,
    `Pisahkan kas iklan maksimal ${percent(
      Math.min(0.12, Math.max(0.08, analytics.marketingRatio || 0.08)),
    )} dari pendapatan mingguan.`,
    `Gunakan pesan follow-up otomatis H+3 untuk pembeli marketplace yang belum repeat order.`,
  ];

  if (productRisks.length) {
    actions.unshift(
      `Restock ${productRisks
        .map((item) => item.name)
        .join(", ")} sebelum stok turun melewati lead time supplier.`,
    );
  }

  const experiments = [
    {
      name: "Bundling anti-ragu",
      metric: "Conversion rate WhatsApp",
      idea: `Tawarkan paket 3 varian dengan garansi tukar rasa untuk pembeli pertama ${profile.city}.`,
    },
    {
      name: "Konten UGC reseller",
      metric: "Biaya per chat",
      idea: "Minta reseller merekam video unboxing 15 detik, lalu jadikan iklan Reels dengan CTA chat admin.",
    },
    {
      name: "Harga jangkar marketplace",
      metric: "Laba per order",
      idea: "Buat paket premium yang lebih mahal agar produk reguler terlihat lebih terjangkau tanpa perang harga.",
    },
  ];

  return {
    score: analytics.aiReadinessScore,
    snapshot: createBusinessSnapshot(profile, analytics),
    findings,
    actions,
    experiments,
  };
}

export function generateAdCopy({
  profile,
  productName,
  goal,
  tone,
  channel,
}) {
  const selectedProduct = productName || "produk best seller";
  const selectedGoal = goal || "naikkan penjualan minggu ini";
  const selectedTone = tone || "ramah dan meyakinkan";
  const selectedChannel = channel || "WhatsApp";

  const headline =
    selectedChannel === "Instagram"
      ? `${selectedProduct} yang bikin stok camilan kantor aman`
      : `Halo kak, ${selectedProduct} ready hari ini`;

  const body = [
    headline,
    "",
    `Dibuat oleh ${profile.name}, ${selectedProduct} cocok untuk pelanggan yang ingin camilan praktis, rapi untuk dikirim, dan rasanya konsisten.`,
    `Goal promo: ${selectedGoal}. Gaya komunikasi: ${selectedTone}.`,
    "",
    "Penawaran:",
    "- Beli 3 pouch lebih hemat",
    "- Bisa kirim cepat area kota",
    "- Cocok untuk reseller, hampers, dan stok kantor",
    "",
    `CTA: Balas "MAU ${selectedProduct.toUpperCase().slice(
      0,
      18,
    )}" untuk cek stok dan ongkir hari ini.`,
  ];

  return body.join("\n");
}

export function generateCustomerReply({ profile, productName, question }) {
  const product = productName || "produk kami";
  const asked = question || "harganya berapa dan bisa kirim hari ini?";

  return [
    `Kak, terima kasih sudah tanya ${product} di ${profile.name}.`,
    `Untuk pertanyaan kakak: "${asked}"`,
    "",
    "Jawaban singkat:",
    `- ${product} ready selama stok masih tersedia.`,
    "- Bisa dibantu cek ongkir sesuai alamat.",
    "- Kalau untuk reseller atau hampers, kami bisa bantu rekomendasikan paket yang margin-nya paling enak.",
    "",
    "Boleh kirim kecamatan dan jumlah pesanan yang diinginkan? Nanti saya hitungkan total paling hemat.",
  ].join("\n");
}

export function getPricingAdvice(product) {
  const feeRate = product.marketplaceFeeRate || 0;
  const fee = product.sellingPrice * feeRate;
  const profit = product.sellingPrice - product.unitCost - fee;
  const margin = product.sellingPrice ? profit / product.sellingPrice : 0;
  const targetMargin = 0.42;
  const targetPrice = Math.ceil(
    product.unitCost / Math.max(0.15, 1 - feeRate - targetMargin) / 500,
  ) * 500;
  const competitorGap = product.sellingPrice - (product.competitorPrice || 0);

  return {
    fee,
    profit,
    margin,
    targetPrice,
    competitorGap,
    advice:
      margin < 0.35
        ? "Naikkan harga atau buat bundling karena margin terlalu tipis untuk iklan dan subsidi ongkir."
        : competitorGap > 3000
          ? "Harga lebih tinggi dari kompetitor. Perkuat pembeda: rasa konsisten, kemasan, bonus reseller, dan testimoni."
          : "Harga cukup kompetitif. Fokuskan promo pada volume order dan repeat purchase.",
  };
}

export async function generateWithRemoteAI({
  settings,
  profile,
  transactions,
  products,
  userPrompt,
}) {
  if (!settings?.endpoint || !settings?.apiKey) {
    return "";
  }

  const analytics = getAnalytics(transactions, products);
  const snapshot = createBusinessSnapshot(profile, analytics);

  const response = await fetch(settings.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Anda adalah konsultan growth untuk UMKM Indonesia. Jawab praktis, spesifik, dan gunakan bahasa Indonesia.",
        },
        {
          role: "user",
          content: `${snapshot}\n\nProduk: ${JSON.stringify(
            products,
          )}\n\nPermintaan: ${userPrompt}`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI endpoint gagal: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export function buildSubmissionHighlights(profile, transactions, products) {
  const analytics = getAnalytics(transactions, products);
  return [
    {
      label: "Target UMKM",
      value: `${profile.category} di ${profile.city}`,
    },
    {
      label: "Data aktif",
      value: `${formatNumber(transactions.length)} transaksi dan ${formatNumber(
        products.length,
      )} produk`,
    },
    {
      label: "Dampak",
      value: `AI membaca margin ${percent(
        analytics.profitMargin,
      )}, channel unggulan, risiko stok, dan peluang konten.`,
    },
  ];
}
