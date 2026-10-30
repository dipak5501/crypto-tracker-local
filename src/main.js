import "./style.css";
import { loadWatch, saveWatch, fetchMarkets, fmtUsd, fmtPct } from "./logic.js";

const root = document.querySelector("#app");
let watch = loadWatch();
let rows = [];
let error = "";
let busy = false;

async function refresh() {
  busy = true; error = ""; render();
  try {
    rows = await fetchMarkets(watch);
  } catch (e) {
    error = String(e.message || e);
    rows = [];
  } finally {
    busy = false; render();
  }
}

function render() {
  root.innerHTML = `
  <main class="app">
    <h1 class="brand">Local Crypto Tracker</h1>
    <p class="lede">Watchlist prices from CoinGecko, stored only in this browser. No account.</p>
    <div class="toolbar">
      <input id="add" placeholder="coin id (e.g. cardano)" />
      <button type="button" class="primary" id="addBtn">Add</button>
      <button type="button" id="refresh" ${busy ? "disabled" : ""}>${busy ? "Loading…" : "Refresh"}</button>
    </div>
    ${error ? `<p class="error">${error}</p>` : ""}
    <div class="grid">
      ${rows.map((c) => {
        const pct = c.price_change_percentage_24h;
        const cls = pct >= 0 ? "up" : "down";
        return `<article class="card">
          <h2>${c.name} <span style="opacity:.7">(${c.symbol?.toUpperCase() || ""})</span></h2>
          <div class="price">${fmtUsd(c.current_price)}</div>
          <div class="chg ${cls}">${fmtPct(pct)} 24h</div>
          <div class="meta">MCap ${fmtUsd(c.market_cap)} · Rank #${c.market_cap_rank ?? "—"}</div>
          <div class="meta"><button type="button" data-rm="${c.id}">Remove</button></div>
        </article>`;
      }).join("") || (busy ? "" : "<p class='meta'>No prices yet — hit Refresh.</p>")}
    </div>
    <section class="watch">
      <h2 style="margin:0 0 .6rem;font-size:1.05rem">Watchlist ids</h2>
      <table><thead><tr><th>id</th></tr></thead>
      <tbody>${watch.map((id) => `<tr><td>${id}</td></tr>`).join("")}</tbody></table>
    </section>
    <p class="foot">Data: public CoinGecko API · Updated locally on demand</p>
    <aside id="insights" class="foot"></aside>
  </main>`;

  root.querySelector("#refresh")?.addEventListener("click", refresh);
  root.querySelector("#addBtn")?.addEventListener("click", () => {
    const id = root.querySelector("#add").value.trim().toLowerCase();
    if (!id) return;
    if (!watch.includes(id)) { watch = [...watch, id]; saveWatch(watch); }
    root.querySelector("#add").value = "";
    refresh();
  });
  root.querySelectorAll("[data-rm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      watch = watch.filter((x) => x !== btn.getAttribute("data-rm"));
      saveWatch(watch);
      refresh();
    });
  });
}

render();
refresh();

fetch("./insights.json", { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data) return;
    const el = document.querySelector("#insights");
    if (el) el.innerHTML = "<strong>Web insights</strong> — " + (data.headline || "") + "<br/>" + (data.summary || "");
  })
  .catch(() => {});
