// Outil de recherche pour le site Menara
class SiteSearch {
    constructor() {
        this.searchData = [];
        this.searchInput = null;
        this.searchResults = null;
        this.isSearchVisible = false;
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.loadSearchData();
        this.bindEvents();
    }

    createSearchInterface() {
        // Créer la structure HTML pour la recherche
        const searchHTML = `
            <div class="search-container" id="searchContainer">
                <button class="search-toggle" id="searchToggle" aria-label="Rechercher">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.384,21.619,16.855,15.09a9.284,9.284,0,1,0-1.768,1.768l6.529,6.529a1.266,1.266,0,0,0,1.768,0A1.251,1.251,0,0,0,23.384,21.619ZM2.75,9.5a6.75,6.75,0,1,1,6.75,6.75A6.758,6.758,0,0,1,2.75,9.5Z"/>
                    </svg>
                </button>
                <div class="search-overlay" id="searchOverlay">
                    <div class="search-box">
                        <div class="search-input-container">
                            <input 
                                type="text" 
                                id="searchInput" 
                                placeholder="Rechercher des articles, événements..." 
                                class="search-input"
                                autocomplete="off"
                            />
                            <button class="search-close" id="searchClose" aria-label="Fermer la recherche">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="search-results" id="searchResults"></div>
                    </div>
                </div>
            </div>
        `;

        // Injecter dans le header-actions
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertAdjacentHTML('afterbegin', searchHTML);
        }
    }

    loadSearchData() {
        // Données de recherche pour le site (à adapter selon votre contenu)
        this.searchData = [
            {
                title: "À propos de Menara",
                url: "about.html",
                type: "page",
                description: "Think tank étudiant indépendant et non-partisan"
            },
            {
                title: "Publications",
                url: "articles.html", 
                type: "page",
                description: "Analyses rigoureuses sur l'Afrique et le Moyen-Orient"
            },
            {
                title: "Événements",
                url: "news-events.html",
                type: "page", 
                description: "Actualités et événements à venir"
            },
            {
                title: "Contact",
                url: "contact.html",
                type: "page",
                description: "Nous contacter"
            },
            {
                title: "L'Egypte, que reste-t-il du \"too big to fail\" ?",
                url: "article.html?slug=too-big-to-fail",
                type: "article",
                description: "Transmission entre endettement public et performance économique dans la région MENA"
            },
            {
                title: "Retour du protectionnisme : quelles perspectives pour l'Afrique ?",
                url: "article.html?slug=protectionnisme-afrique", 
                type: "article",
                description: "Défis des économies africaines"
            },
            {
                title: "France-Maroc-Algérie, une histoire d'alliances et de rivalités",
                url: "article.html?slug=france-maroc-algerie",
                type: "article", 
                description: "Relations diplomatiques au Maghreb au prisme des tensions géopolitiques et économiques actuelles"
            },
            {
                title: "Raffinerie Dangote", 
                url: "article.html?slug=raffinerie-dangote",
                type: "article",
                description: "Impact économique au Nigeria"
            },
            {
                title: "Reconstruction de la Syrie",
                url: "article.html?slug=reconstruction-syrie",
                type: "article",
                description: "Enjeux post-conflit"
            },
            {
                title: "Entretien avec Sidi Ould Tah",
                url: "article.html?slug=sidi-ould-tah",
                type: "article", 
                description: "Portrait et analyse"
            },
            {
                title: "Entretien avec Daher",
                url: "article.html?slug=entretien-daher",
                type: "article",
                description: "Interview exclusive"
            }
        ];
    }

    bindEvents() {
        const searchToggle = document.getElementById('searchToggle');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        const searchOverlay = document.getElementById('searchOverlay');

        if (searchToggle) {
            searchToggle.addEventListener('click', () => this.toggleSearch());
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.closeSearch();
                }
            });
        }

        // Raccourci clavier Ctrl+K ou Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }
        });
    }

    toggleSearch() {
        if (this.isSearchVisible) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }

    openSearch() {
        const overlay = document.getElementById('searchOverlay');
        const input = document.getElementById('searchInput');
        
        if (overlay && input) {
            overlay.classList.add('active');
            this.isSearchVisible = true;
            setTimeout(() => input.focus(), 100);
        }
    }

    closeSearch() {
        const overlay = document.getElementById('searchOverlay');
        const input = document.getElementById('searchInput');
        const results = document.getElementById('searchResults');
        
        if (overlay) {
            overlay.classList.remove('active');
            this.isSearchVisible = false;
        }
        
        if (input) {
            input.value = '';
        }
        
        if (results) {
            results.innerHTML = '';
        }
    }

    performSearch(query) {
        const results = document.getElementById('searchResults');
        if (!results) return;

        if (!query.trim()) {
            results.innerHTML = '';
            return;
        }

        const filteredResults = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredResults.length === 0) {
            results.innerHTML = '<div class="search-no-results">Aucun résultat trouvé</div>';
            return;
        }

        const resultsHTML = filteredResults.map(item => `
            <a href="${item.url}" class="search-result-item" data-type="${item.type}">
                <div class="search-result-title">${item.title}</div>
                <div class="search-result-description">${item.description}</div>
                <div class="search-result-type">${item.type === 'article' ? 'Article' : 'Page'}</div>
            </a>
        `).join('');

        results.innerHTML = resultsHTML;
    }
}

// Initialiser la recherche quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new SiteSearch();
});