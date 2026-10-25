import { run } from "./logic.js";
const app = document.querySelector("#app");
app.innerHTML = `<main style="font-family:Georgia,serif;max-width:720px;margin:3rem auto;padding:0 1rem;background:linear-gradient(180deg,#f7f3ea,#e8eef5);min-height:100vh"><h1>Local Crypto Tracker</h1><p>A simple, local web app for tracking cryptocurrency prices and trends in your area.</p><div id="out"></div></main>`;
document.querySelector("#out").textContent = run();
