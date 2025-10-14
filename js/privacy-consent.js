// js/privacy-consent.js
document.addEventListener('DOMContentLoaded', () => {
  const DURATION_DAYS = 365;

  // elementos
  const overlay = document.getElementById('consent-overlay');
  const dialog = document.getElementById('consent-dialog');
  const acceptBtn = document.getElementById('consent-accept');
  const closeBtn = document.querySelector('.consent-close');
  const consentDaysSpan = document.getElementById('consent-days');

  // checagem básica de elementos
  if (!overlay || !dialog || !acceptBtn || !closeBtn) {
    console.error('Consent script: elementos não encontrados. Verifique IDs/classes no HTML.');
    return;
  }

  // atualiza texto de dias
  if (consentDaysSpan) consentDaysSpan.textContent = DURATION_DAYS;

  // helpers
  function nowISO() { return new Date().toISOString(); }

  function hasValidConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.accepted || !data.date) return false;
      const acceptedDate = new Date(data.date);
      const daysPassed = (Date.now() - acceptedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysPassed < DURATION_DAYS;
    } catch (err) {
      console.warn('Consent read error', err);
      return false;
    }
  }

  function saveConsent() {
    const payload = { accepted: true, date: nowISO() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Consent save error', err);
    }
  }

  function openDialog() {
    overlay.classList.add('open');
    dialog.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    dialog.removeAttribute('hidden');
    dialog.setAttribute('aria-hidden', 'false');
    // foco no botão aceitar
    setTimeout(() => acceptBtn.focus(), 100);
    trapFocus(dialog);
  }

  function closeDialog() {
    overlay.classList.remove('open');
    dialog.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    dialog.setAttribute('hidden', 'true');
    dialog.setAttribute('aria-hidden', 'true');
    releaseFocusTrap();
  }

  // ações
  acceptBtn.addEventListener('click', () => {
    saveConsent();
    closeDialog();
  });

  closeBtn.addEventListener('click', () => {
    closeDialog();
  });

  overlay.addEventListener('click', () => closeDialog());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // fecha se aberto
      if (overlay.classList.contains('open')) closeDialog();
    }
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Tab') handleTabKey(e);
  });

  // focus trap simples
  let focusable = [];
  let firstFocusable = null;
  let lastFocusable = null;
  let previousActive = null;

  function trapFocus(container) {
    previousActive = document.activeElement;
    focusable = Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => el.offsetParent !== null);
    firstFocusable = focusable[0] || container;
    lastFocusable = focusable[focusable.length - 1] || container;
  }

  function releaseFocusTrap() {
    if (previousActive) previousActive.focus();
    focusable = [];
    firstFocusable = null;
    lastFocusable = null;
    previousActive = null;
  }

  function handleTabKey(e) {
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // inicialização
  try {
    if (!hasValidConsent()) {
      openDialog();
    } else {
      // já aceitou
      overlay.setAttribute('aria-hidden', 'true');
      dialog.setAttribute('hidden', 'true');
    }
  } catch (err) {
    console.error('Consent init error', err);
  }
});
