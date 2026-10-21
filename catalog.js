/* PRIVOZ Catalog — uses the existing Hostia SerpApi gateway. No API keys in JS. */
document.addEventListener('DOMContentLoaded', () => {
  const API = 'https://privoz.pl/api/shopping.php';
  const $ = (id) => document.getElementById(id);
  const form = $('pcSearchForm'), input = $('pcQuery'), grid = $('pcGrid');
  const status = $('pcStatus'), heading = $('pcResultsHeading'), count = $('pcResultsCount');
  const visibleCount = $('pcVisibleCount'), sourceFilter = $('pcStoreFilter');
  const textFilter = $('pcTextFilter'), sort = $('pcSort'), modal = $('pcModal');
  const modalBody = $('pcModalBody');
  let products = [], controller = null, previousFocus = null;

  function create(tag, className = '', content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined && content !== null) node.textContent = String(content);
    return node;
  }
  function safeHttps(value) {
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; }
    catch (_) { return ''; }
  }
  function imageBox(product, className) {
    const wrapper = create('div', className);
    const url = safeHttps(product.image);
    if (!url) { wrapper.append(create('span', '', 'Фото недоступно')); return wrapper; }
    const img = create('img');
    img.src = url;
    img.alt = product.title ? `Фото: ${product.title}` : 'Фото товара';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.onerror = () => wrapper.replaceChildren(create('span', '', 'Фото недоступно'));
    wrapper.append(img);
    return wrapper;
  }
  // These amounts are displayed for the customer and are not used for making purchase decisions.
  function priceValue(raw) {
    const s = String(raw || '').replace(/\s/g, '').replace(/[^0-9.,]/g, '');
    if (!s) return NaN;
    const comma = s.lastIndexOf(','), dot = s.lastIndexOf('.');
    const decimal = comma > dot ? ',' : '.';
    let normalized = s;
    if (decimal === ',') normalized = s.replace(/\./g, '').replace(',', '.');
    else normalized = s.replace(/,/g, '');
    return Number(normalized);
  }

  function openDetail(index) {
    const product = products[index];
    if (!product) return;
    previousFocus = document.activeElement;
    modalBody.replaceChildren();
    modalBody.append(create('span', 'pc-eyebrow', 'КАРТОЧКА ТОВАРА / PRIVOZ'));
    const cols = create('div', 'pc-modal-grid');
    cols.append(imageBox(product, 'pc-modal-image'));
    const info = create('div', 'pc-modal-info');
    const name = create('h2', '', product.title || 'Товар'); name.id = 'pcModalTitle';
    info.append(name);
    info.append(create('p', '', `Продавец: ${product.source || 'Не указан'}`));
    info.append(create('p', '', 'Артикул производителя (MPN): не подтверждён источником.'));
    info.append(create('p', '', 'Технические характеристики: пока недоступны.'));
    info.append(create('div', 'pc-modal-price', product.price || 'Цена не указана'));
    const link = safeHttps(product.url);
    if (link) {
      const external = create('a', 'pc-modal-shoplink', 'Посмотреть предложение ↗');
      external.href = link; external.rel = 'noopener noreferrer'; external.target = '_blank';
      info.append(external);
      if (new URL(link).hostname.endsWith('google.com')) {
        info.append(create('p', '', 'Ссылка ведёт на Google Shopping и может быть недоступна.'));
      }
    } else {
      info.append(create('p', '', 'Прямая ссылка на предложение продавца пока недоступна.'));
    }
    info.append(create('div', 'pc-modal-warning', 'Данные получены из торговой выдачи, а не из подтверждённого каталога производителя. Товар, цена, модель и совместимость требуют проверки. Добавление в корзину подключим отдельно после интеграции с личным кабинетом.'));
    cols.append(info); modalBody.append(cols);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.pc-modal-close').focus();
  }
  function closeDetail() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  modal.querySelectorAll('[data-pc-close]').forEach(el => el.addEventListener('click', closeDetail));
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeDetail();
    if (e.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), a[href]')].filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function render() {
    const keyword = textFilter.value.trim().toLocaleLowerCase();
    const store = sourceFilter.value;
    let listed = products.map((product, index) => ({product, index}))
      .filter(({product}) => (!store || product.source === store) &&
        (!keyword || String(product.title || '').toLocaleLowerCase().includes(keyword)));
    const direction = sort.value;
    if (direction === 'title') listed.sort((a,b) => String(a.product.title).localeCompare(String(b.product.title),'ru'));
    if (direction.startsWith('price-')) {
      listed.sort((a,b) => {
        const x = priceValue(a.product.price), y = priceValue(b.product.price);
        if (Number.isNaN(x)) return Number.isNaN(y) ? 0 : 1;
        if (Number.isNaN(y)) return -1;
        return direction === 'price-asc' ? x-y : y-x;
      });
    }
    visibleCount.textContent = products.length ? `Показано ${listed.length} из ${products.length}` : 'Пока нет результатов';
    grid.replaceChildren();
    if (!listed.length && products.length) { status.textContent = 'По выбранным фильтрам товаров нет. Попробуйте сбросить фильтры.'; status.hidden = false; return; }
    if (!listed.length) return;
    status.hidden = true;
    const fragment = document.createDocumentFragment();
    for (const {product, index} of listed) {
      const card = create('article', 'pc-card');
      card.append(imageBox(product, 'pc-card-image'));
      card.append(create('h3', '', product.title || 'Товар'));
      card.append(create('p', 'pc-card-source', product.source || 'Продавец не указан'));
      card.append(create('div', 'pc-card-price', product.price || 'Цена не указана'));
      const more = create('button', 'pc-card-open', 'Подробнее ↗');
      more.type = 'button'; more.addEventListener('click', () => openDetail(index));
      card.append(more); fragment.append(card);
    }
    grid.append(fragment);
  }
  function fillStores() {
    sourceFilter.replaceChildren(new Option('Все продавцы', ''));
    const names = [...new Set(products.map(x => x.source).filter(Boolean))].sort((a,b) => a.localeCompare(b,'pl'));
    for (const name of names) sourceFilter.add(new Option(name, name));
  }
  async function search(query) {
    if (!query) return;
    controller?.abort();
    controller = new AbortController();
    const current = controller;
    input.value = query;
    const newUrl = new URL(location.href);
    newUrl.searchParams.set('q', query);
    history.replaceState(null, '', newUrl.pathname + newUrl.search + newUrl.hash);
    heading.textContent = `Результаты: ${query}`;
    count.textContent = 'Идёт поиск товаров…';
    status.hidden = false; status.textContent = 'Загружаем товары из Google Shopping…';
    products = []; grid.replaceChildren(); fillStores(); visibleCount.textContent = 'Загрузка…';
    textFilter.value = ''; sort.value = 'default';
    try {
      const response = await fetch(`${API}?q=${encodeURIComponent(query)}`, {headers:{Accept:'application/json'},signal:current.signal});
      const data = await response.json();
      if (controller !== current) return;
      if (!response.ok) throw new Error(data.error || 'Ошибка сервера');
      products = Array.isArray(data.products) ? data.products.filter(p => p && typeof p.title === 'string') : [];
      count.textContent = `По запросу «${query}» найдено: ${products.length}`;
      fillStores();
      if (!products.length) { status.hidden = false; status.textContent = 'Товары не найдены. Попробуйте другой запрос или точный артикул.'; }
      render();
    } catch (err) {
      if (err.name === 'AbortError' || controller !== current) return;
      count.textContent = 'Не удалось загрузить товары';
      visibleCount.textContent = 'Нет результатов';
      status.hidden = false;
      status.textContent = `Ошибка поиска: ${err.message}. Проверьте соединение с API и попробуйте позже.`;
    }
  }
  form.addEventListener('submit', e => { e.preventDefault(); const q=input.value.trim(); if (!q) return input.focus(); search(q); });
  sourceFilter.addEventListener('change', render);
  textFilter.addEventListener('input', render);
  sort.addEventListener('change', render);
  $('pcResetFilters').addEventListener('click', () => {sourceFilter.value='';textFilter.value='';sort.value='default';render();});
  document.querySelectorAll('[data-query]').forEach(btn => btn.addEventListener('click', () => search(btn.dataset.query)));
  const initial = new URLSearchParams(location.search).get('q');
  if (initial?.trim()) search(initial.trim());
});
