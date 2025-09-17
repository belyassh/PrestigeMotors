// Accessible mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Open main menu' : 'Close main menu');
    nav.dataset.open = String(!isOpen);
  });

  // Close menu when focus moves outside (basic)
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open main menu');
      nav.dataset.open = 'false';
    }
  });
});
