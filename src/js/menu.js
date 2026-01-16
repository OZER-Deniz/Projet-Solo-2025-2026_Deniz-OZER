(function () {
  const menu = document.getElementById('main-menu');
  const openBtn = document.querySelector('.header__menu-btn');
  const closeBtn = document.querySelector('.menu__close-btn');
  const langButtonsHeader = document.querySelectorAll('.header__lang-btn');
  const langButtonsMenu = document.querySelectorAll('.menu__lang-btn');
  const parentToggle = document.querySelector('.menu__link--parent');
  const submenu = document.getElementById('articles-submenu');

  let lastFocused = null;

  function openMenu() {
    lastFocused = document.activeElement;
    menu.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    // Move focus to close button for accessibility
    if (closeBtn) closeBtn.focus();
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    // Trap focus within menu
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleOutsideClick, true);
  }

  function closeMenu() {
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('click', handleOutsideClick, true);
    if (lastFocused) lastFocused.focus();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    // Basic focus trap: keep Tab cycling inside menu when open
    if (e.key === 'Tab' && menu.getAttribute('aria-hidden') === 'false') {
      const focusable = menu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleOutsideClick(e) {
    if (menu.getAttribute('aria-hidden') === 'true') return;
    // If click happens outside the menu container, close
    const container = menu.querySelector('.menu__container');
    if (container && !container.contains(e.target)) {
      closeMenu();
    }
  }

  function toggleSubmenu() {
    if (!parentToggle || !submenu) return;
    const expanded = parentToggle.getAttribute('aria-expanded') === 'true';
    parentToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  }

  function setLangActive(buttons, clicked) {
    buttons.forEach(btn => {
      btn.classList.toggle('header__lang-btn--active', btn === clicked && btn.classList.contains('header__lang-btn'));
      btn.classList.toggle('menu__lang-btn--active', btn === clicked && btn.classList.contains('menu__lang-btn'));
      btn.setAttribute('aria-pressed', btn === clicked ? 'true' : 'false');
    });
  }

  // Event bindings
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const isHidden = menu.getAttribute('aria-hidden') !== 'false';
      if (isHidden) openMenu(); else closeMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  if (parentToggle) {
    parentToggle.addEventListener('click', toggleSubmenu);
  }

  langButtonsHeader.forEach(btn => {
    btn.addEventListener('click', () => setLangActive(langButtonsHeader, btn));
  });

  langButtonsMenu.forEach(btn => {
    btn.addEventListener('click', () => setLangActive(langButtonsMenu, btn));
  });
})();
