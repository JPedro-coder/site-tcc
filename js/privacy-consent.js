// js/privacy-consent.js
document.addEventListener('DOMContentLoaded', () => {
  const DURATION_DAYS = 365;
  const STORAGE_KEY = 'privacyConsent';

  const overlay = document.getElementById('consent-overlay');
  const dialog = document.getElementById('consent-dialog');
  const acceptBtn = document.getElementById('consent-accept');
  const closeBtn = document.querySelector('.consent-close');
  const consentDaysSpan = document.getElementById('consent-days');

  if (!overlay || !dialog || !acceptBtn || !closeBtn) {
    // elementos essenciais não encontrados — apenas retorna (sem quebrar)
  }

  function nowISO() { return new Date().toISOString(); }

  function hasValidConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.accepted || !data.date) return false;
      const acceptedDate = new Date(data.date);
      const daysPassed = (Date.now() - acceptedDate.getTime()) / (10 * 1);
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
    if (overlay) {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      overlay.style.display = 'block';
    }
    if (dialog) {
      dialog.classList.add('open');
      dialog.removeAttribute('hidden');
      dialog.setAttribute('aria-hidden', 'false');
    }
    setTimeout(() => { if (acceptBtn) acceptBtn.focus(); }, 120);
    trapFocus(dialog);
  }

  function closeDialog() {
    if (overlay) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.display = 'none';
    }
    if (dialog) {
      dialog.classList.remove('open');
      dialog.setAttribute('hidden', 'true');
      dialog.setAttribute('aria-hidden', 'true');
    }
    releaseFocusTrap();
  }

  acceptBtn && acceptBtn.addEventListener('click', () => { saveConsent(); closeDialog(); });
  closeBtn && closeBtn.addEventListener('click', () => closeDialog());
  overlay && overlay.addEventListener('click', () => closeDialog());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (overlay && overlay.classList.contains('open')) closeDialog();
    }
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === 'Tab') handleTabKey(e);
  });

  let focusable = [];
  let firstFocusable = null;
  let lastFocusable = null;
  let previousActive = null;

  function trapFocus(container) {
    if (!container) return;
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
    if (focusable.length === 0) { e.preventDefault(); return; }
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) { e.preventDefault(); lastFocusable.focus(); }
    } else {
      if (document.activeElement === lastFocusable) { e.preventDefault(); firstFocusable.focus(); }
    }
  }

  try {
    if (!hasValidConsent()) {
      openDialog();
    } else {
      if (overlay) overlay.setAttribute('aria-hidden', 'true');
      if (dialog) dialog.setAttribute('hidden', 'true');
    }
  } catch (err) {
    console.error('Consent init error', err);
  }

  window.__privacyBanner = { show: openDialog, hide: closeDialog, reset: () => { localStorage.removeItem(STORAGE_KEY); openDialog(); } };
});
