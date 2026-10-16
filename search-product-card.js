/* PRIVOZ Product Cards — works alongside existing search.js */
document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('psResultContent');
  if (!content) return;
  const ENDPOINT = 'https://privoz.pl/api/product.php';
  const make = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };

  const dialog = make('dialog', 'ps-product-dialog');
  const shell = make('div', 'ps-product-dialog-inner');
  dialog.append(shell);
  document.body.append(dialog);
  let activeController = null;
  let lastButton = null;

  function closeDialog() {
    activeController?.abort();
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener('close', () => {
    activeController?.abort();
    if (lastButton?.isConnected) lastButton.focus();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  function header(label) {
    shell.replaceChildren();
    const top = make('div', 'ps-product-dialog-top');
    top.append(make('span', 'ps-product-kicker', label));
    const x = make('button', 'ps-product-close', 'Закрыть ×');
    x.type = 'button';
    x.addEventListener('click', closeDialog);
    top.append(x);
    shell.append(top);
  }
  function addSource(url) {
    const a = make('a', 'ps-product-source', 'Перейти на страницу источника ↗');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    shell.append(a);
  }
  function infoLine(parent, label, value) {
    if (!value) return;
    const row = make('div', 'ps-product-field');
    row.append(make('span', 'ps-product-field-label', label));
    row.append(make('span', 'ps-product-field-value', value));
    parent.append(row);
  }
  function safeHttpsUrl(raw) {
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' ? url.href : null;
    } catch { return null; }
  }
  function displayProduct(data, sourceUrl) {
    header('КАРТОЧКА ТОВАРА / ДАННЫЕ ИСТОЧНИКА');
    const p = data.product || {};
    const layout = make('div', 'ps-product-layout');
    const imageArea = make('div', 'ps-product-media');
    const imageUrl = safeHttpsUrl(p.image);
    if (imageUrl) {
      const img = make('img');
      img.src = imageUrl;
      img.alt = p.name || 'Фото товара с сайта источника';
      img.referrerPolicy = 'no-referrer';
      img.loading = 'lazy';
      img.addEventListener('error', () => img.replaceWith(make('span', 'ps-product-no-image', 'Фото недоступно')));
      imageArea.append(img);
    } else {
      imageArea.append(make('span', 'ps-product-no-image', 'Фото не опубликовано в данных товара'));
    }
    const info = make('div', 'ps-product-info');
    info.append(make('h3', 'ps-product-name', p.name || 'Товар без указанного названия'));
    const fields = make('div', 'ps-product-fields');
    infoLine(fields, 'Производитель', p.manufacturer || p.brand);
    infoLine(fields, 'Бренд', p.brand);
    infoLine(fields, 'Артикул (SKU)', p.sku);
    infoLine(fields, 'Part Number (MPN)', p.mpn);
    infoLine(fields, 'GTIN', p.gtin);
    info.append(fields);
    if (p.description) {
      info.append(make('h4', 'ps-product-subtitle', 'О товаре'));
      info.append(make('p', 'ps-product-description', p.description));
    }
    if (Array.isArray(p.properties) && p.properties.length) {
      info.append(make('h4', 'ps-product-subtitle', 'Характеристики'));
      const properties = make('div', 'ps-product-fields');
      p.properties.slice(0, 10).forEach((prop) => infoLine(properties, prop.name, prop.value));
      info.append(properties);
    }
    layout.append(imageArea, info);
    shell.append(layout);
    shell.append(make('p', 'ps-product-warning', 'Сведения получены из структурированной разметки стороннего сайта и не проверены PRIVOZ. Наличие, артикулы и совместимость уточняйте у производителя или поставщика.'));
    addSource(sourceUrl);
  }
  async function openProduct(sourceUrl, button) {
    lastButton = button;
    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;
    header('ПРОВЕРКА ТОВАРА');
    shell.append(make('p', 'ps-product-message', 'Загружаем данные со страницы источника…'));
    addSource(sourceUrl);
    if (!dialog.open) dialog.showModal();
    try {
      const response = await fetch(`${ENDPOINT}?url=${encodeURIComponent(sourceUrl)}`, {
        method: 'GET', signal: controller.signal, headers: { Accept: 'application/json' }
      });
      const payload = await response.json();
      if (controller !== activeController || !dialog.open) return;
      if (!response.ok) throw new Error(payload.error || 'Не удалось прочитать страницу');
      if (!payload.found) {
        header('ТОВАРНЫЕ ДАННЫЕ НЕ НАЙДЕНЫ');
        shell.append(make('p', 'ps-product-message', payload.message || 'На странице отсутствует разметка Product.'));
        shell.append(make('p', 'ps-product-warning', 'Это может быть каталог, PDF, страница производителя либо сайт без структурированных данных.'));
        addSource(sourceUrl);
        return;
      }
      displayProduct(payload, sourceUrl);
    } catch (err) {
      if (err.name === 'AbortError' || !dialog.open) return;
      header('НЕ УДАЛОСЬ ПОЛУЧИТЬ ДАННЫЕ');
      shell.append(make('p', 'ps-product-message', err.message || 'Ошибка загрузки'));
      shell.append(make('p', 'ps-product-warning', 'Некоторые сайты блокируют автоматическое чтение или перенаправляют посетителей.'));
      addSource(sourceUrl);
    }
  }
  function addButtons() {
    content.querySelectorAll('.ps-web-result').forEach(card => {
      if (card.querySelector('.ps-product-check')) return;
      const link = card.querySelector('a.ps-web-title[href]');
      const url = link && safeHttpsUrl(link.href);
      if (!url) return;
      const button = make('button', 'ps-product-check', 'Посмотреть товар →');
      button.type = 'button';
      button.addEventListener('click', () => openProduct(url, button));
      card.append(button);
    });
  }
  const observer = new MutationObserver(addButtons);
  observer.observe(content, { childList: true, subtree: true });
  addButtons();
});
