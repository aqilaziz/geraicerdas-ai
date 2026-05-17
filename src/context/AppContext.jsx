import React from "react";
import { businessProfile, demoData, demoProducts } from "../data/demoData";
import { DataContext } from "./DataContext";

const storageKeys = {
  transactions: "geraicerdas.transactions",
  profile: "geraicerdas.profile",
  products: "geraicerdas.products",
  aiSettings: "geraicerdas.aiSettings",
};

const defaultAiSettings = {
  providerName: "Local Insight Engine",
  endpoint: "",
  apiKey: "",
  model: "gpt-4o-mini",
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = React.useState(() => readStorage(key, fallback));

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function AppContext({ children }) {
  const [transactions, setTransactions] = useStoredState(
    storageKeys.transactions,
    demoData,
  );
  const [profile, setProfile] = useStoredState(storageKeys.profile, businessProfile);
  const [products, setProducts] = useStoredState(storageKeys.products, demoProducts);
  const [aiSettings, setAiSettings] = useStoredState(
    storageKeys.aiSettings,
    defaultAiSettings,
  );

  const resetDemo = React.useCallback(() => {
    setTransactions(demoData);
    setProfile(businessProfile);
    setProducts(demoProducts);
  }, [setProducts, setProfile, setTransactions]);

  const clearAll = React.useCallback(() => {
    setTransactions([]);
    setProducts([]);
  }, [setProducts, setTransactions]);

  return (
    <DataContext.Provider
      value={{
        transactions,
        setTransactions,
        profile,
        setProfile,
        products,
        setProducts,
        aiSettings,
        setAiSettings,
        resetDemo,
        clearAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
