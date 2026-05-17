const keywords = {
  Revenue: ["penjualan", "sales", "order", "whatsapp", "shopee", "instagram"],
  "Bahan Baku": ["bahan", "tepung", "bumbu", "ikan", "singkong", "supplier"],
  Marketing: ["iklan", "ads", "endorsement", "reels", "konten", "promo"],
  Logistik: ["ongkos", "kirim", "jne", "grab", "gojek", "logistik", "kurir"],
  Gaji: ["gaji", "upah", "produksi", "packing"],
  Operasional: ["listrik", "sewa", "kemasan", "stiker", "label", "kardus"],
  "Marketplace Fee": ["komisi", "admin", "marketplace fee"],
};

export default function categorize(description = "", explicitType = "") {
  if (explicitType && explicitType !== "Other") return explicitType;

  const desc = description.toLowerCase();
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => desc.includes(word))) {
      return category;
    }
  }

  return "Other";
}
