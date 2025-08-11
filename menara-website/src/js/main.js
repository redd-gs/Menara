// --------- Sélecteurs utilitaires
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// --------- Menu mobile
const toggle = $('.nav-toggle');
const nav = $('.main-nav');
const actions = $('.header-actions');

if (toggle && nav && actions) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
    actions.classList.toggle('menu-open');
  });

  // Fermer le menu après un clic sur un lien (mobile)
  $$('.main-nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        actions.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// --------- Mettre en évidence l’onglet actif selon la page
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': ['index.html'],
    'about.html': ['about.html'],
    'articles.html': ['articles.html'],
    'contact.html': ['contact.html']
  };
  const currentKey = Object.keys(map).find(k => map[k].includes(path)) || 'index.html';
  $$('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(currentKey)) {
      a.parentElement.classList.add('is-active');
    } else {
      a.parentElement.classList.remove('is-active');
    }
  });
})();

// --------- Défilement fluide vers les ancres internes
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id && id !== '#' ? $(id) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  });
});

// --------- Ombre sur l’en-tête au scroll (feedback visuel discret)
const header = $('.site-header');
if (header) {
  const onScroll = () => {
    if (window.scrollY > 4) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// --------- Validation légère des formulaires (newsletter / contact)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailField = (input) => {
  if (!input) return true;
  const ok = emailPattern.test(input.value.trim());
  input.setCustomValidity(ok ? '' : 'Veuillez saisir une adresse e‑mail valide.');
  return ok;
};

$$('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    const emailInput = form.querySelector('input[type="email"]');
    const ok = validateEmailField(emailInput);
    if (!ok) {
      e.preventDefault();
      emailInput.reportValidity();
    }
  });
});

// --------- Amélioration accessibilité: focus visible sur Tab
(() => {
  let hadKeyboardEvent = false;
  const handleFirstTab = (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      hadKeyboardEvent = true;
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  };
  const handleMouseDownOnce = () => {
    document.documentElement.classList.remove('user-is-tabbing');
    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleFirstTab);
  };
  window.addEventListener('keydown', handleFirstTab);
})();
