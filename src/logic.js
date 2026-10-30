const DEFAULTS = ["bitcoin", "ethereum", "solana", "dogecoin"];
const KEY = "nae-crypto-watch";

export function loadWatch() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...DEFAULTS];
}

export function saveWatch(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export async function fetchMarkets(ids) {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
    encodeURIComponent(ids.join(",")) +
    "&order=market_cap_desc&sparkline=false&price_change_percentage=24h";
  const res = await fetch(url);
  if (!res.ok) throw new Error("CoinGecko " + res.status);
  return res.json();
}

export function fmtUsd(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n < 1 ? 6 : 2 }).format(n);
}

export function fmtPct(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return sign + n.toFixed(2) + "%";
}
