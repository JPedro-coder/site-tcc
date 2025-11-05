/* js/main-secure.js
   Código 'imediato' de segurança: sanitização básica, manipulação segura do DOM,
   overlay de envio sem innerHTML, proteção contra XSS no client-side (UX).
   Atenção: validação real e proteção definitiva devem ocorrer no servidor.
*/

/* js/main-secure.js
   Implementação segura para:
   - submissão do formulário (overlay "processando"),
   - lightbox acessível,
   - escape simples de texto para evitar inserção de HTML pelo cliente.
   Importante: validação e segurança final devem estar no servidor em ambiente de produção. 
*/
(function () {
  'use strict';

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      }[s];
    });
  }

  function safeSetText(elem, text) {
    if (!elem) return;
    elem.textContent = text;
  }

  function showProcessingOverlay() {
    if (document.getElementById('processing-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'processing-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(3px)',
      zIndex: '9999'
    });

    const box = document.createElement('div');
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.style.textAlign = 'center';
    box.style.padding = '18px';
    box.style.borderRadius = '10px';
    box.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
    box.style.background = '#fff';

    const spinner = document.createElement('div');
    spinner.className = 'spinner-border';
    spinner.setAttribute('role', 'status');
    spinner.style.width = '3rem';
    spinner.style.height = '3rem';
    spinner.style.marginBottom = '12px';

    const text = document.createElement('div');
    text.style.fontWeight = '600';
    text.style.color = '#333';
    text.textContent = 'Processando sua reserva...';

    box.appendChild(spinner);
    box.appendChild(text);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function hideProcessingOverlay() {
    const overlay = document.getElementById('processing-overlay');
    if (overlay) overlay.remove();
  }

  function initSecureForm() {
    const form = document.getElementById('formReserva');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      if (checkin && checkout && checkout <= checkin) {
        event.preventDefault();
        event.stopPropagation();
        alert('A data de check-out deve ser posterior à data de check-in!');
        return;
      }

      event.preventDefault();

      // sanitize for client-side display only
      const nome = escapeHTML((document.getElementById('nome') || {}).value || '');
      const email = escapeHTML((document.getElementById('email') || {}).value || '');
      const telefone = escapeHTML((document.getElementById('telefone') || {}).value || '');
      const quartoSelect = document.getElementById('quarto');
      const quartoLabel = quartoSelect && quartoSelect.options[quartoSelect.selectedIndex] ? escapeHTML(quartoSelect.options[quartoSelect.selectedIndex].text) : '';

      showProcessingOverlay();

      setTimeout(() => {
        hideProcessingOverlay();
        // redireciona para página estática de confirmação (protótipo)
        window.location.href = 'reserva_confirmada.html';
      }, 1500);
    }, false);
  }

  function initLightbox() {
    const imgs = Array.from(document.querySelectorAll('.galeria-img'));
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || imgs.length === 0) return;

    const lbImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');

    let currentIndex = -1;

    function openAt(index) {
      if (index < 0 || index >= imgs.length) return;
      currentIndex = index;
      const src = imgs[index].dataset.full || imgs[index].src;
      const alt = imgs[index].alt || '';
      lbImg.src = src;
      lbImg.alt = alt;
      safeSetText(caption, alt);
      lightbox.removeAttribute('hidden');
      const closeBtn = lightbox.querySelector('.close');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lightbox.setAttribute('hidden', 'true');
      lbImg.src = '';
      safeSetText(caption, '');
    }

    function prev() { openAt((currentIndex - 1 + imgs.length) % imgs.length); }
    function next() { openAt((currentIndex + 1) % imgs.length); }

    imgs.forEach((img, i) => {
      img.addEventListener('click', () => openAt(i));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openAt(i);
      });
    });

    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.nav.prev');
    const nextBtn = lightbox.querySelector('.nav.next');

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
      if (lightbox.getAttribute('hidden') === 'true') return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSecureForm();
    initLightbox();
  });
})();

/// Inicializar VLibras de forma segura
(function initVLibras() {
  let tries = 0;
  const maxTries = 60; // 60 * 100ms = 6s
  const interval = setInterval(() => {
    if (window.VLibras && typeof window.VLibras.Widget === 'function') {
      try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      } catch (err) {
        console.warn('Erro ao inicializar VLibras:', err);
      }
      clearInterval(interval);
      return;
    }
    tries++;
    if (tries >= maxTries) {
      clearInterval(interval);
      console.warn('VLibras não ficou disponível em tempo esperado.');
    }
  }, 100);
})();