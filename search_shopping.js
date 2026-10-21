document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("psShoppingButton");
  const input = document.getElementById("psQuery");
  const results = document.getElementById("psResults");
  const content = document.getElementById("psResultContent");
  const title = document.getElementById("psResultsTitle");
  const note = results?.querySelector(".ps-demo-note");

  if (!button || !input || !results || !content || !title) {
    return;
  }

  const API = "https://privoz.pl/api/shopping.php";
  let controller = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  button.addEventListener("click", async () => {
    const q = input.value.trim();

    if (!q) {
      input.focus();
      return;
    }

    if (controller) controller.abort();
    controller = new AbortController();
    const current = controller;

    button.disabled = true;
    results.hidden = false;

    title.textContent = `Товары: ${q}`;

    if (note) {
      note.textContent =
        "Товарные результаты Google Shopping. Цены и наличие проверяйте у продавца.";
    }

    content.replaceChildren(
      element("p", "ps-search-state", "Ищем товары с фотографиями…"),
    );

    results.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    try {
      const response = await fetch(`${API}?q=${encodeURIComponent(q)}`, {
        signal: current.signal,
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      if (current !== controller) return;

      if (!response.ok) {
        throw new Error(data.error || "Ошибка поиска");
      }

      content.replaceChildren();

      if (!data.products?.length) {
        content.append(element("p", "ps-search-state", "Товары не найдены."));
        return;
      }

      const grid = element("div", "ps-shopping-grid");

      for (const product of data.products) {
        const card = element("article", "ps-shopping-card");

        const imageBox = element("div", "ps-shopping-image");

        if (product.image) {
          const img = document.createElement("img");
          img.src = product.image;
          img.alt = product.title || "Фото товара";
          img.loading = "lazy";
          img.referrerPolicy = "no-referrer";
          img.onerror = () => {
            imageBox.replaceChildren(element("span", "", "Фото недоступно"));
          };
          imageBox.append(img);
        } else {
          imageBox.append(element("span", "", "Фото недоступно"));
        }

        card.append(imageBox);

        card.append(element("h3", "ps-shopping-title", product.title));

        if (product.source) {
          card.append(element("p", "ps-shopping-source", product.source));
        }

        if (product.price) {
          card.append(element("strong", "ps-shopping-price", product.price));
        }

        if (product.url) {
          const link = element("a", "ps-shopping-link", "Посмотреть товар ↗");

          link.href = product.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          card.append(link);
        }

        grid.append(card);
      }

      content.append(grid);

      content.append(
        element(
          "p",
          "ps-shopping-disclaimer",
          "Цены и изображения получены из Google Shopping. PRIVOZ не подтверждает наличие товара и условия продавца.",
        ),
      );
    } catch (error) {
      if (error.name === "AbortError") return;
      if (current !== controller) return;

      content.replaceChildren(
        element("p", "ps-search-state", `Ошибка: ${error.message}`),
      );
    } finally {
      if (current === controller) button.disabled = false;
    }
  });
});
