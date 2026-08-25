(function renderPage() {
  const page = window.PRESALES;
  if (!page) return;

  const title = page.heroLine || `${page.yourCompany} × ${page.prospectCompany}`;
  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute("content", title);

  const eyebrow = document.getElementById("eyebrow");
  eyebrow.textContent = `Prepared for ${page.prospectCompany}  ·  ${page.size}`;

  const yourLogo = document.getElementById("your-logo");
  yourLogo.src = page.yourLogo;
  yourLogo.alt = page.yourCompany;

  const theirLogo = document.getElementById("their-logo");
  theirLogo.src = page.theirLogo;
  theirLogo.alt = page.prospectCompany;

  document.getElementById("hero-line").textContent = page.heroLine;

  const noticed = document.getElementById("noticed");
  noticed.replaceChildren(
    ...page.noticed.map((item, index) => {
      const li = document.createElement("li");
      const n = document.createElement("span");
      n.className = "n";
      n.textContent = String(index + 1).padStart(2, "0");
      const text = document.createElement("span");
      text.textContent = item;
      li.append(n, text);
      return li;
    })
  );

  document.getElementById("gap").textContent = page.gap;

  const agenda = document.getElementById("agenda");
  agenda.replaceChildren(
    ...page.agenda.map((item) => {
      const li = document.createElement("li");
      const time = document.createElement("span");
      time.className = "time";
      time.textContent = item.time;
      const block = document.createElement("span");
      block.textContent = item.block;
      li.append(time, block);
      return li;
    })
  );

  const proof = document.getElementById("proof");
  proof.replaceChildren(
    ...page.cases.slice(0, 3).map((item) => {
      const li = document.createElement("li");
      const client = document.createElement("p");
      client.className = "client";
      client.textContent = item.client;
      const result = document.createElement("p");
      result.className = "result";
      result.textContent = item.result;
      li.append(client, result);
      return li;
    })
  );

  const headshot = document.getElementById("headshot");
  headshot.src = page.headshot;
  headshot.alt = page.person.name;
  document.getElementById("who-name").textContent = page.person.name;
  document.getElementById("who-line").textContent = page.person.line;

  const cta = document.getElementById("cta");
  cta.textContent = page.ctaLabel;
  cta.href = page.ctaUrl;
  cta.rel = "noopener noreferrer";
  if (/^https?:/i.test(page.ctaUrl)) {
    cta.target = "_blank";
  }
})();
