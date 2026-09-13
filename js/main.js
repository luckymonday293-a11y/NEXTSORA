/* =============================================================
   NEXORA — main.js
   Shared utilities and site-wide behaviour used on every page: the
   navbar (mobile menu + search toggle), the cart badge, toast
   notifications, the scroll-to-top button, and small helpers
   (price/star formatting, cart read/write) that products.js,
   cart.js and checkout.js all rely on.
   ============================================================= */

// Delivery is a flat fee applied whenever the cart has at least one item
const DELIVERY_FEE = 5000;

/* ---------- Local Storage: cart ---------- */

// The cart is stored as a simple array of { id, qty } so product details
// (name, price, image...) are never duplicated in storage — cart.js and
// checkout.js always look the full product up in the PRODUCTS list
function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    // If the stored value is ever corrupted, fail safe with an empty cart
    // instead of breaking the whole page
    console.error("Could not read cart from storage:", err);
    return [];
  }
}

function saveCart(cart) {
  // Save the cart so users don't lose their items
  // when navigating between pages
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    // Product is already in the cart — just increase the quantity
    // instead of creating a duplicate line
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

function updateCartItemQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  if (qty < 1) {
    // Quantity dropped to zero — treat that the same as removing the item
    removeFromCart(productId);
    return;
  }

  item.qty = qty;
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.qty, 0);
}

// Every page shows how many items are in the cart on the navbar icon,
// so the badge needs to refresh on load and after every cart change
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
    el.classList.toggle("cart-count--visible", count > 0);
  });
}

/* ---------- Formatting helpers ---------- */

// Format a number as Naira with comma separators, e.g. 1250000 -> "₦1,250,000".
// A manual regex is used instead of toLocaleString so grouping looks
// identical across every browser regardless of locale support
function formatPrice(amount) {
  const rounded = Math.round(amount);
  return "₦" + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Build a readable star rating (e.g. "★★★★★ 4.8") with an aria-label
// so screen readers announce the numeric rating properly
function renderStars(rating) {
  const filled = Math.round(rating);
  const empty = 5 - filled;
  return (
    `<span class="stars" aria-hidden="true">${"★".repeat(filled)}${"☆".repeat(empty)}</span>` +
    `<span class="rating-value">${rating.toFixed(1)}</span>` +
    `<span class="visually-hidden">Rated ${rating.toFixed(1)} out of 5</span>`
  );
}

/* ---------- Toast notifications ---------- */

// A small, professional stand-in for browser alert() — used to confirm
// actions like adding to cart, subscribing, or flagging a form error
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger the entrance transition on the next frame so it actually animates
  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  // Auto-dismiss, then remove the element once its exit transition ends
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2600);
}

/* ---------- Navbar: mobile menu + search toggle ---------- */

function setNavbarActiveLink(link) {
  const navLinks = Array.from(document.querySelectorAll(".navbar__link"));
  navLinks.forEach((item) => {
    if (item === link) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function updateNavbarFromRouteAndHash() {
  const navLinks = Array.from(document.querySelectorAll(".navbar__link"));
  if (!navLinks.length) return;

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const hash = (window.location.hash || "").replace("#", "");

  let activeLink = navLinks.find((link) => {
    const href = new URL(link.href, window.location.href);
    return href.pathname.toLowerCase().endsWith(page) && !href.hash;
  });

  if (hash === "categories") {
    activeLink = navLinks.find((link) => link.getAttribute("href") === "index.html#categories");
  } else if (hash === "why-choose") {
    activeLink = navLinks.find((link) => link.getAttribute("href") === "index.html#why-choose");
  } else if (page === "products.html" || page === "product.html") {
    activeLink = navLinks.find((link) => link.getAttribute("href") === "products.html");
  } else if (page === "cart.html") {
    activeLink = navLinks.find((link) => link.getAttribute("href") === "index.html");
  } else if (page === "checkout.html" || page === "success.html") {
    activeLink = navLinks.find((link) => link.getAttribute("href") === "index.html");
  } else {
    activeLink = navLinks.find((link) => link.getAttribute("href") === "index.html");
  }

  if (activeLink) {
    setNavbarActiveLink(activeLink);
  }
}

function updateNavbarFromScroll() {
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page !== "index.html") return;

  const navLinks = Array.from(document.querySelectorAll(".navbar__link"));
  const categories = document.getElementById("categories");
  const about = document.getElementById("why-choose");
  if (!categories || !about || !navLinks.length) return;

  const categoriesLink = navLinks.find((link) => link.getAttribute("href") === "index.html#categories");
  const aboutLink = navLinks.find((link) => link.getAttribute("href") === "index.html#why-choose");
  const homeLink = navLinks.find((link) => link.getAttribute("href") === "index.html");

  const scrollY = window.scrollY || window.pageYOffset;
  const categoryTop = categories.getBoundingClientRect().top + scrollY;
  const aboutTop = about.getBoundingClientRect().top + scrollY;

  if (scrollY >= categoryTop && scrollY < aboutTop) {
    if (categoriesLink) setNavbarActiveLink(categoriesLink);
  } else if (scrollY >= aboutTop) {
    if (aboutLink) setNavbarActiveLink(aboutLink);
  } else if (homeLink) {
    setNavbarActiveLink(homeLink);
  }
}

function initNavbar() {
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      hamburger.classList.toggle("hamburger--active", !isOpen);

      if (!isOpen) {
        // Remove [hidden] first, then add the open class on the next
        // frame so the slide-in transition actually has something to animate from
        mobileMenu.hidden = false;
        requestAnimationFrame(() => mobileMenu.classList.add("mobile-menu--open"));
      } else {
        mobileMenu.classList.remove("mobile-menu--open");
        setTimeout(() => { mobileMenu.hidden = true; }, 200);
      }

      document.body.classList.toggle("no-scroll", !isOpen);
    });

    // Close the mobile menu when clicking outside of it
    document.addEventListener("click", (e) => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      const clickedInsideMenu = mobileMenu.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);

      if (isOpen && !clickedInsideMenu && !clickedHamburger) {
        // Clicked outside the menu and hamburger button
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("hamburger--active");
        mobileMenu.classList.remove("mobile-menu--open");
        document.body.classList.remove("no-scroll");
        setTimeout(() => { mobileMenu.hidden = true; }, 200);
      }
    });

    // Close the mobile menu whenever a link inside it is used
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("hamburger--active");
        mobileMenu.classList.remove("mobile-menu--open");
        document.body.classList.remove("no-scroll");
        setTimeout(() => { mobileMenu.hidden = true; }, 200);
      });
    });
  }

  const searchToggle = document.getElementById("searchToggle");
  const navbarSearch = document.getElementById("navbarSearch");

  if (searchToggle && navbarSearch) {
    searchToggle.addEventListener("click", () => {
      const isOpen = searchToggle.getAttribute("aria-expanded") === "true";
      searchToggle.setAttribute("aria-expanded", String(!isOpen));
      navbarSearch.hidden = isOpen;
      if (!isOpen) {
        const input = document.getElementById("navbarSearchInput");
        if (input) input.focus();
      }
    });
  }

  const navLinks = Array.from(document.querySelectorAll(".navbar__link"));
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = new URL(link.href, window.location.href);
      const hash = (href.hash || "").replace("#", "");

      if (hash === "categories") {
        setNavbarActiveLink(link);
      } else if (hash === "why-choose") {
        setNavbarActiveLink(link);
      } else if (href.pathname.toLowerCase().endsWith("products.html") || href.pathname.toLowerCase().endsWith("product.html")) {
        setNavbarActiveLink(link);
      } else if (href.pathname.toLowerCase().endsWith("index.html") || href.pathname === "/" || href.pathname === "") {
        setNavbarActiveLink(link);
      }
    });
  });

  const searchForm = document.getElementById("navbarSearchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("navbarSearchInput").value.trim();
      // Send the search term to the shop page via a query string so the
      // grid can filter itself as soon as it loads
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    });
  }

  updateNavbarFromRouteAndHash();
  updateNavbarFromScroll();
  window.addEventListener("scroll", updateNavbarFromScroll, { passive: true });
}

/* ---------- Scroll to top button ---------- */

function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.hidden = window.scrollY < 400;
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Newsletter form (home page) ---------- */

// Custom validation replaces the browser's native "fill out this field" /
// "include an '@'" popups (the form ships with novalidate) — errors are
// shown inline, in the same visual language as the checkout form
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  const input = document.getElementById("newsletterEmail");
  const errorEl = document.getElementById("newsletterEmailError");

  function validateNewsletterEmail() {
    const email = input.value.trim();
    if (!email) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    return "";
  }

  input.addEventListener("blur", () => {
    const error = validateNewsletterEmail();
    errorEl.textContent = error;
    input.setAttribute("aria-invalid", error ? "true" : "false");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const error = validateNewsletterEmail();

    if (error) {
      errorEl.textContent = error;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }

    errorEl.textContent = "";
    input.setAttribute("aria-invalid", "false");
    showToast("✓ Thanks for subscribing to NEXORA!");
    form.reset();
  });
}

/* ---------- Run shared setup on every page ---------- */

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initNavbar();
  initScrollTop();
  initNewsletter();
});
