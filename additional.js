document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
       MODAL CONTENT
    ===================================================== */

  const modalData = {
    consolidation: {
      number: "02",
      title: "Консолидация",
      subtitle: "Несколько поставщиков — одна отправка",

      content: `
                <p>
                    Покупаете товары у нескольких поставщиков в Европе?
                    Не обязательно организовывать отдельную отправку
                    для каждого заказа.
                </p>

                <p>
                    Все товары могут поступать на склад Privoz,
                    где мы принимаем их, идентифицируем,
                    при необходимости маркируем и объединяем
                    в одну отправку.
                </p>

                <h4>Зачем нужна консолидация</h4>

                <ul>
                    <li>закупайте товары у нескольких поставщиков;</li>
                    <li>объединяйте поставки в один заказ;</li>
                    <li>сокращайте количество отдельных отправок;</li>
                    <li>упрощайте дальнейшую логистику;</li>
                    <li>получайте все товары в одном месте перед отправкой.</li>
                </ul>

                <h4>Как это работает</h4>

                <ol>
                    <li>Вы закупаете товары у нескольких поставщиков.</li>
                    <li>Поставщики отправляют товары на склад Privoz.</li>
                    <li>Мы принимаем и учитываем каждую поставку.</li>
                    <li>При необходимости выполняем маркировку и другие операции.</li>
                    <li>Объединяем товары в одну отправку.</li>
                    <li>Подготавливаем заказ к дальнейшей отправке.</li>
                </ol>

                <div class="modal-note">
                    <strong>Важно:</strong>
                    условия консолидации зависят от конкретной задачи,
                    количества поставок и особенностей товаров.
                </div>

                <div class="modal-action">
                    <a href="#additional-form"
                       class="additional-btn additional-btn--orange modal-form-link">
                        <span>Обсудить консолидацию</span>
                        <span class="additional-btn__arrow">→</span>
                    </a>
                </div>
            `,
    },

    marking: {
      number: "03",
      title: "Маркировка",
      subtitle: "Подготавливаем товары к дальнейшей работе",

      content: `
                <p>
                    Выполняем необходимые операции по маркировке
                    товаров, упаковок и грузовых мест в соответствии
                    с вашей задачей.
                </p>

                <h4>Можем работать с:</h4>

                <ul>
                    <li>этикетками;</li>
                    <li>артикулами;</li>
                    <li>штрихкодами;</li>
                    <li>обозначениями на товарах;</li>
                    <li>маркировкой коробок;</li>
                    <li>маркировкой паллет;</li>
                    <li>сопроводительной информацией и документами;</li>
                    <li>другими необходимыми обозначениями.</li>
                </ul>

                <p>
                    Если у вас уже есть готовый макет или требования
                    к маркировке — работаем по ним. Если задача
                    нестандартная, обсудим необходимый формат
                    с вами до начала работ.
                </p>

                <h4>Когда это удобно</h4>

                <p>
                    Маркировку можно заказать как отдельную услугу
                    или включить её в комплексную обработку поставки —
                    например, после приёмки и перед консолидацией.
                </p>

                <div class="modal-action">
                    <a href="#additional-form"
                       class="additional-btn additional-btn--orange modal-form-link">
                        <span>Обсудить маркировку</span>
                        <span class="additional-btn__arrow">→</span>
                    </a>
                </div>
            `,
    },

    conditions: {
      number: "01",
      title: "Индивидуальные условия",
      subtitle: "Не подстраивайтесь под стандартную схему",

      content: `
                <p>
                    Регулярные закупки, большие объёмы или
                    нестандартный процесс требуют другого подхода.
                </p>

                <p>
                    Мы можем сформировать индивидуальные условия
                    работы с учётом вашего объёма, частоты поставок
                    и задач.
                </p>

                <h4>В зависимости от ситуации это может включать:</h4>

                <ul>
                    <li>индивидуальный тариф;</li>
                    <li>персонального менеджера;</li>
                    <li>приоритетную обработку;</li>
                    <li>индивидуальный график работы с поставками;</li>
                    <li>специальные условия хранения;</li>
                    <li>дополнительные складские операции;</li>
                    <li>индивидуальную схему обработки заказов;</li>
                    <li>комплексное сопровождение закупок.</li>
                </ul>

                <p>
                    Сначала разбираемся в вашей задаче,
                    затем предлагаем рабочую схему.
                </p>

                <div class="modal-action">
                    <a href="#additional-form"
                       class="additional-btn additional-btn--orange modal-form-link">
                        <span>Запросить индивидуальные условия</span>
                        <span class="additional-btn__arrow">→</span>
                    </a>
                </div>
            `,
    },

    negotiations: {
      number: "04",
      title: "Переговоры с поставщиками",
      subtitle: "Находим поставщиков и помогаем договориться",

      content: `
                <p>
                    Не хотите самостоятельно искать поставщиков,
                    писать десятки писем и выяснять условия закупки?
                </p>

                <p>
                    Подключаемся к этому процессу.
                </p>

                <h4>Мы можем:</h4>

                <ul>
                    <li>найти подходящих поставщиков;</li>
                    <li>связаться с ними;</li>
                    <li>запросить наличие товара;</li>
                    <li>уточнить цены;</li>
                    <li>запросить оптовые условия;</li>
                    <li>обсудить скидки;</li>
                    <li>уточнить сроки производства или поставки;</li>
                    <li>согласовать условия доставки;</li>
                    <li>запросить необходимые документы;</li>
                    <li>вести коммуникацию с поставщиком;</li>
                    <li>помочь организовать закупку.</li>
                </ul>

                <p>
                    Если поставщик уже найден, вы можете просто
                    передать нам его контакты или ссылку.
                </p>

                <p>
                    Если поставщика ещё нет — расскажите,
                    какой товар вам нужен, и мы начнём поиск.
                </p>

                <div class="modal-action">
                    <a href="#additional-form"
                       class="additional-btn additional-btn--orange modal-form-link">
                        <span>Обсудить закупку</span>
                        <span class="additional-btn__arrow">→</span>
                    </a>
                </div>
            `,
    },

    verification: {
      number: "05",
      title: "Проверка поставщиков",
      subtitle: "Проверьте поставщика до начала сделки",

      content: `
                <p>
                    Работа с новым поставщиком всегда связана
                    с рисками. До оплаты важно понимать,
                    с кем вы заключаете сделку и на каких условиях.
                </p>

                <h4>Мы можем проверить:</h4>

                <ul>
                    <li>существование компании;</li>
                    <li>регистрационные данные;</li>
                    <li>юридический статус;</li>
                    <li>реквизиты;</li>
                    <li>доступную информацию о деятельности;</li>
                    <li>репутацию;</li>
                    <li>отзывы и историю работы;</li>
                    <li>наличие товара;</li>
                    <li>условия оплаты;</li>
                    <li>документы;</li>
                    <li>заявленные контактные данные;</li>
                    <li>возможные признаки риска или несоответствия.</li>
                </ul>

                <p>
                    По результатам проверки вы получаете информацию,
                    которая помогает принять решение о дальнейшей
                    работе с поставщиком.
                </p>

                <div class="modal-note">
                    <strong>Важно:</strong>
                    проверка помогает выявить возможные риски,
                    но не является гарантией добросовестности
                    поставщика или исполнения им обязательств.
                </div>

                <div class="modal-action">
                    <a href="#additional-form"
                       class="additional-btn additional-btn--orange modal-form-link">
                        <span>Проверить поставщика</span>
                        <span class="additional-btn__arrow">→</span>
                    </a>
                </div>
            `,
    },

    storage: {
      number: "06",
      title: "Складирование и хранение",
      subtitle:
        "Товар может оставаться на складе Privoz столько, сколько нужно для вашего процесса",

      content: `
                <p>
                    Принимаем и храним товары, поступающие
                    от поставщиков, до следующего этапа работы.
                </p>

                <h4>На складе можно организовать:</h4>

                <ul>
                    <li>приёмку товаров;</li>
                    <li>размещение и хранение;</li>
                    <li>обработку поставок;</li>
                    <li>маркировку;</li>
                    <li>подготовку к консолидации;</li>
                    <li>консолидацию нескольких поставок;</li>
                    <li>подготовку товара к дальнейшей отправке.</li>
                </ul>

                <p>
                    Можно хранить различные виды товаров,
                    коробки, паллеты и другие грузовые места —
                    конкретные условия определяются индивидуально
                    с учётом особенностей товара и задачи.
                </p>

                <h4>Регламент хранения</h4>

                <p>
                    Подробные правила, условия и порядок хранения
                    доступны в регламенте.
                </p>

                <p>
                    <a href="#"
                       class="additional-text-link">
                        Открыть регламент хранения
                        <span>→</span>
                    </a>
                </p>

                <div class="modal-action">
                    <a href="#additional-form"
                       class="additional-btn additional-btn--orange modal-form-link">
                        <span>Обсудить хранение</span>
                        <span class="additional-btn__arrow">→</span>
                    </a>
                </div>
            `,
    },
  };

  /* =====================================================
       MODAL
    ===================================================== */

  const modal = document.getElementById("serviceModal");
  const modalContent = document.getElementById("serviceModalContent");

  const openButtons = document.querySelectorAll("[data-modal]");

  const closeButtons = document.querySelectorAll("[data-close-modal]");

  function openModal(key) {
    const data = modalData[key];

    if (!data) return;

    modalContent.innerHTML = `

            <div class="modal-service-number">
                ${data.number} / ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
            </div>

            <h2>${data.title}</h2>

            <h3>${data.subtitle}</h3>

            ${data.content}

        `;

    modal.classList.add("is-open");

    document.body.style.overflow = "hidden";

    const formLinks = modalContent.querySelectorAll(".modal-form-link");

    formLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeModal();
      });
    });
  }

  function closeModal() {
    modal.classList.remove("is-open");

    document.body.style.overflow = "";
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-modal");

      openModal(key);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  /* =====================================================
       FORM
       Здесь потом можно подключить ваш существующий обработчик
    ===================================================== */

  const form = document.querySelector(".request-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      /*
       * Здесь подключается существующая отправка формы.
       *
       * Например:
       *
       * const formData = new FormData(form);
       *
       * fetch("send.php", {
       *     method: "POST",
       *     body: formData
       * });
       */

      console.log("Форма готова к подключению обработчика отправки.");
    });
  }

  /* =====================================================
       SMOOTH ANCHORS
    ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") {
        return;
      }

      const target = document.querySelector(id);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
});
