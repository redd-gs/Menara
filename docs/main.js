// --------- Sélecteurs utilitaires
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// --------- Menu mobile et dropdowns accessibles
const toggle = $('.nav-toggle');
const nav = $('.main-nav');
const actions = $('.header-actions');
const dropdownParents = $$('.has-dropdown');
const mobileQuery = window.matchMedia('(max-width: 1024px)');

const isMobileNav = () => mobileQuery.matches;

const resetDropdown = (dropdown) => {
  dropdown.classList.remove('dropdown-open');
  const trigger = $('a', dropdown);
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
};

const closeDropdowns = () => {
  dropdownParents.forEach(resetDropdown);
};

const closeNav = (focusToggle = false) => {
  if (!nav) return;
  nav.classList.remove('open');
  actions?.classList.remove('menu-open');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  closeDropdowns();
  if (focusToggle && toggle) {
    toggle.focus();
  }
};

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    const nextState = !expanded;
    toggle.setAttribute('aria-expanded', String(nextState));
    nav.classList.toggle('open', nextState);
    actions?.classList.toggle('menu-open', nextState);
    document.body.classList.toggle('nav-open', nextState);
    if (!nextState) {
      closeDropdowns();
    }
  });

  document.addEventListener('click', (event) => {
    if (!isMobileNav() || !nav.classList.contains('open')) return;
    const target = event.target;
    if (toggle.contains(target)) return;
    if (nav.contains(target)) return;
    closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (nav.classList.contains('open')) {
      closeNav(true);
      return;
    }
    let handled = false;
    dropdownParents.forEach(dropdown => {
      if (dropdown.classList.contains('dropdown-open')) {
        resetDropdown(dropdown);
        if (!handled) {
          const trigger = $('a', dropdown);
          trigger?.focus();
          handled = true;
        }
      }
    });
  });

  const handleBreakpointChange = () => {
    if (!isMobileNav()) {
      closeNav();
    }
  };

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleBreakpointChange);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(handleBreakpointChange);
  }
}

if (nav) {
  $$('a', nav).forEach(link => {
    link.addEventListener('click', () => {
      if (isMobileNav()) {
        closeNav();
      }
    });
  });
}

dropdownParents.forEach(dropdown => {
  const trigger = $('a', dropdown);
  if (!trigger) return;
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', (event) => {
    if (!isMobileNav()) return;
    event.preventDefault();
    const isOpen = dropdown.classList.toggle('dropdown-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
    dropdownParents.forEach(other => {
      if (other !== dropdown) {
        resetDropdown(other);
      }
    });
  });
});

// --------- Contenu dynamique du dropdown Publications
const DROPDOWN_FALLBACK_ARTICLES = [
  {
    title: "L'Egypte, que reste-t-il du \"too big to fail\" ?",
    slug: 'too-big-to-fail',
    author: 'Yasmine Guemmaz',
    date: 'Mars 2025'
  },
  {
    title: 'Retour du protectionnisme : quelles perspectives pour l\'Afrique ?',
    slug: 'protectionnisme-afrique',
    author: 'Yasmine Guemmaz',
    date: 'Avril 2025'
  },
  {
    title: 'France-Maroc-Algérie, une histoire d’alliances et de rivalités',
    slug: 'france-maroc-algerie',
    author: 'Vincent Plantevin',
    date: 'Mai 2025'
  },
  {
    title: 'Raffinerie Dangote : un catalyseur d\'industrialisation au coeur des défis nigérians',
    slug: 'raffinerie-dangote',
    author: 'Adnane Belfami',
    date: 'Juin 2025'
  },
  {
    title: 'La Syrie, sur le chemin de la reconstruction ?',
    slug: 'reconstruction-syrie',
    author: 'Grégoire Descamps',
    date: 'Mai 2025'
  },
  {
    title: 'Entretien avec Joseph Daher: La reconstruction syrienne',
    slug: 'entretien-daher',
    author: 'Vincent Plantevin',
    date: 'Juin 2025'
  }
];

const renderArticlesDropdown = (payload) => {
  const container = document.getElementById('articlesDropdownList');
  if (!container) {
    return;
  }

  const candidates = Array.isArray(payload) && payload.length
    ? payload
    : (Array.isArray(window.MENARA_ARTICLES) && window.MENARA_ARTICLES.length
      ? window.MENARA_ARTICLES
      : DROPDOWN_FALLBACK_ARTICLES);

  const items = candidates.slice(0, 6).map((article) => {
    const metaParts = [article.author, article.date].filter(Boolean).join(' • ');
    return `
      <a href="article.html?slug=${article.slug}" class="article-dropdown-item">
        <div class="article-title">${article.title}</div>
        <div class="article-meta">${metaParts}</div>
      </a>
    `;
  }).join('');

  container.innerHTML = items;
};

document.addEventListener('DOMContentLoaded', () => renderArticlesDropdown());
window.addEventListener('menara:articles-ready', (event) => {
  renderArticlesDropdown(event.detail);
});

// --------- Mettre en évidence l'onglet actif selon la page
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': ['index.html'],
    'about.html': ['about.html'],
    'articles.html': ['articles.html'],
    'news-events.html': ['news-events.html'],
    'contributions.html': ['contributions.html'],
    'podcasts.html': ['podcasts.html'],
    'follow.html': ['follow.html'],
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
    const href = a.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = $(href);
    if (target) {
      const headerHeight = $('.site-header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Mettre à jour l'URL
      history.pushState(null, '', href);
    }
  });
});

// --------- Animations au scroll (Intersection Observer)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observer les éléments à animer
$$('.card, .event-card, .news-item, .contribution-card, .social-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// --------- Filtres pour la page articles
const filters = $$('.chip');
const articles = $$('.article-card');

filters.forEach(filter => {
  filter.addEventListener('click', e => {
    e.preventDefault();
    
    // Mettre à jour l'état actif
    filters.forEach(f => f.classList.remove('is-active'));
    filter.classList.add('is-active');
    
    const filterValue = filter.getAttribute('href').substring(1);
    
    // Filtrer les articles
    articles.forEach(article => {
      if (filterValue === 'all' || article.classList.contains(filterValue)) {
        article.style.display = 'block';
        setTimeout(() => {
          article.style.opacity = '1';
          article.style.transform = 'translateY(0)';
        }, 100);
      } else {
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        setTimeout(() => {
          article.style.display = 'none';
        }, 300);
      }
    });
  });
});

// --------- Newsletter et formulaires
$$('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    
    if (email) {
      // Animation de succès
      const button = form.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Inscription réussie !';
      button.style.background = 'var(--accent-secondary)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        form.reset();
      }, 3000);
    }
  });
});

// --------- Lecteur audio pour les podcasts
$$('.play-btn, .play-button').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    
    // Animation de lecture
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);
    
    // Ici, vous pouvez intégrer un vrai lecteur audio
    console.log('Lecture du podcast...');
  });
});

// --------- Copie des liens RSS
$$('.rss-card .btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    
    const code = btn.parentElement.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copié !';
        btn.style.background = 'var(--accent-secondary)';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2000);
      });
    }
  });
});

// --------- Ombre sur l'en-tête au scroll (feedback visuel discret)
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

// --------- CSS pour les animations et interactions dynamiques
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .card, .event-card, .news-item, .contribution-card, .social-card {
    transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
  }
  
  .btn {
    transition: all 0.2s ease;
  }
  
  .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .social-card:hover {
    transform: translateY(-2px);
  }
  
  .chip {
    transition: all 0.2s ease;
    padding: 8px 16px;
    border-radius: 999px;
    text-decoration: none;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--text-secondary);
    display: inline-block;
  }
  
  .chip.is-active, .chip:hover {
    background: var(--accent);
    color: var(--white);
    border-color: var(--accent);
    transform: translateY(-1px);
  }
  
  .site-header.is-scrolled {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .play-btn, .play-button {
    transition: all 0.2s ease;
  }
  
  .play-btn:hover, .play-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  /* Animations d'apparition staggerées pour les grilles */
  .events-grid .event-card,
  .news-grid .news-item,
  .contributions-grid .contribution-card,
  .social-grid .social-card {
    animation-delay: calc(var(--index, 0) * 0.1s);
  }
  
  /* Effets de hover sophistiqués */
  .newsletter-signup {
    transition: all 0.3s ease;
  }
  
  .newsletter-signup:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  /* Focus visible pour l'accessibilité */
  .user-is-tabbing *:focus {
    outline: 2px solid var(--accent) !important;
    outline-offset: 2px !important;
  }
  
  /* Animation des statistiques du hero */
  .lighthouse-card .stat {
    transition: transform 0.3s ease;
  }
  
  .lighthouse-card:hover .stat {
    transform: scale(1.05);
  }
  
  /* Micro-animations pour les icônes sociales */
  .social-icon {
    transition: transform 0.2s ease;
  }
  
  .social-card:hover .social-icon {
    transform: rotate(5deg) scale(1.1);
  }
`;
document.head.appendChild(style);

// --------- Initialisation des index pour les animations staggerées
$$('.events-grid .event-card').forEach((el, i) => {
  el.style.setProperty('--index', i);
});

$$('.news-grid .news-item').forEach((el, i) => {
  el.style.setProperty('--index', i);
});

$$('.contributions-grid .contribution-card').forEach((el, i) => {
  el.style.setProperty('--index', i);
});

$$('.social-grid .social-card').forEach((el, i) => {
  el.style.setProperty('--index', i);
});

// --------- Effet de typing pour les titres (optionnel)
const typeWriter = (element, text, speed = 50) => {
  let i = 0;
  element.innerHTML = '';
  
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
};

// Activer l'effet typing sur la page d'accueil
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  const heroTitle = $('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    // Démarrer l'effet après un petit délai
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 30);
    }, 500);
  }
}