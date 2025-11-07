// Articles data and simple rendering helpers for Menara (no build step)
// How to add a new article:
// 1) Drop a cover image into docs/assets/articles/ (PNG/JPG/SVG)
// 2) Add an entry to window.MENARA_ARTICLES below with id, slug, title, excerpt, category, author, date, cover, pdf
// 3) Create a content file docs/articles/<slug>.html with the article HTML body (only the inner content, not a full page)
// 4) (Optional) Drop a PDF into docs/assets/pdf/ and set the pdf path in the article entry
// The system will link /article.html?slug=<slug> to render the page.

window.MENARA_ARTICLES = [
  {
    id: 1,
    slug: 'too-big-to-fail',
    title: "L'Egypte, que reste-t-il du \"too big to fail\" ?",
    excerpt: 'Transmission entre endettement public et performance économique dans la région MENA.',
    category: 'debt',
    categoryLabel: 'Dette',
    author: 'Yasmine Guemmaz',
    date: 'Mars 2025',
    cover: 'assets/articles/too-big-to-fail.jpg',
    pdf: 'assets/pdf/too-big-to-fail.pdf',
    featured: true
  },
  {
    id: 2,
    slug: 'protectionnisme-afrique',
    title: 'Retour du protectionnisme : quelles perspectives pour l\'Afrique ?',
    excerpt: 'Défis des économies africaines.',
    category: 'Economie',
    categoryLabel: 'Economie',
    author: 'Yasmine Guemmaz',
    date: 'Avril 2025',
    cover: 'assets/articles/protectionnisme-afrique.jpg',
    pdf: 'assets/pdf/protectionnisme-afrique.pdf',
    featured: true
  },
  {
    id: 3,
    slug: 'france-maroc-algerie',
    title: 'France-Maroc-Algérie, une histoire d’alliances et de rivalités au prisme des tensions géopolitiques et économiques actuelles',
    excerpt: '',
    category: 'governance',
    categoryLabel: 'Gouvernance',
    author: 'Vincent Plantevin',
    date: '12 mai 2025',
    cover: 'assets/articles/france-maroc-algérie.jpg',
    pdf: 'assets/pdf/france-maroc-algérie.pdf'
  },
  {
    id: 4,
    slug: 'raffinerie-dangote',
    title: 'Raffinerie Dangote : un catalyseur d\'industrialisation au coeur des défis nigérians',
    excerpt: '',
    category: 'Industrie',
    categoryLabel: 'Industrie',
    author: 'Adnane Belfami',
    date: '2 Juin 2025',
    cover: 'assets/articles/raffinerie-dangote.jpg',
    pdf: 'assets/pdf/raffinerie-dangote.pdf'
  },
  {
    id: 5,
    slug: 'sidi-ould-tah',
    title: 'Redéfinir le développement africain : les quatre chantiers de Sidi Ould Tah, nouveau président de la Banque africaine de développement',
    excerpt: '',
    category: 'Gouvernance',
    categoryLabel: 'Gouvernance',
    author: 'Yasmine Guemmaz et Vincent Plantevin',
    date: '20 Juin 2025',
    cover: 'assets/articles/sidi-ould-tah.jpg',
    pdf: 'assets/pdf/sidi-ould-tah.pdf'
  },
  {
    id: 6,
    slug: 'reconstruction-syrie',
    title: 'La Syrie, sur le chemin de la reconstruction ?',
    excerpt: '',
    category: 'Gouvernance',
    categoryLabel: 'Gouvernance',
    author: 'Grégoire Descamps',
    date: '12 mai 2025',
    cover: 'assets/articles/reconstruction-syrie.jpg',
    pdf: 'assets/pdf/reconstruction-syrie.pdf'
  },
  {
    id: 7,
    slug: 'entretien-daher',
    title: 'La Syrie: sur le chemin de la reconstruction économique, dans l\'impasse de la transition politique',
    excerpt: '',
    category: 'Gouvernance',
    categoryLabel: 'Gouvernance',
    author: 'Vincent Plantevin',
    date: 'Juin 2025',
    cover: 'assets/articles/entretien-daher.png',
    pdf: 'assets/pdf/entretien-daher.pdf'
  }
];

(function(){
  function byDataset(selector, value){
    return Array.from(document.querySelectorAll(selector)).filter(el => el.dataset.populate === value);
  }
  function cardHTML(a){
    const img = a.cover || (window.ImageGenerator ? ImageGenerator.getArticleImage(a.category, a.title) : '');
    const link = `article.html?slug=${encodeURIComponent(a.slug)}`;
    return `
      <article class="article-card">
        <a href="${link}" aria-label="Lire: ${a.title}">
          <div class="article-card-image">
            <img src="${img}" alt="${a.title}" loading="lazy" />
          </div>
          <div class="article-card-content">
            <h3 class="article-card-title">${a.title}</h3>
            <p class="article-card-excerpt">${a.excerpt || ''}</p>
            <div class="article-card-meta"><span>${a.date||''}</span><span>${a.author||''}</span></div>
          </div>
        </a>
      </article>`;
  }
  function populate(){
    const data = (window.MENARA_ARTICLES||[]);
    byDataset('[data-populate]','detailed').forEach(el=>{
      el.innerHTML = data.map(cardHTML).join('');
    });
    // Carrousels: split in chunks of ~3 per slide
    const perSlide = 3;
    const chunks = [];
    for (let i=0;i<data.length;i+=perSlide) chunks.push(data.slice(i,i+perSlide));
    const slides = byDataset('[data-populate]','carousel');
    slides.forEach((grid, idx)=>{
      const items = chunks[idx] || [];
      grid.innerHTML = items.map(cardHTML).join('');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', populate); else populate();
})();
