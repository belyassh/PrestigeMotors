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

  // Smooth scroll from hero Browse Inventory button to moto grid with header offset
  const browseBtn = document.querySelector('.hero .btn[href^="#moto-grid"]');
  if (browseBtn) {
    browseBtn.addEventListener('click', (ev) => {
      // let native anchor behavior be suppressed so we can offset for sticky header
      ev.preventDefault();
      const target = document.querySelector('#moto-grid');
      if (!target) return;
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12; // small gap
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

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

/* --- Moto gallery rendering --- */
(() => {
  // fallback models (used if data/models.json is not available)
  const fallbackModels = [
    {
      id: 'bmw-m1000',
      name: 'BMW M1000',
      folder: 'moto/bmw-m1000',
      images: ['back.jpg','face.jpg','front.jpg','panel.jpg','side.jpg'],
      price: '$28,500',
      desc: 'High-performance motorcycle from BMW.',
      specs: {
        engine: 'Petrol',
        power: '205 hp',
        seats: 2,
        transmission: 'Manual',
        mileage: '1,200 km'
      }
    },
    {
      id: 'bmw-r',
      name: 'BMW R',
      folder: 'moto/bmw-r',
      images: ['close.jpg','front.jpg','side.jpg','wheel.jpg'],
      price: '$15,900',
      desc: 'Reliable ride with timeless styling.',
      specs: {
        engine: 'Petrol',
        power: '95 hp',
        seats: 2,
        transmission: 'Manual',
        mileage: '8,700 km'
      }
    },
    {
      id: 'diavel',
      name: 'Diavel',
      folder: 'moto/diavel',
      images: ['back.jpg','face.jpg','front.jpg'],
      price: '$22,000',
      desc: 'Muscular cruiser with modern tech.',
      specs: {
        engine: 'Petrol',
        power: '160 hp',
        seats: 2,
        transmission: 'Manual',
        mileage: '4,500 km'
      }
    },
    {
      id: 'diavel-bantley',
      name: 'Diavel Bantley',
      folder: 'moto/diavel-bantley',
      images: ['back.webp','backwheel.webp','front.webp','panel.webp','side A.webp','side B.webp','wheel.webp'],
      price: '$34,900',
      desc: 'Limited edition with premium finishes.',
      specs: {
        engine: 'Petrol',
        power: '180 hp',
        seats: 2,
        transmission: 'Automatic',
        mileage: '600 km'
      }
    },
    {
      id: 'diavel-lamborgini',
      name: 'Diavel Lamborghini',
      folder: 'moto/diavel-lamborgini',
      images: ['back.webp','close.webp','face.webp','face2.webp','panel.webp','wheel.webp'],
      price: '$39,500',
      desc: 'Exotic collaboration model.',
      specs: {
        engine: 'Petrol',
        power: '214 hp',
        seats: 2,
        transmission: 'Automatic',
        mileage: '300 km'
      }
    }
  ];

  const grid = document.getElementById('moto-grid');
  const modal = document.getElementById('gallery-modal');
  const modalImage = document.getElementById('modal-image');
  const modalName = document.getElementById('modal-name');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');

  if (!grid) return;

  function renderModels(models) {
    grid.innerHTML = '';
    models.forEach(model => {
      const card = document.createElement('article');
      card.className = 'moto-card';

  const front = model.images.find(i => i.toLowerCase().includes('front')) || model.images[0];
      const img = document.createElement('img');
      img.src = `${model.folder}/${front}`;
      img.alt = `${model.name} front`;

      const body = document.createElement('div');
      body.className = 'card-body';
      body.innerHTML = `
        <div class="model-name">${model.name}</div>
        <div class="model-desc">${model.desc}</div>
        <div class="model-price">${model.price}</div>
        <div class="card-actions">
          <button class="btn view-btn" data-model="${model.id}">View gallery</button>
        </div>
      `;

      // expose model id and front image on the card for convenient click handling
      card.dataset.model = model.id;
      card.dataset.front = front;
      // Make the card keyboard-focusable and announceable as a control
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open gallery for ${model.name}`);

      // keyboard: open on Enter or Space
      card.addEventListener('keydown', (ev) => {
        // Ignore key events that originate from interactive elements inside the card
        if (ev.target && ev.target.closest && ev.target.closest('a, button')) return;
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          const id = card.dataset.model;
          const modelEntry = models.find(m => m.id === id);
          let startIndex = 0;
          if (modelEntry) {
            const frontName = card.dataset.front;
            const idx = modelEntry.images.indexOf(frontName);
            startIndex = idx >= 0 ? idx : 0;
          }
          openModal(id, startIndex);
        }
      });
      card.appendChild(img);
      card.appendChild(body);
      grid.appendChild(card);
    });

    // modal state
    let currentModel = null;
    let currentIndex = 0;

    function openModal(modelId, index = 0) {
      const model = models.find(m => m.id === modelId);
      if (!model) return;
      currentModel = model;
      currentIndex = index;
      const imgPath = `${model.folder}/${model.images[currentIndex]}`;
      modalImage.src = imgPath;
      modalImage.alt = `${model.name} image ${currentIndex+1}`;
      modalName.textContent = model.name;
      modalDesc.textContent = model.desc;
      modalPrice.textContent = model.price;
      // update modal 'Show more' link to the model's page
      const modalShowMore = document.getElementById('modal-show-more');
      if (modalShowMore) {
        modalShowMore.href = `${model.folder}/index.html`;
        modalShowMore.setAttribute('aria-label', `Open details for ${model.name}`);
      }
        // render specs into modal (if provided)
        const modalInfo = document.getElementById('modal-info');
        if (modalInfo) {
          // remove existing specs list if any
          const oldSpecs = modalInfo.querySelector('.modal-specs');
          if (oldSpecs) oldSpecs.remove();
          if (model.specs && typeof model.specs === 'object') {
            const dl = document.createElement('dl');
            dl.className = 'modal-specs';
            // preferred order
            const order = ['engine','power','seats','transmission','mileage'];
            order.forEach(key => {
              if (model.specs[key] !== undefined) {
                const dt = document.createElement('dt');
                dt.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                const dd = document.createElement('dd');
                dd.textContent = model.specs[key];
                dl.appendChild(dt);
                dl.appendChild(dd);
              }
            });
            modalInfo.appendChild(dl);
          }
        }
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentModel = null;
    }

    function showNext() {
      if (!currentModel) return;
      currentIndex = (currentIndex + 1) % currentModel.images.length;
      modalImage.src = `${currentModel.folder}/${currentModel.images[currentIndex]}`;
      modalImage.alt = `${currentModel.name} image ${currentIndex+1}`;
    }

    function showPrev() {
      if (!currentModel) return;
      currentIndex = (currentIndex - 1 + currentModel.images.length) % currentModel.images.length;
      modalImage.src = `${currentModel.folder}/${currentModel.images[currentIndex]}`;
      modalImage.alt = `${currentModel.name} image ${currentIndex+1}`;
    }

    // event delegation: open modal when clicking the view button or anywhere on the card
    grid.addEventListener('click', (e) => {
      // If the click originated from a link, allow normal navigation (do not open modal)
      if (e.target.closest && e.target.closest('a')) return;

      // if clicked the explicit view button, open starting at index 0
      const btn = e.target.closest('.view-btn');
      if (btn) {
        const id = btn.getAttribute('data-model');
        openModal(id, 0);
        return;
      }

      // if clicked anywhere inside a card (image, body), open the gallery for that model
      const card = e.target.closest('.moto-card');
      if (card && card.dataset && card.dataset.model) {
        const id = card.dataset.model;
        // try to open at the front image if present in the model images
        const model = models.find(m => m.id === id);
        let startIndex = 0;
        if (model) {
          const frontName = card.dataset.front;
          const idx = model.images.indexOf(frontName);
          startIndex = idx >= 0 ? idx : 0;
        }
        openModal(id, startIndex);
      }
    });

    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // keyboard nav inside modal
    document.addEventListener('keydown', (e) => {
      if (modal.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeModal();
      }
    });

    // click outside modal-content to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Try to load data/models.json; fall back to the embedded list
  fetch('data/models.json').then(r => {
    if (!r.ok) throw new Error('no models.json');
    return r.json();
  }).then(json => {
    renderModels(json);
  }).catch(() => {
    renderModels(fallbackModels);
  });

})();
