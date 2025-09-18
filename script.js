// Accessible mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  // Car grid switching logic for showcase
  const navBtns = document.querySelectorAll('.slider-nav-btn');
  const carGrids = document.querySelectorAll('.car-grid');
  // Helper: activate a category with a small fade transition
  function activateCategory(cat) {
    const target = document.querySelector(`.car-grid[data-category="${cat}"]`);
    if (!target) return;
    // remove active from others with a short fade
    carGrids.forEach(grid => {
      if (grid === target) return;
      if (grid.classList.contains('active')) {
        grid.classList.remove('active');
        grid.classList.add('fade-out');
        // remove fade-out after transition
        setTimeout(() => grid.classList.remove('fade-out'), 300);
      }
    });
    // activate target
    target.classList.add('active');
    // update buttons
    navBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === cat));
    // update URL (shallow) so users can copy link
    try {
      const url = new URL(window.location);
      url.searchParams.set('category', cat);
      window.history.replaceState({}, '', url);
    } catch (e) {
      // ignore if URL manipulation isn't allowed
    }
    // focus the first focusable element in the grid for keyboard users
    const focusable = target.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus({preventScroll:true});
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      activateCategory(cat);
    });
  });
  // Determine initial category: from URL (?category=) or hash, or default to sport
  function getInitialCategory() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) return params.get('category');
    if (window.location.hash) return window.location.hash.replace('#', '');
    return 'sport';
  }

  const initial = getInitialCategory();
  // If initial category doesn't exist, fallback to first available button
  const availableCats = Array.from(navBtns).map(b => b.getAttribute('data-category'));
  const startCat = availableCats.includes(initial) ? initial : (availableCats[0] || 'sport');
  activateCategory(startCat);
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if (!btn || !nav) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Open main menu' : 'Close main menu');
    nav.dataset.open = String(!isOpen);
  });

  // Prevent clicks inside nav from bubbling to document click
  nav.addEventListener('click', (e) => e.stopPropagation());

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.dataset.open === 'true') {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open main menu');
      nav.dataset.open = 'false';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.dataset.open === 'true') {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open main menu');
      nav.dataset.open = 'false';
      btn.focus();
    }
  });
});
