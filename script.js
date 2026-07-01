(() => {
  const fallbackModels = [
    {
      id: "bmw-m1000",
      name: "BMW M1000",
      folder: "moto/bmw-m1000",
      images: ["back.jpg", "face.jpg", "front.jpg", "panel.jpg", "side.jpg"],
      price: "$28,500",
      desc: "Высокопроизводительный спортбайк с трековым характером.",
      specs: {
        engine: "Бензин",
        power: "205 л.с.",
        seats: 2,
        transmission: "Механика",
        mileage: "1 200 км"
      }
    },
    {
      id: "bmw-r",
      name: "BMW R",
      folder: "moto/bmw-r",
      images: ["close.jpg", "front.jpg", "side.jpg", "wheel.jpg"],
      price: "$15,900",
      desc: "Надежная модель с классическим силуэтом и комфортной посадкой.",
      specs: {
        engine: "Бензин",
        power: "95 л.с.",
        seats: 2,
        transmission: "Механика",
        mileage: "8 700 км"
      }
    },
    {
      id: "diavel",
      name: "Diavel",
      folder: "moto/diavel",
      images: ["back.jpg", "face.jpg", "front.jpg"],
      price: "$22,000",
      desc: "Мощный круизер с агрессивной посадкой и современной электроникой.",
      specs: {
        engine: "Бензин",
        power: "160 л.с.",
        seats: 2,
        transmission: "Механика",
        mileage: "4 500 км"
      }
    },
    {
      id: "diavel-bantley",
      name: "Diavel Bantley",
      folder: "moto/diavel-bantley",
      images: ["back.webp", "backwheel.webp", "front.webp", "panel.webp", "side A.webp", "side B.webp", "wheel.webp"],
      price: "$34,900",
      desc: "Лимитированная версия с эксклюзивной отделкой и деталями.",
      specs: {
        engine: "Бензин",
        power: "180 л.с.",
        seats: 2,
        transmission: "Автомат",
        mileage: "600 км"
      }
    },
    {
      id: "diavel-lamborgini",
      name: "Diavel Lamborghini",
      folder: "moto/diavel-lamborgini",
      images: ["back.webp", "close.webp", "face.webp", "face2.webp", "panel.webp", "wheel.webp"],
      price: "$39,500",
      desc: "Экзотическая коллаборация с акцентом на динамику и дизайн.",
      specs: {
        engine: "Бензин",
        power: "214 л.с.",
        seats: 2,
        transmission: "Автомат",
        mileage: "300 км"
      }
    }
  ];

  const ui = {
    menuToggle: document.querySelector(".menu-toggle"),
    menuClose: document.querySelector(".menu-close"),
    menuOverlay: document.getElementById("menu-overlay"),
    overlayLinks: document.querySelectorAll(".overlay-nav a"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    grid: document.getElementById("moto-grid"),
    resultCount: document.getElementById("result-count"),
    emptyState: document.getElementById("empty-state"),
    modal: document.getElementById("gallery-modal"),
    modalImage: document.getElementById("modal-image"),
    modalName: document.getElementById("modal-name"),
    modalDesc: document.getElementById("modal-desc"),
    modalPrice: document.getElementById("modal-price"),
    modalInfo: document.getElementById("modal-info"),
    modalShowMore: document.getElementById("modal-show-more"),
    closeBtn: document.querySelector(".modal-close"),
    prevBtn: document.querySelector(".modal-prev"),
    nextBtn: document.querySelector(".modal-next")
  };

  let allModels = [];
  let filteredModels = [];
  let modalState = { model: null, index: 0 };

  function parsePrice(value) {
    if (!value) return 0;
    return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
  }

  function openMenu() {
    if (!ui.menuOverlay) return;
    ui.menuOverlay.setAttribute("aria-hidden", "false");
    ui.menuToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!ui.menuOverlay) return;
    ui.menuOverlay.setAttribute("aria-hidden", "true");
    ui.menuToggle?.setAttribute("aria-expanded", "false");
    if (ui.modal?.getAttribute("aria-hidden") !== "false") {
      document.body.style.overflow = "";
    }
  }

  function setupMenuOverlay() {
    ui.menuToggle?.addEventListener("click", () => {
      const isOpen = ui.menuOverlay?.getAttribute("aria-hidden") === "false";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    ui.menuClose?.addEventListener("click", closeMenu);

    ui.overlayLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    ui.menuOverlay?.addEventListener("click", (event) => {
      if (event.target === ui.menuOverlay) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && ui.menuOverlay?.getAttribute("aria-hidden") === "false") {
        closeMenu();
      }
    });
  }

  function setupRevealAnimation() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealItems.forEach((item) => observer.observe(item));
  }

  function createSpecsLine(specs) {
    if (!specs) return "";
    const labels = [];
    if (specs.engine) labels.push(specs.engine);
    if (specs.power) labels.push(specs.power);
    if (labels.length < 2 && specs.transmission) labels.push(specs.transmission);
    return labels.map((item) => `<span>${item}</span>`).join("");
  }

  function formatCount(value) {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) return `${value} модель`;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return `${value} модели`;
    return `${value} моделей`;
  }

  function renderGrid() {
    if (!ui.grid) return;

    if (!filteredModels.length) {
      ui.grid.innerHTML = "";
      if (ui.emptyState) ui.emptyState.hidden = false;
      if (ui.resultCount) ui.resultCount.textContent = "0 моделей";
      return;
    }

    if (ui.emptyState) ui.emptyState.hidden = true;

    ui.grid.innerHTML = filteredModels.map((model) => {
      const frontImage = model.images.find((fileName) => fileName.toLowerCase().includes("front")) || model.images[0] || "";
      const engineLabel = model.specs?.engine || "Проверено";
      const parts = String(model.name || "").trim().split(/\s+/);
      const brand = parts[0] || model.name;
      const series = parts.slice(1).join(" ");
      const yearMap = {
        "bmw-m1000": "2026",
        "bmw-r": "2024",
        diavel: "2025",
        "diavel-bantley": "2026",
        "diavel-lamborgini": "2026"
      };
      const modelYear = model.year || yearMap[model.id] || "2025";

      return `
        <article class="moto-card" data-model="${model.id}" tabindex="0" role="button" aria-label="Открыть галерею ${model.name}">
          <div class="card-media">
            <img src="${model.folder}/${frontImage}" alt="${model.name} preview">
            <span class="stock-badge">В наличии</span>
          </div>
          <div class="card-body">
            <div class="card-head">
              <h4 class="model-name"><span class="model-brand">${brand}</span>${series ? ` <span class="model-series">${series}</span>` : ""}</h4>
            </div>
            <p class="model-desc">${model.desc}</p>
            <div class="model-specs model-tags">${createSpecsLine(model.specs)}</div>
            <div class="card-meta-row">
              <div class="meta-item"><span>Год выпуска</span><strong>${modelYear}</strong></div>
              <div class="meta-item"><span>Цена</span><strong>${model.price}</strong></div>
            </div>
            <div class="card-actions">
              <div class="engine-note">${engineLabel}</div>
              <button class="btn btn-primary view-btn card-arrow" data-model="${model.id}" aria-label="Открыть ${model.name}">↗</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    if (ui.resultCount) {
      ui.resultCount.textContent = formatCount(filteredModels.length);
    }
  }

  function applyFilters() {
    const term = String(ui.searchInput?.value || "").trim().toLowerCase();
    const sortMode = ui.sortSelect?.value || "default";

    filteredModels = allModels
      .filter((model) => {
        if (!term) return true;
        const text = `${model.name} ${model.desc} ${model.specs?.engine || ""} ${model.specs?.power || ""}`.toLowerCase();
        return text.includes(term);
      })
      .slice();

    if (sortMode === "price-asc") {
      filteredModels.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    if (sortMode === "price-desc") {
      filteredModels.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    renderGrid();
  }

  function closeModal() {
    if (!ui.modal) return;
    ui.modal.setAttribute("aria-hidden", "true");
    modalState = { model: null, index: 0 };
    if (ui.menuOverlay?.getAttribute("aria-hidden") !== "false") {
      document.body.style.overflow = "";
    }
  }

  function updateModal() {
    const { model, index } = modalState;
    if (!model || !ui.modalImage || !ui.modalName || !ui.modalDesc || !ui.modalPrice || !ui.modalInfo) return;

    const imageName = model.images[index];
    ui.modalImage.src = `${model.folder}/${imageName}`;
    ui.modalImage.alt = `${model.name} image ${index + 1}`;
    ui.modalName.textContent = model.name;
    ui.modalDesc.textContent = model.desc;
    ui.modalPrice.textContent = model.price;

    if (ui.modalShowMore) {
      ui.modalShowMore.href = `${model.folder}/index.html`;
      ui.modalShowMore.setAttribute("aria-label", `Открыть детали ${model.name}`);
    }

    const oldSpecs = ui.modalInfo.querySelector(".modal-specs");
    if (oldSpecs) oldSpecs.remove();

    if (model.specs && typeof model.specs === "object") {
      const map = {
        engine: "Двигатель",
        power: "Мощность",
        seats: "Места",
        transmission: "Коробка",
        mileage: "Пробег"
      };
      const order = ["engine", "power", "seats", "transmission", "mileage"];
      const dl = document.createElement("dl");
      dl.className = "modal-specs";
      order.forEach((key) => {
        if (model.specs[key] === undefined) return;
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = map[key] || key;
        dd.textContent = model.specs[key];
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      ui.modalInfo.appendChild(dl);
    }
  }

  function openModal(modelId, startIndex = 0) {
    const model = allModels.find((item) => item.id === modelId);
    if (!model || !ui.modal) return;

    modalState = {
      model,
      index: Math.max(0, Math.min(startIndex, model.images.length - 1))
    };

    updateModal();
    ui.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function showNext() {
    if (!modalState.model) return;
    modalState.index = (modalState.index + 1) % modalState.model.images.length;
    updateModal();
  }

  function showPrev() {
    if (!modalState.model) return;
    modalState.index = (modalState.index - 1 + modalState.model.images.length) % modalState.model.images.length;
    updateModal();
  }

  function setupInventoryEvents() {
    if (!ui.grid) return;

    ui.searchInput?.addEventListener("input", applyFilters);
    ui.sortSelect?.addEventListener("change", applyFilters);

    ui.grid.addEventListener("click", (event) => {
      const triggerButton = event.target.closest(".view-btn");
      if (triggerButton) {
        openModal(triggerButton.dataset.model || "");
        return;
      }

      const card = event.target.closest(".moto-card");
      if (card?.dataset.model) {
        openModal(card.dataset.model);
      }
    });

    ui.grid.addEventListener("keydown", (event) => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      const card = event.target.closest(".moto-card");
      if (!card || !card.dataset.model) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card.dataset.model);
      }
    });

    ui.closeBtn?.addEventListener("click", closeModal);
    ui.nextBtn?.addEventListener("click", showNext);
    ui.prevBtn?.addEventListener("click", showPrev);

    ui.modal?.addEventListener("click", (event) => {
      if (event.target === ui.modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (ui.modal?.getAttribute("aria-hidden") !== "false") return;
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    });
  }

  function loadModels() {
    fetch("data/models.json")
      .then((response) => {
        if (!response.ok) throw new Error("Cannot load models.json");
        return response.json();
      })
      .then((models) => {
        allModels = Array.isArray(models) ? models : fallbackModels;
      })
      .catch(() => {
        allModels = fallbackModels;
      })
      .finally(() => {
        filteredModels = allModels.slice();
        applyFilters();
      });
  }

  setupMenuOverlay();
  setupRevealAnimation();
  setupInventoryEvents();
  loadModels();
})();
