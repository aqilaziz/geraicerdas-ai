import React from "react";

export function useMarketSignal() {
  const [signal, setSignal] = React.useState({
    status: "loading",
    usdIdr: null,
    date: "",
  });

  React.useEffect(() => {
    let active = true;

    async function loadSignal() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!response.ok) throw new Error("market signal unavailable");
        const data = await response.json();
        if (!active) return;
        setSignal({
          status: "ready",
          usdIdr: data.rates?.IDR ?? null,
          date: data.time_last_update_utc
            ? data.time_last_update_utc.slice(0, 16)
            : "",
        });
      } catch {
        if (!active) return;
        setSignal({ status: "offline", usdIdr: null, date: "" });
      }
    }

    loadSignal();

    return () => {
      active = false;
    };
  }, []);

  return signal;
}
