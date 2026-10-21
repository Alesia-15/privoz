document.addEventListener('DOMContentLoaded', () => {
  // Full years since the foundation date (no fictitious totals).
  const years = document.getElementById('ppYears');
  if (years) {
    const today = new Date();
    let count = today.getFullYear() - 2016;
    if (today.getMonth() < 8 || (today.getMonth() === 8 && today.getDate() < 27)) count--;
    years.textContent = String(Math.max(0, count));
  }

  const modal = document.getElementById('ppOfferModal');
  const dialog = modal?.querySelector('.pp-modal-dialog');
  let previouslyFocused = null;
  const open = () => {
    previouslyFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    dialog?.focus();
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    previouslyFocused?.focus();
  };
  document.querySelectorAll('.pp-open-modal').forEach(button => button.addEventListener('click', open));
  modal?.querySelectorAll('[data-pp-close]').forEach(button => button.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (!modal?.classList.contains('is-open')) return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]')].filter(x => x.getClientRects().length);
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  });

  const supported = ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png'];
  document.querySelectorAll('.pp-form').forEach(form => {
    const fileInput = form.querySelector('input[type="file"]');
    const fileLabel = form.querySelector('.pp-filename');
    const status = form.querySelector('.pp-form-status');
    fileInput?.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      fileLabel.textContent = file ? file.name : 'Выбрать файл ↗';
      status.textContent = '';
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const file = fileInput?.files?.[0];
      if (file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (!supported.includes(ext)) { status.textContent = 'Недопустимый формат файла.'; return; }
        if (file.size > 10 * 1024 * 1024) { status.textContent = 'Максимальный размер файла — 10 МБ.'; return; }
      }
      // Demo mode: sending requires a server endpoint handling multipart/form-data.
      status.textContent = 'Форма заполнена. Для реальной отправки необходимо подключить серверный обработчик заявок и файлов.';
    });
  });
});
