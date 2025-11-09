const encodePathSegments = (path = '') => path
  .split('/')
  .map((segment) => encodeURIComponent(segment))
  .join('/');

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.notes-focus-grid');
  if (!grid || !Array.isArray(window.notesFocusData)) {
    return;
  }

  grid.innerHTML = '';

  window.notesFocusData.forEach((note) => {
    const card = document.createElement('article');
    card.className = 'note-card';

    const link = document.createElement('a');
    link.className = 'note-card-link-wrapper';
    link.href = `note.html?slug=${encodeURIComponent(note.slug)}`;
    link.setAttribute('aria-label', `Ouvrir la note focus "${note.title}"`);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'note-card-image';
    const image = document.createElement('img');
    image.src = encodePathSegments(note.coverImage);
    image.alt = note.title;
    image.loading = 'lazy';
    imageWrapper.appendChild(image);

    const body = document.createElement('div');
    body.className = 'note-card-body';

    const title = document.createElement('h3');
    title.className = 'note-card-title';
    title.textContent = note.title;
    body.appendChild(title);

    if (note.description) {
      const description = document.createElement('p');
      description.className = 'note-card-description';
      description.textContent = note.description;
      body.appendChild(description);
    }

    const cta = document.createElement('span');
    cta.className = 'note-card-cta';
    cta.textContent = 'Voir la note focus';
    body.appendChild(cta);

    const meta = document.createElement('div');
    meta.className = 'note-card-meta';
    if (note.author) {
      const author = document.createElement('span');
      author.className = 'note-card-author';
      author.textContent = note.author;
      meta.appendChild(author);
    }
    if (note.date) {
      const date = document.createElement('span');
      date.className = 'note-card-date';
      date.textContent = note.date;
      meta.appendChild(date);
    }
    body.appendChild(meta);

    link.appendChild(imageWrapper);
    link.appendChild(body);
    card.appendChild(link);
    grid.appendChild(card);
  });
});
