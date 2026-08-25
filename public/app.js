const statusEl = document.getElementById("status");
const form = document.getElementById("form");
const out = document.getElementById("out");
const go = document.getElementById("go");

async function loadHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    statusEl.textContent = `Scrapling ${data.scrapling} ready · clone ${data.clone}`;
  } catch (error) {
    statusEl.textContent = `Could not reach Scrapling: ${error.message}`;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  go.disabled = true;
  out.textContent = "Scraping…";
  try {
    const res = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: document.getElementById("url").value,
        fetcher: document.getElementById("fetcher").value,
        css: document.getElementById("css").value,
      }),
    });
    const data = await res.json();
    out.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    out.textContent = error.message;
  } finally {
    go.disabled = false;
  }
});

loadHealth();
