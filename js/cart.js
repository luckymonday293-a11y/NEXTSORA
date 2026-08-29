/* =============================================================
   NEXORA — cart.js
   Renders the cart page: line items with quantity controls and a
   remove action, the order summary totals, and the empty-cart
   state. Reads cart contents from Local Storage and resolves each
   entry against the PRODUCTS catalog defined in products.js.
   ============================================================= */

function renderCartPage() {
  const itemsContainer = document.getElementById("cartItems");
  if (!itemsContainer) return; // Not on the cart page

  const emptyState = document.getElementById("cartEmpty");
  const cartContent = document.getElementById("cartContent");
  const cart = getCart();

  if (cart.length === 0) {
    cartContent.hidden = true;
    emptyState.hidden = false;
    return;
  }

  cartContent.hidden = false;
  emptyState.hidden = true;

  // Cross-reference each stored { id, qty } entry with the full product
  // record so the row can show its name, image, and current price
  const lineItems = cart
    .map((entry) => {
      const product = getProductById(entry.id);
      if (!product) return null; // Guards against a stale id no longer in the catalog
      return { ...product, qty: entry.qty, lineTotal: product.price * entry.qty };
    })
    .filter(Boolean);

  itemsContainer.innerHTML = lineItems
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__image">
          ${productMediaHTML(item)}
        </div>
        <div class="cart-item__details">
          <p class="cart-item__category">${getCategoryLabel(item.category)}</p>
          <h3 class="cart-item__name">${item.name}</h3>
          <p class="cart-item__price">${formatPrice(item.price)} each</p>
        </div>
        <div class="cart-item__qty">
          <button class="qty-btn cart-qty-decrease" aria-label="Decrease quantity of ${item.name}" data-id="${item.id}">−</button>
          <span class="qty-value" aria-live="polite">${item.qty}</span>
          <button class="qty-btn cart-qty-increase" aria-label="Increase quantity of ${item.name}" data-id="${item.id}">+</button>
        </div>
        <p class="cart-item__line-total">${formatPrice(item.lineTotal)}</p>
        <button class="cart-item__remove" aria-label="Remove ${item.name} from cart" data-id="${item.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `
    )
    .join("");

  renderCartSummary(lineItems);
  bindCartItemEvents();
}

// Subtotal / delivery fee / total — the same shape is used by both the
// cart page summary and the checkout page order summary
function calculateTotals(lineItems) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = lineItems.length > 0 ? DELIVERY_FEE : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

function renderCartSummary(lineItems) {
  const { subtotal, deliveryFee, total } = calculateTotals(lineItems);
  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("cartDelivery").textContent = formatPrice(deliveryFee);
  document.getElementById("cartTotal").textContent = formatPrice(total);
}

function bindCartItemEvents() {
  // Quantity buttons read the CURRENT cart fresh each time rather than
  // trusting a closure, since the cart can change from several buttons
  document.querySelectorAll(".cart-qty-decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = getCart().find((i) => i.id === id);
      if (item) updateCartItemQty(id, item.qty - 1);
      renderCartPage();
    });
  });

  document.querySelectorAll(".cart-qty-increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = getCart().find((i) => i.id === id);
      if (item) updateCartItemQty(id, item.qty + 1);
      renderCartPage();
    });
  });

  document.querySelectorAll(".cart-item__remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = getProductById(id);
      removeFromCart(id);
      showToast(`Removed ${product ? product.name : "item"} from cart`, "info");
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCartPage);
