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

const signalsOut = document.getElementById("signals-out");
const loadSignals = document.getElementById("load-signals");
const runSignals = document.getElementById("run-signals");

async function readSignals(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }
  const summary = {
    feed: data.feed,
    generated_at: data.generated_at,
    signal_count: (data.signals || []).length,
    signals: data.signals,
    linkedin_watch: data.linkedin_watch,
    sources: data.sources,
  };
  signalsOut.textContent = JSON.stringify(summary, null, 2);
}

if (loadSignals && runSignals) {
  loadSignals.addEventListener("click", async () => {
    loadSignals.disabled = true;
    signalsOut.textContent = "Loading feed…";
    try {
      await readSignals(await fetch("/api/signals"));
    } catch (error) {
      signalsOut.textContent = error.message;
    } finally {
      loadSignals.disabled = false;
    }
  });

  runSignals.addEventListener("click", async () => {
    runSignals.disabled = true;
    signalsOut.textContent = "Scanning About/careers pages and SEEK keyword search…";
    try {
      await readSignals(
        await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      );
    } catch (error) {
      signalsOut.textContent = error.message;
    } finally {
      runSignals.disabled = false;
    }
  });
}

const enrichOut = document.getElementById("enrich-out");
const loadEnrich = document.getElementById("load-enrich");
const runEnrich = document.getElementById("run-enrich");

async function readEnrich(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }
  enrichOut.textContent = JSON.stringify(
    {
      feed: data.feed,
      generated_at: data.generated_at,
      counts: data.counts,
      clay: data.clay,
      sources: data.sources,
    },
    null,
    2
  );
}

if (loadEnrich && runEnrich) {
  loadEnrich.addEventListener("click", async () => {
    loadEnrich.disabled = true;
    enrichOut.textContent = "Loading list…";
    try {
      await readEnrich(await fetch("/api/enrich"));
    } catch (error) {
      enrichOut.textContent = error.message;
    } finally {
      loadEnrich.disabled = false;
    }
  });

  runEnrich.addEventListener("click", async () => {
    runEnrich.disabled = true;
    enrichOut.textContent = "Scraping directories and association lists…";
    try {
      await readEnrich(
        await fetch("/api/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      );
    } catch (error) {
      enrichOut.textContent = error.message;
    } finally {
      runEnrich.disabled = false;
    }
  });
}
