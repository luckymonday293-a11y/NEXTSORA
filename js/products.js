/* =============================================================
   NEXORA — products.js
   The product catalog (kept in memory as a plain array, standing in
   for a database) plus everything needed to render product cards on
   the home page, the full shop grid, and a single product's detail
   page. cart.js and checkout.js also read PRODUCTS to resolve cart
   entries into full product details.
   ============================================================= */

const CATEGORIES = [
  { slug: "smartphones", label: "Smartphones" },
  { slug: "laptops", label: "Laptops" },
  { slug: "audio", label: "Audio" },
  { slug: "wearables", label: "Wearables" },
  { slug: "gaming", label: "Gaming" },
  { slug: "accessories", label: "Accessories" },
];

// Every product the store sells, kept in one array so search, filtering,
// sorting and the detail page can all work off a single source of truth
const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    category: "smartphones",
    price: 1250000,
    rating: 4.8,
    featured: true,
    newArrival: false,
    description: "The iPhone 16 Pro pairs a titanium design with the A18 Pro chip for pro-level performance, an advanced camera system, and all-day battery life.",
    specifications: {
      Display: "6.3\" Super Retina XDR",
      Chip: "A18 Pro",
      Storage: "256GB",
      Camera: "48MP Triple Camera System",
      Battery: "Up to 27 hours video playback",
      Color: "Titanium Black",
    },
    image: "images/products/iphone.jpeg",
  },
  {
    id: 2,
    name: "Samsung Galaxy S25",
    category: "smartphones",
    price: 1100000,
    rating: 4.6,
    featured: false,
    newArrival: true,
    description: "Galaxy S25 brings a bright Dynamic AMOLED display, a versatile triple-lens camera, and Galaxy AI features built in for a smarter everyday phone.",
    specifications: {
      Display: "6.2\" Dynamic AMOLED 2X",
      Chip: "Snapdragon 8 Elite",
      Storage: "256GB",
      Camera: "50MP Triple Camera System",
      Battery: "4000mAh, 25W Fast Charging",
      Color: "Phantom Black",
    },
    image: "images/products/samsung.jpeg",
  },
  {
    id: 3,
    name: "MacBook Air",
    category: "laptops",
    price: 1850000,
    rating: 4.9,
    featured: true,
    newArrival: false,
    description: "Strikingly thin and fast, the MacBook Air with the M3 chip handles everything from everyday tasks to demanding creative work without breaking a sweat.",
    specifications: {
      Display: "13.6\" Liquid Retina",
      Chip: "Apple M3, 8-core CPU",
      Memory: "8GB Unified Memory",
      Storage: "256GB SSD",
      Battery: "Up to 18 hours",
      Color: "Midnight",
    },
    image: "images/products/macbook.jpeg",
  },
  {
    id: 4,
    name: "ASUS Zenbook",
    category: "laptops",
    price: 1450000,
    rating: 4.5,
    featured: false,
    newArrival: true,
    description: "A slim, powerful Windows ultrabook with a vivid OLED display and long battery life — built for productivity on the move.",
    specifications: {
      Display: "14\" 2.8K OLED",
      Processor: "Intel Core Ultra 7",
      Memory: "16GB RAM",
      Storage: "512GB SSD",
      Battery: "Up to 15 hours",
      Color: "Ponder Blue",
    },
    image: "images/products/asus.jpeg",
  },
  {
    id: 5,
    name: "AirPods Pro",
    category: "audio",
    price: 185000,
    rating: 4.7,
    featured: true,
    newArrival: false,
    description: "Active Noise Cancellation, Adaptive Transparency, and a comfortable new fit make AirPods Pro an easy everyday upgrade.",
    specifications: {
      Type: "In-ear, wireless",
      "Noise Control": "Active Noise Cancellation",
      Battery: "Up to 6 hours per charge",
      Case: "MagSafe Charging Case",
      "Water Resistance": "IP54",
    },
    image: "images/products/airpord.png",
  },
  {
    id: 6,
    name: "Sony WH-1000XM5",
    category: "audio",
    price: 295000,
    rating: 4.8,
    featured: false,
    newArrival: true,
    description: "Industry-leading noise cancellation meets rich, detailed sound — built for long listening sessions and quiet focus.",
    specifications: {
      Type: "Over-ear, wireless",
      "Noise Control": "Dual Noise Sensor Technology",
      Battery: "Up to 30 hours",
      Charging: "USB-C, Quick Charge",
      Weight: "250g",
    },
    image: "images/products/headphone.png",
  },
  {
    id: 7,
    name: "Apple Watch",
    category: "wearables",
    price: 450000,
    rating: 4.7,
    featured: true,
    newArrival: false,
    description: "Track workouts, monitor your health, and stay connected right from your wrist with a bright always-on display.",
    specifications: {
      Display: "45mm Always-On Retina",
      "Health Sensors": "Heart Rate, Blood Oxygen, ECG",
      Battery: "Up to 18 hours",
      "Water Resistance": "50 meters",
      Connectivity: "GPS + Cellular",
    },
    image: "images/products/smartwatch.png",
  },
  {
    id: 8,
    name: "Galaxy Watch",
    category: "wearables",
    price: 320000,
    rating: 4.4,
    featured: false,
    newArrival: true,
    description: "A sleek fitness and health companion with detailed sleep tracking, workout detection, and days of battery life.",
    specifications: {
      Display: "1.5\" Super AMOLED",
      "Health Sensors": "BioActive Sensor, Sleep Tracking",
      Battery: "Up to 40 hours",
      "Water Resistance": "5 ATM + IP68",
      Connectivity: "Bluetooth / LTE",
    },
    image: "images/products/galaxywatch.png",
  },
  {
    id: 9,
    name: "PS5 Controller",
    category: "gaming",
    price: 65000,
    rating: 4.6,
    featured: true,
    newArrival: false,
    description: "The DualSense wireless controller brings haptic feedback and adaptive triggers for a deeply immersive gaming feel.",
    specifications: {
      Compatibility: "PlayStation 5",
      Connectivity: "Bluetooth / USB-C",
      Battery: "Up to 12 hours",
      Features: "Haptic Feedback, Adaptive Triggers",
      Color: "White",
    },
    image: "images/products/game.jpeg",
  },
  {
    id: 10,
    name: "Xbox Controller",
    category: "gaming",
    price: 58000,
    rating: 4.5,
    featured: false,
    newArrival: true,
    description: "A refined shape and textured grip make this wireless controller comfortable for marathon gaming sessions.",
    specifications: {
      Compatibility: "Xbox Series X|S, PC",
      Connectivity: "Bluetooth / USB-C",
      Battery: "Up to 40 hours (AA)",
      Features: "Hybrid D-Pad, Textured Grip",
      Color: "Carbon Black",
    },
    image: "images/products/gaming.jpeg",
  },
  {
    id: 11,
    name: "Anker PowerBank",
    category: "accessories",
    price: 25000,
    rating: 4.6,
    featured: true,
    newArrival: false,
    description: "A compact, high-capacity power bank that charges phones, earbuds, and more — perfect for travel and everyday backup power.",
    specifications: {
      Capacity: "20,000mAh",
      Output: "22.5W Fast Charging",
      Ports: "USB-C, USB-A x2",
      Weight: "356g",
      Includes: "USB-C Cable",
    },
    image: "images/products/powerbank.jpeg",
  },
  {
    id: 12,
    name: "Logitech Mouse",
    category: "accessories",
    price: 18500,
    rating: 4.5,
    featured: false,
    newArrival: true,
    description: "A quiet, precise wireless mouse designed for all-day comfort, whether you're working or browsing.",
    specifications: {
      Connectivity: "Bluetooth / USB Receiver",
      Sensor: "4000 DPI Optical",
      Battery: "Up to 24 months",
      Buttons: "Silent Click",
      Compatibility: "Windows, macOS, ChromeOS",
    },
    image: "images/products/mouse.jpeg",
  },
  
];

/* ---------- Lookup helpers ---------- */

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getCategoryLabel(slug) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  return category ? category.label : slug;
}

/* ---------- Image placeholder system ----------
   No real product photos exist yet (per the brief, none are generated
   or downloaded), so every image container needs to look intentional
   on its own: a soft gradient plus a category-matched line icon. The
   moment a real file is dropped into /images with a matching name,
   the <img>'s onload swaps it in automatically — no markup changes
   needed later. This icon set is also reused by the category cards. */
function getCategoryIcon(slug) {
  const icons = {
    smartphones: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" stroke-width="1.6"/><line x1="11" y1="18" x2="13" y2="18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    laptops: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    audio: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="2" y="14" width="4.5" height="6" rx="1.8" stroke="currentColor" stroke-width="1.6"/><rect x="17.5" y="14" width="4.5" height="6" rx="1.8" stroke="currentColor" stroke-width="1.6"/></svg>',
    wearables: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="7" width="8" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9.5 7V4h5v3M9.5 17v3h5v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    gaming: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 8h10a5 5 0 0 1 5 5v2a3 3 0 0 1-5.2 2.06L15.2 15H8.8L7 17.06A3 3 0 0 1 2 15v-2a5 5 0 0 1 5-5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="11" r="0.8" fill="currentColor"/><circle cx="18" cy="13" r="0.8" fill="currentColor"/><line x1="6" y1="11" x2="6" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="5" y1="12" x2="7" y2="12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    accessories: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 2v4M15 2v4M7 8h10v4a5 5 0 0 1-10 0V8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  };
  return icons[slug] || icons.accessories;
}

// Builds a self-upgrading image container: a gradient + icon placeholder
// shows immediately, and the real photo (once one exists on disk) fades
// in over it via the onload handler. onerror just leaves the elegant
// placeholder in place instead of the browser's broken-image icon.
function productMediaHTML(product, extraClass = "") {
  return `
    <div class="media ${extraClass}">
      <span class="media__placeholder">${getCategoryIcon(product.category)}</span>
      <img src="${product.image}" alt="${product.name}" loading="lazy"
           onload="this.style.display='block'; this.previousElementSibling.style.opacity='0';"
           onerror="this.remove();">
    </div>
  `;
}

/* ---------- Card rendering (shared by home + shop grid) ---------- */

// Builds the markup for one product card. Used on the home page
// (Featured / New Arrivals) and on the full shop grid, so it lives in
// one place rather than being duplicated across render functions
function createProductCard(product) {
  return `
    <article class="product-card">
      <a href="product.html?id=${product.id}" class="product-card__image-link" tabindex="-1">
        <div class="product-card__image">
          ${productMediaHTML(product)}
        </div>
      </a>
      <div class="product-card__body">
        <p class="product-card__category">${getCategoryLabel(product.category)}</p>
        <h3 class="product-card__name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card__rating">${renderStars(product.rating)}</div>
        <p class="product-card__price">${formatPrice(product.price)}</p>
        <div class="product-card__actions">
          <button class="btn btn--primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
          <a href="product.html?id=${product.id}" class="product-card__view-link">View Details</a>
        </div>
      </div>
    </article>
  `;
}

// Wires up every "Add to Cart" button inside a container. This needs to
// be re-run after re-rendering a grid, since the old buttons (and their
// listeners) were replaced by brand-new DOM nodes
function bindAddToCartButtons(container) {
  container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      addToCart(id, 1);
      const product = getProductById(id);
      showToast(`✓ ${product.name} added to cart`);
    });
  });
}

/* ---------- Home page: Featured + New Arrivals ---------- */

function renderHomeProductSections() {
  const featuredGrid = document.getElementById("featuredGrid");
  const newArrivalsGrid = document.getElementById("newArrivalsGrid");

  if (featuredGrid) {
    const featured = PRODUCTS.filter((p) => p.featured);
    featuredGrid.innerHTML = featured.map(createProductCard).join("");
    bindAddToCartButtons(featuredGrid);
  }

  if (newArrivalsGrid) {
    const newArrivals = PRODUCTS.filter((p) => p.newArrival);
    newArrivalsGrid.innerHTML = newArrivals.map(createProductCard).join("");
    bindAddToCartButtons(newArrivalsGrid);
  }
}

/* ---------- Shop page: search, category filter, sort ---------- */

function initShopPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return; // Not on the shop page — nothing to do

  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".filter-pill");
  const sortSelect = document.getElementById("sortSelect");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");

  // Read any filters passed in via the URL (e.g. a category card on the
  // home page, or a search submitted from the navbar) so the shop page
  // opens already filtered instead of making the user redo it
  const params = new URLSearchParams(window.location.search);
  const state = {
    search: params.get("search") || "",
    category: params.get("category") || "all",
    sort: "featured",
  };

  if (searchInput) searchInput.value = state.search;

  function setActiveCategoryButton() {
    categoryButtons.forEach((btn) => {
      btn.classList.toggle("filter-pill--active", btn.dataset.category === state.category);
    });
  }

  // Applies the current search + category + sort state to PRODUCTS and
  // re-renders the grid. Runs whenever any one of those three changes
  function renderGrid() {
    let results = PRODUCTS.filter((product) => {
      const matchesCategory = state.category === "all" || product.category === state.category;
      const matchesSearch = product.name.toLowerCase().includes(state.search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sorting works on the filtered copy only — PRODUCTS itself is never reordered
    switch (state.sort) {
      case "price-low":
        results = results.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results = results.slice().sort((a, b) => b.price - a.price);
        break;
      case "a-z":
        results = results.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // "Featured" keeps the catalog's natural order
        break;
    }

    if (results.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      grid.innerHTML = results.map(createProductCard).join("");
      bindAddToCartButtons(grid);
    }

    if (resultsCount) {
      resultsCount.textContent = `${results.length} product${results.length === 1 ? "" : "s"}`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderGrid();
    });
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      setActiveCategoryButton();
      renderGrid();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderGrid();
    });
  }

  setActiveCategoryButton();
  renderGrid();
}

/* ---------- Product detail page ---------- */

function initProductDetailPage() {
  const detailContainer = document.getElementById("productDetail");
  if (!detailContainer) return; // Not on the product detail page

  // The product to display is chosen entirely by the "id" in the URL —
  // e.g. product.html?id=3 — which is what lets one HTML file serve all 12 products
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));
  const product = getProductById(productId);
  const notFoundState = document.getElementById("productNotFound");

  if (!product) {
    detailContainer.hidden = true;
    notFoundState.hidden = false;
    document.title = "Product Not Found — NEXORA";
    return;
  }

  document.title = `${product.name} — NEXORA`;

  const breadcrumbCategory = document.getElementById("breadcrumbCategory");
  breadcrumbCategory.textContent = getCategoryLabel(product.category);
  breadcrumbCategory.href = `products.html?category=${product.category}`;
  document.getElementById("breadcrumbName").textContent = product.name;

  // Same self-upgrading placeholder pattern as the cards: show a
  // category icon immediately, then swap to the real photo if/when one
  // actually loads from disk (onerror just leaves the placeholder up)
  const productImage = document.getElementById("productImage");
  document.getElementById("productImagePlaceholder").innerHTML = getCategoryIcon(product.category);
  productImage.addEventListener("load", () => {
    productImage.style.display = "block";
    document.getElementById("productImagePlaceholder").style.opacity = "0";
  });
  productImage.addEventListener("error", () => productImage.remove());
  productImage.src = product.image;
  productImage.alt = product.name;

  document.getElementById("productCategory").textContent = getCategoryLabel(product.category);
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productRating").innerHTML = renderStars(product.rating);
  document.getElementById("productPrice").textContent = formatPrice(product.price);
  document.getElementById("productDescription").textContent = product.description;

  // Specifications are stored as a plain object on the product, so they
  // map directly onto an accessible <dl> without any extra data shaping
  const specsList = document.getElementById("specsList");
  specsList.innerHTML = Object.entries(product.specifications)
    .map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`)
    .join("");

  // Quantity selector, kept simple with a hard floor of 1
  const qtyInput = document.getElementById("qtyInput");
  document.getElementById("qtyDecrease").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById("qtyIncrease").addEventListener("click", () => {
    qtyInput.value = Number(qtyInput.value) + 1;
  });
  qtyInput.addEventListener("change", () => {
    if (!qtyInput.value || Number(qtyInput.value) < 1) qtyInput.value = 1;
  });

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product.id, Number(qtyInput.value));
    showToast(`✓ ${product.name} added to cart`);
  });
}

/* ---------- Run on load ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderHomeProductSections();
  initShopPage();
  initProductDetailPage();
});
