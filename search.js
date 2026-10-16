// PRIVOZ - Internet search via Hostia API (works from GitHub Pages and privoz.pl)
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://privoz.pl/api/search.php";
  const form = document.getElementById("psSearchForm");
  const input = document.getElementById("psQuery");
  const results = document.getElementById("psResults");
  const content = document.getElementById("psResultContent");
  const title = document.getElementById("psResultsTitle");
  const close = document.getElementById("psCloseResults");
  const note = results?.querySelector(".ps-demo-note");
  if (!form || !input || !results || !content || !title) return;

  // Safe DOM construction; search results are external/untrusted content.
  const el = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  let controller;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const q = input.value.trim();
    if (!q) {
      input.focus();
      return;
    }
    controller?.abort();
    controller = new AbortController();
    const current = controller;
    results.hidden = false;
    title.textContent = `Результаты поиска: ${q}`;
    if (note)
      note.textContent =
        "Ищем страницы товаров и производителей в интернете. Проверяйте информацию на сайте источника.";
    content.replaceChildren(el("p", "ps-search-state", "Поиск в интернете…"));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(q)}`, {
        method: "GET",
        signal: current.signal,
        headers: { Accept: "application/json" },
      });
      const payload = await response.json();
      if (current !== controller) return;
      if (!response.ok) throw new Error(payload.error || "Ошибка поиска");
      content.replaceChildren();

      const searchLabels = {
        manufacturer: "ПРОИЗВОДИТЕЛЬ",
        part_number: "ПОИСК ПО АРТИКУЛУ",
        product: "ПОИСК ТОВАРОВ",
      };

      const currentType = payload.search_type || "product";

      if (note) {
        note.textContent =
          currentType === "manufacturer"
            ? "Найдены страницы производителя и его продукции. Информацию проверяйте на официальном сайте."
            : currentType === "part_number"
              ? "Поиск по артикулу. Сверяйте полный номер модели и характеристики на сайте производителя."
              : "Ищем товары, производителей и поставщиков в интернете.";
      }

      const category = el(
        "span",
        "ps-result-category",
        searchLabels[currentType] || "ПОИСК ТОВАРОВ",
      );

      content.append(category);

      if (!payload.results?.length) {
        content.append(
          el(
            "p",
            "ps-search-state",
            "Ничего не найдено. Введите название товара или название производителя.",
          ),
        );
        return;
      }
      const grid = el("div", "ps-web-results");
      for (const item of payload.results) {
        let url;
        try {
          url = new URL(item.url);
          if (!["https:", "http:"].includes(url.protocol)) continue;
        } catch {
          continue;
        }
        const card = el("article", "ps-web-result");
        card.append(el("span", "ps-web-domain", url.hostname));
        const link = el("a", "ps-web-title", item.title || url.hostname);
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.append(link);
        if (item.description)
          card.append(el("p", "ps-web-description", item.description));
        grid.append(card);
      }
      content.append(grid);
      content.append(
        el(
          "p",
          "ps-web-footnote",
          "Это результаты интернет-поиска, а не подтверждённые предложения PRIVOZ. Артикулы, наличие и совместимость нужно сверять с источником.",
        ),
      );
    } catch (error) {
      if (error.name === "AbortError") return;
      content.replaceChildren(
        el("p", "ps-search-state", `Поиск пока недоступен: ${error.message}`),
      );
    }
  });
  close?.addEventListener("click", () => {
    controller?.abort();
    results.hidden = true;
  });
  document.getElementById("psRequestForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("psRequestStatus");
    if (status)
      status.textContent =
        "Для отправки заявки необходимо подключить обработчик формы.";
  });
});
