// ==========================================
// CAROUSELS ET INTERACTIONS DYNAMIQUES
// Système complet pour le site Menara
// ==========================================

class MenaraCarousel {
  constructor(container, options = {}) {
    this.container = container;
    this.wrapper = container.querySelector('.carousel-wrapper');
    this.slides = container.querySelectorAll('.carousel-slide');
    this.prevBtn = container.querySelector('.carousel-nav.prev');
    this.nextBtn = container.querySelector('.carousel-nav.next');
    this.indicators = container.querySelectorAll('.carousel-indicator');
    
    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoplayInterval = null;
    
    this.options = {
      autoplay: true,
      autoplayDelay: 5000,
      loop: true,
      ...options
    };
    
    this.init();
  }
  
  init() {
    if (this.slideCount === 0) return;
    
    this.bindEvents();
    this.updateIndicators();
    
    if (this.options.autoplay) {
      this.startAutoplay();
    }
    
    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.options.autoplay) this.startAutoplay();
    });
  }
  
  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    });
    
    this.container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      e.preventDefault();
    });
    
    this.container.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      if (this.options.autoplay) this.startAutoplay();
    });
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    const translateX = -index * 100;
    this.wrapper.style.transform = `translateX(${translateX}%)`;
    this.updateIndicators();
  }
  
  next() {
    if (this.currentIndex < this.slideCount - 1) {
      this.currentIndex++;
    } else if (this.options.loop) {
      this.currentIndex = 0;
    }
    this.goToSlide(this.currentIndex);
  }
  
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.options.loop) {
      this.currentIndex = this.slideCount - 1;
    }
    this.goToSlide(this.currentIndex);
  }
  
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.options.autoplayDelay);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Générateur d'images dynamiques pour les articles
class ImageGenerator {
  static getArticleImage(category, title) {
    const images = {
      'macroeconomics': [
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=800&h=400&fit=crop'
      ],
      'climate': [
        'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop'
      ],
      'governance': [
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=400&fit=crop'
      ],
      'debt': [
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop'
      ]
    };
    
    const categoryImages = images[category] || images['macroeconomics'];
    const hash = this.simpleHash(title);
    return categoryImages[hash % categoryImages.length];
  }
  
  static simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  
  static getEventImage(type) {
    const eventImages = {
      'conference': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      'webinar': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      'workshop': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
      'hybrid': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
    };
    
    return eventImages[type] || eventImages['conference'];
  }
}

// Système d'animation en scroll amélioré
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, this.observerOptions);
    
    this.init();
  }
  
  init() {
    // Observer tous les éléments à animer
    const elements = document.querySelectorAll([
      '.article-card',
      '.event-card',
      '.podcast-card',
      '.contribution-card',
      '.social-card',
      '.newsletter-signup',
      '.section-head'
    ].join(','));
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      this.observer.observe(el);
    });
  }
  
  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Animation spéciale pour les cartes
    if (element.classList.contains('article-card') || 
        element.classList.contains('event-card') ||
        element.classList.contains('podcast-card')) {
      setTimeout(() => {
        element.classList.add('animate-fade-scale');
      }, 200);
    }
  }
}

// Générateur de contenu dynamique
class ContentGenerator {
  static createArticleCard(article) {
    const imageUrl = article.cover || ImageGenerator.getArticleImage(article.category, article.title);
    const href = article.slug ? `article.html?slug=${encodeURIComponent(article.slug)}` : '#';
    return `
      <article class="article-card animate-slide-up" data-category="${article.category}">
        <a href="${href}" aria-label="Lire: ${article.title}">
          <div class="article-card-image">
            <img src="${imageUrl}" alt="${article.title}" loading="lazy">
            <div class="article-card-category">${article.categoryLabel}</div>
          </div>
          <div class="article-card-content">
            <h3 class="article-card-title">${article.title}</h3>
            <p class="article-card-excerpt">${article.excerpt}</p>
            <div class="article-card-meta">
              <span class="article-card-date">${article.date}</span>
              <span class="article-card-author">${article.author}</span>
            </div>
          </div>
        </a>
      </article>
    `;
  }
  
  static createEventCard(event) {
    const imageUrl = ImageGenerator.getEventImage(event.type);
    const date = new Date(event.date);
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });
    
    return `
      <article class="event-card animate-slide-up">
        <div class="event-date-big">
          <div class="event-date-circle">
            <span class="event-date-day">${day}</span>
            <span class="event-date-month">${month}</span>
          </div>
          <div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              ${event.location}
            </div>
          </div>
        </div>
        <p class="event-description">${event.description}</p>
        <a href="#" class="btn btn-outline">En savoir plus</a>
      </article>
    `;
  }
  
  static createPodcastCard(podcast) {
    return `
      <article class="podcast-card animate-slide-up">
        <div class="podcast-artwork">
          <div class="podcast-play-button" data-podcast-id="${podcast.id}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div class="podcast-info">
          <h3 class="podcast-title">${podcast.title}</h3>
          <p class="podcast-description">${podcast.description}</p>
          <span class="podcast-duration">${podcast.duration}</span>
        </div>
      </article>
    `;
  }
}

// Données d'exemple pour le contenu dynamique
const sampleData = {
  articles: [
    {
      id: 1,
      title: "L'impact de la dette souveraine sur la croissance économique",
      excerpt: "Une analyse approfondie des mécanismes de transmission entre endettement public et performance économique dans la région MENA.",
      category: "debt",
      categoryLabel: "Dette",
      author: "Dr. Amina Hassan",
      date: "15 mars 2025",
      featured: true
    },
    {
      id: 2,
      title: "Transition énergétique et développement durable",
      excerpt: "Les défis et opportunités de la transition vers les énergies renouvelables en Afrique du Nord.",
      category: "climate",
      categoryLabel: "Climat",
      author: "Prof. Karim Al-Rashid",
      date: "12 mars 2025",
      featured: true
    },
    {
      id: 3,
      title: "Gouvernance et transparence institutionnelle",
      excerpt: "Comment améliorer la qualité des institutions pour favoriser la croissance économique.",
      category: "governance",
      categoryLabel: "Gouvernance",
      author: "Dr. Sarah Mansour",
      date: "10 mars 2025",
      featured: false
    },
    {
      id: 4,
      title: "Intégration économique régionale et commerce",
      excerpt: "Les perspectives d'approfondissement de l'intégration économique dans la région MENA.",
      category: "macroeconomics",
      categoryLabel: "Macro",
      author: "Prof. Ahmed Benali",
      date: "8 mars 2025",
      featured: true
    }
  ],
  
  events: [
    {
      id: 1,
      title: "Conférence internationale sur la dette souveraine",
      description: "Trois jours de discussions avec les plus grands experts mondiaux sur les enjeux de la dette.",
      date: "2025-04-15",
      location: "Paris, France",
      type: "conference"
    },
    {
      id: 2,
      title: "Webinaire : Financement vert en Afrique",
      description: "Comment mobiliser les capitaux privés pour financer la transition écologique.",
      date: "2025-04-22",
      location: "En ligne",
      type: "webinar"
    },
    {
      id: 3,
      title: "Atelier sur la gouvernance économique",
      description: "Formation pratique pour les décideurs publics sur les meilleures pratiques.",
      date: "2025-05-10",
      location: "Rabat, Maroc",
      type: "workshop"
    }
  ],
  
  podcasts: [
    {
      id: 1,
      title: "Dette souveraine : vers une restructuration ?",
      description: "Interview avec Dr. Fatima Benali sur l'avenir de la dette africaine.",
      duration: "42 min"
    },
    {
      id: 2,
      title: "Transition énergétique au Moyen-Orient",
      description: "Analyse des défis et opportunités avec Prof. Hassan Al-Rashid.",
      duration: "38 min"
    },
    {
      id: 3,
      title: "Gouvernance et développement",
      description: "Comment améliorer la qualité institutionnelle avec Dr. Sarah Toumi.",
      duration: "45 min"
    }
  ]
};

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialiser les carousels
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(carousel => {
    new MenaraCarousel(carousel);
  });
  
  // Initialiser les animations au scroll
  new ScrollAnimations();
  
  // Générer du contenu dynamique sur les pages appropriées
  generateDynamicContent();
  
  // Ajouter des interactions aux boutons de lecture des podcasts
  document.addEventListener('click', function(e) {
    if (e.target.closest('.podcast-play-button')) {
      const button = e.target.closest('.podcast-play-button');
      const podcastId = button.dataset.podcastId;
      playPodcast(podcastId);
    }
  });
  
});

// Fonction pour générer du contenu dynamique
function generateDynamicContent() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Page d'accueil - Articles en vedette
  if (currentPage === 'index.html' || currentPage === '') {
    const featuredContainer = document.querySelector('.featured-articles .articles-grid');
    if (featuredContainer) {
      const featuredArticles = sampleData.articles.filter(article => article.featured);
      featuredContainer.innerHTML = featuredArticles.map(article => 
        ContentGenerator.createArticleCard(article)
      ).join('');
    }
  }
  
  // Page des événements
  if (currentPage === 'news-events.html') {
    const eventsContainer = document.querySelector('.events-grid');
    if (eventsContainer) {
      eventsContainer.innerHTML = sampleData.events.map(event => 
        ContentGenerator.createEventCard(event)
      ).join('');
    }
  }
  
  // Page des podcasts
  if (currentPage === 'podcasts.html') {
    const podcastsContainer = document.querySelector('.podcast-grid');
    if (podcastsContainer) {
      podcastsContainer.innerHTML = sampleData.podcasts.map(podcast => 
        ContentGenerator.createPodcastCard(podcast)
      ).join('');
    }
  }
  
  // Page des articles
  if (currentPage === 'articles.html') {
    // Prefer external data if provided
    const data = (window.MENARA_ARTICLES || sampleData.articles).map(a => ({
      ...a,
      // Normalize fields for existing card component
      categoryLabel: a.categoryLabel || a.category,
      excerpt: a.excerpt || '',
      author: a.author || '',
      date: a.date || ''
    }));

    // Populate any legacy grid if present
    const legacy = document.querySelector('.articles-grid:not([data-populate])');
    if (legacy) legacy.innerHTML = data.map(article => ContentGenerator.createArticleCard(article)).join('');
  }
}

// Fonction pour simuler la lecture d'un podcast
function playPodcast(podcastId) {
  const podcast = sampleData.podcasts.find(p => p.id == podcastId);
  if (podcast) {
    // Animation du bouton
    const button = document.querySelector(`[data-podcast-id="${podcastId}"]`);
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    `;
    
    // Simuler la lecture
    setTimeout(() => {
      button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }, 3000);
    
    console.log(`Lecture du podcast: ${podcast.title}`);
  }
}

// Export pour utilisation globale
window.MenaraCarousel = MenaraCarousel;
window.ImageGenerator = ImageGenerator;
window.ContentGenerator = ContentGenerator;
window.sampleData = sampleData;