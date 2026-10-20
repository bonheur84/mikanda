(() => {
  const favoritesLink = document.querySelector('header a[href*="favoris.html"]');

  if (!favoritesLink) return;

  const style = document.createElement('style');
  style.textContent = `
    .book-favorites-wrapper { position: relative; height: 100%; }
    .book-favorites-link {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      z-index: 10;
      display: inline-flex;
      width: 2.75rem;
      height: 2.75rem;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background: rgba(25, 35, 31, 0.9);
      color: #e6bd76;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      transition: background-color 0.2s, color 0.2s;
    }
    .book-favorites-link:hover { background: #b85235; color: #fff; }
    .book-favorites-link:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    .book-favorites-link svg { width: 1.25rem; height: 1.25rem; }
  `;
  document.head.append(style);

  const bookImages = '.grid article img[src*="assets/livre"], .grid article img[src*="assets/couvertures"]';

  document.querySelectorAll(bookImages).forEach((image) => {
    const card = image.closest('article');
    if (!card || card.dataset.hasFavoritesLink) return;

    const cardLink = image.closest('a') || card.querySelector('a');
    if (!cardLink || !cardLink.parentNode) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'book-favorites-wrapper';
    cardLink.parentNode.insertBefore(wrapper, cardLink);
    wrapper.append(cardLink);

    const heartLink = document.createElement('a');
    heartLink.href = favoritesLink.getAttribute('href');
    heartLink.setAttribute('aria-label', 'Voir mes favoris');
    heartLink.title = 'Voir mes favoris';
    heartLink.className = 'book-favorites-link';
    heartLink.innerHTML = '<i data-lucide="heart" class="h-5 w-5" aria-hidden="true"></i>';
    wrapper.append(heartLink);

    card.dataset.hasFavoritesLink = 'true';
  });

  if (window.lucide) lucide.createIcons();
})();
