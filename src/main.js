import { run } from "./logic.js";
const app = document.querySelector("#app");
app.innerHTML = `<main style="font-family:Georgia,serif;max-width:720px;margin:3rem auto;padding:0 1rem;background:linear-gradient(180deg,#f7f3ea,#e8eef5);min-height:100vh"><h1>Local Crypto Tracker</h1><p>A simple, local web app for tracking cryptocurrency prices and trends in your area.</p><div id="out"></div></main>`;
document.querySelector("#out").textContent = run();


// Self-adaptation insights (injected)
fetch("/insights.json", { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data) return;
    const box = document.createElement("aside");
    box.className = "foot";
    box.style.cssText = "margin-top:1.25rem;padding:0.85rem 1rem;border:1px solid var(--line,#243041);border-radius:12px;max-width:1100px;margin-left:auto;margin-right:auto";
    box.innerHTML = "<strong>Web insights</strong><div>" + (data.headline || "") + "</div><div style=\"opacity:.85\">" + (data.summary || "") + "</div>";
    document.body.appendChild(box);
  })
  .catch(() => {});
