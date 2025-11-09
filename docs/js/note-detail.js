const encodePathSegments = (path = '') => path
  .split('/')
  .map((segment) => encodeURIComponent(segment))
  .join('/');

const resolveRelativeUrl = (path = '') => {
  if (!path) return '';
  if (/^https?:/i.test(path)) return path;
  const encoded = encodePathSegments(path);
  try {
    return new URL(encoded, window.location.href).href;
  } catch (error) {
    return encoded;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.hasAttribute('data-note-detail')) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const note = Array.isArray(window.notesFocusData)
    ? window.notesFocusData.find((entry) => entry.slug === slug)
    : null;

  const heroSection = document.querySelector('.note-hero');
  const carouselSection = document.querySelector('.note-carousel-section');
  const downloadSection = document.querySelector('.note-download-section');
  const emptyState = document.querySelector('.note-empty-state');

  if (!note) {
    if (heroSection) heroSection.setAttribute('hidden', '');
    if (carouselSection) carouselSection.setAttribute('hidden', '');
    if (downloadSection) downloadSection.setAttribute('hidden', '');
    if (emptyState) emptyState.removeAttribute('hidden');
    return;
  }

  const heroTitle = document.querySelector('.note-hero-title');
  const heroDescription = document.querySelector('.note-hero-description');
  const heroMeta = document.querySelector('.note-hero-meta');
  const heroCover = document.querySelector('.note-hero-cover');
  const downloadLinks = document.querySelectorAll('.note-download-link');

  if (heroTitle) heroTitle.textContent = note.title;
  if (heroDescription) heroDescription.textContent = note.description || '';
  if (heroMeta) {
    const metaBits = [note.author, note.date].filter(Boolean);
    heroMeta.textContent = metaBits.join(' · ');
  }
  if (heroCover) {
    heroCover.src = resolveRelativeUrl(note.coverImage);
    heroCover.alt = note.title;
  }

  if (note.title) {
    document.title = `${note.title} - Note Focus - Menara`;
  }

  const pdfHref = encodePathSegments(note.pdf);
  const pdfUrl = resolveRelativeUrl(note.pdf);
  downloadLinks.forEach((link) => {
    link.href = pdfUrl;
    link.setAttribute('data-download-href', pdfHref);
  });

  const track = document.querySelector('.note-carousel-track');
  const loader = document.querySelector('.note-carousel-loader');
  const errorBox = document.querySelector('.note-carousel-error');
  const status = document.querySelector('.note-carousel-status');
  const prevButton = document.querySelector('.note-carousel-prev');
  const nextButton = document.querySelector('.note-carousel-next');
  const trackWrapper = document.querySelector('.note-carousel-track-wrapper');

  const showError = (message) => {
    if (loader) loader.setAttribute('hidden', '');
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.removeAttribute('hidden');
    }
  };

  const mountPdfFallback = () => {
    console.log('Montage du fallback iframe pour:', pdfUrl);
    if (!trackWrapper) {
      console.error('trackWrapper introuvable');
      return;
    }
    const existingFallback = trackWrapper.querySelector('.note-carousel-fallback');
    if (existingFallback) {
      console.log('Fallback déjà monté');
      return;
    }

    if (track) track.setAttribute('hidden', '');
    if (prevButton) prevButton.setAttribute('hidden', '');
    if (nextButton) nextButton.setAttribute('hidden', '');

    const fallback = document.createElement('div');
    fallback.className = 'note-carousel-fallback';

    const iframe = document.createElement('iframe');
    iframe.title = `Visionneuse PDF pour ${note.title}`;
    iframe.loading = 'lazy';
    // Ajouter le paramètre zoom=65 pour afficher le PDF à 65%
    iframe.src = pdfUrl + '#zoom=65';
    iframe.setAttribute('allow', 'fullscreen');
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';

    fallback.appendChild(iframe);
    trackWrapper.appendChild(fallback);

    if (status) {
      status.textContent = 'Lecteur PDF chargé - Vous pouvez faire défiler le document ci-dessous';
    }
    
    console.log('Fallback iframe monté avec succès');
  };

  if (!track || !status || !prevButton || !nextButton) {
    showError('Impossible de préparer le carrousel de lecture.');
    return;
  }

  // Toujours utiliser le fallback iframe car c'est plus fiable
  console.log("Utilisation du lecteur PDF iframe (plus fiable)");
  if (loader) loader.setAttribute('hidden', '');
  if (errorBox) errorBox.setAttribute('hidden', '');
  mountPdfFallback();
  return;
  
  /* Code PDF.js désactivé pour plus de fiabilité
  if (typeof pdfjsLib === 'undefined') {
    console.error("PDF.js n'est pas chargé, utilisation du fallback iframe");
    if (loader) loader.setAttribute('hidden', '');
    if (errorBox) errorBox.setAttribute('hidden', '');
    mountPdfFallback();
    return;
  }
  */

  const runningFromFile = window.location.protocol === 'file:';
  if (!runningFromFile) {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    } catch (workerError) {
      console.warn('Impossible de configurer le worker PDF.js:', workerError);
    }
  }

  let slides = [];
  let currentIndex = 0;

  const updateControls = () => {
    if (!slides.length) {
      if (status) status.textContent = 'Aucune page disponible';
      prevButton.disabled = true;
      nextButton.disabled = true;
      return;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    status.textContent = `Page ${currentIndex + 1} / ${slides.length}`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= slides.length - 1;
  };

  const fetchPdfData = async () => {
    try {
      const sources = [pdfUrl, pdfHref].filter(Boolean);
      for (const source of sources) {
        try {
          const response = await fetch(source, { cache: 'no-store' });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const buffer = await response.arrayBuffer();
          return new Uint8Array(buffer);
        } catch (attemptError) {
          console.warn('Échec du chargement via', source, attemptError);
        }
      }
    } catch (fetchError) {
      console.warn('Lecture directe du PDF impossible, tentative via URL', fetchError);
    }
    return null;
  };

  const renderPdf = async () => {
    console.log('Début du rendu PDF, URL:', pdfUrl);
    track.innerHTML = '';
    slides = [];
    currentIndex = 0;
    if (status) status.textContent = 'Chargement en cours...';
    if (loader) loader.removeAttribute('hidden');
    if (errorBox) errorBox.setAttribute('hidden', '');

    try {
      const pdfData = await fetchPdfData();
      const commonOptions = {
        withCredentials: false,
        disableAutoFetch: false,
        disableStream: false,
        disableWorker: runningFromFile,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true
      };

      const loadingTask = pdfData
        ? pdfjsLib.getDocument(Object.assign({ data: pdfData }, commonOptions))
        : pdfjsLib.getDocument(Object.assign({ url: pdfUrl }, commonOptions));

      const pdfDocument = await loadingTask.promise;
      console.log('PDF chargé avec succès, nombre de pages:', pdfDocument.numPages);
      
      if (!pdfDocument || pdfDocument.numPages === 0) {
        throw new Error('Document PDF vide ou invalide');
      }

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        if (status) status.textContent = `Chargement de la page ${pageNumber} / ${pdfDocument.numPages}...`;
        
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const slide = document.createElement('div');
        slide.className = 'note-slide';
        slide.setAttribute('data-page-number', String(pageNumber));
        slide.appendChild(canvas);
        track.appendChild(slide);
      }

      slides = Array.from(track.children);

      if (loader) loader.setAttribute('hidden', '');
      if (track) track.removeAttribute('hidden');
      updateControls();
    } catch (error) {
      console.error('Impossible de charger la note focus :', error);
      console.error('Type d\'erreur:', error.name, 'Message:', error.message);
      console.error('Stack:', error.stack);
      
      if (runningFromFile) {
        console.log('Mode file://, activation du fallback iframe');
        if (loader) loader.setAttribute('hidden', '');
        if (errorBox) errorBox.setAttribute('hidden', '');
        mountPdfFallback();
        if (status) {
          status.textContent = 'Visionneuse alternative ouverte. Téléchargez la note si nécessaire.';
        }
      } else {
        console.log('Erreur en mode serveur, affichage du message d\'erreur');
        showError("Le PDF n'a pas pu être chargé. Erreur: " + error.message);
      }
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateControls();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex += 1;
      updateControls();
    }
  });

  renderPdf();
});
