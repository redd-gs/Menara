/**
 * Gestionnaire des événements pour la page news-events.html
 * Trie les événements en "À venir" et "Passés"
 */

document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.querySelector('.events-grid');
  if (!eventsContainer) return;

  const events = Array.from(document.querySelectorAll('.event-card'));
  if (events.length === 0) return;

  // Fonction pour parser la date en français (ex: "3 décembre 2025")
  const parseFrenchDate = (dateStr) => {
    const months = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
      'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };

    // Utilisation de regex pour séparer par un ou plusieurs espaces
    const parts = dateStr.trim().toLowerCase().split(/\s+/);
    if (parts.length < 3) return new Date(0); // Date invalide

    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);

    if (isNaN(day) || month === undefined || isNaN(year)) return new Date(0);

    return new Date(year, month, day);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // On compare seulement les dates

  const upcomingEvents = [];
  const pastEvents = [];

  events.forEach(event => {
    const dateElement = event.querySelector('.event-title');
    if (!dateElement) return;

    const dateStr = dateElement.textContent.trim();
    const eventDate = parseFrenchDate(dateStr);

    // On stocke la date dans l'objet pour le tri
    event.dataset.timestamp = eventDate.getTime();

    if (eventDate >= today) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  });

  // Tri : 
  // À venir : du plus proche au plus lointain (ascendant)
  upcomingEvents.sort((a, b) => a.dataset.timestamp - b.dataset.timestamp);
  
  // Passés : du plus récent au plus ancien (descendant)
  pastEvents.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);

  // Vider le conteneur
  eventsContainer.innerHTML = '';

  // Réinsérer les événements à venir
  if (upcomingEvents.length > 0) {
    // On garde le titre de la page "Événements à venir" cohérent
    upcomingEvents.forEach(event => eventsContainer.appendChild(event));
  } else {
    const noUpcoming = document.createElement('p');
    noUpcoming.textContent = "Aucun événement à venir pour le moment.";
    noUpcoming.style.gridColumn = "1 / -1";
    noUpcoming.style.textAlign = "center";
    noUpcoming.style.padding = "2rem";
    noUpcoming.style.color = "#6b7280";
    eventsContainer.appendChild(noUpcoming);
  }

  // Ajouter une séparation et les événements passés si nécessaire
  if (pastEvents.length > 0) {
    // Créer un titre pour les événements passés
    // Comme on est dans une grid, on doit faire attention à l'affichage
    // On va insérer un élément full-width
    
    const separator = document.createElement('div');
    separator.style.gridColumn = "1 / -1";
    separator.style.marginTop = "3rem";
    separator.style.marginBottom = "1.5rem";
    separator.style.borderTop = "1px solid #e5e7eb";
    separator.style.paddingTop = "2rem";
    
    const title = document.createElement('h2');
    title.textContent = "Événements passés";
    title.style.fontSize = "1.75rem";
    title.style.color = "#0a276a";
    title.style.fontFamily = "'Playfair Display', serif";
    title.style.marginBottom = "1rem";
    
    separator.appendChild(title);
    eventsContainer.appendChild(separator);

    pastEvents.forEach(event => {
        // Optionnel : griser légèrement les événements passés
        event.style.opacity = "0.8";
        event.classList.add('event-past');
        eventsContainer.appendChild(event);
    });
  }
});
