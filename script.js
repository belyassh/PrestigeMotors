// Accessible mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
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
