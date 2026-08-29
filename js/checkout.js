/* =============================================================
   NEXORA — checkout.js
   Handles the checkout page: rendering the order summary, validating
   the delivery form, and processing the order. Also renders the
   confirmation on the success page once an order has been placed.
   ============================================================= */

/* ---------- Checkout page: order summary ---------- */

function renderCheckoutSummary() {
  const summaryList = document.getElementById("checkoutItems");
  if (!summaryList) return null; // Not on the checkout page

  const cart = getCart();

  // Sending someone to checkout with an empty cart doesn't make sense —
  // send them back to the shop instead of showing a blank order form
  if (cart.length === 0) {
    window.location.href = "products.html";
    return null;
  }

  const lineItems = cart
    .map((entry) => {
      const product = getProductById(entry.id);
      if (!product) return null;
      return { ...product, qty: entry.qty, lineTotal: product.price * entry.qty };
    })
    .filter(Boolean);

  summaryList.innerHTML = lineItems
    .map(
      (item) => `
      <div class="summary-item">
        ${productMediaHTML(item, "summary-item__image")}
        <div class="summary-item__info">
          <p class="summary-item__name">${item.name}</p>
          <p class="summary-item__qty">Qty: ${item.qty}</p>
        </div>
        <p class="summary-item__price">${formatPrice(item.lineTotal)}</p>
      </div>
    `
    )
    .join("");

  const { subtotal, deliveryFee, total } = calculateTotals(lineItems);
  document.getElementById("checkoutSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("checkoutDelivery").textContent = formatPrice(deliveryFee);
  document.getElementById("checkoutTotal").textContent = formatPrice(total);

  return { lineItems, subtotal, deliveryFee, total };
}

// Simple, dependency-free validation for each checkout field. Returns an
// error message string, or an empty string when the field is valid —
// this lets the same function drive both blur checks and submit checks
function validateField(name, value) {
  const trimmed = value.trim();

  switch (name) {
    case "fullName":
      return trimmed.length < 2 ? "Please enter your full name." : "";
    case "email":
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? "Please enter a valid email address." : "";
    case "phone":
      return !/^[0-9+\s-]{7,15}$/.test(trimmed) ? "Please enter a valid phone number." : "";
    case "address":
      return trimmed.length < 5 ? "Please enter your delivery address." : "";
    case "city":
      return trimmed.length < 2 ? "Please enter your city." : "";
    default:
      return "";
  }
}

// Creates a short, readable order ID for display purposes,
// e.g. "NEX-48291376"
function generateOrderId() {
  return "NEX-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
}

function initCheckoutForm(orderTotals) {
  const form = document.getElementById("checkoutForm");
  if (!form || !orderTotals) return;

  const fields = ["fullName", "email", "phone", "address", "city"];

  function showFieldError(name, message) {
    const errorEl = document.getElementById(`${name}Error`);
    const inputEl = document.getElementById(name);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.setAttribute("aria-invalid", message ? "true" : "false");
  }

  // Validate as soon as the user leaves a field, so mistakes are caught
  // early instead of all appearing at once on submit
  fields.forEach((name) => {
    const input = document.getElementById(name);
    if (!input) return;
    input.addEventListener("blur", () => showFieldError(name, validateField(name, input.value)));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidField = null;

    fields.forEach((name) => {
      const input = document.getElementById(name);
      const error = validateField(name, input.value);
      showFieldError(name, error);
      if (error) {
        isValid = false;
        if (!firstInvalidField) firstInvalidField = input;
      }
    });

    if (!isValid) {
      showToast("Please fix the highlighted fields.", "error");
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    const submitBtn = document.getElementById("placeOrderBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    // Build the order now, before the cart is cleared, so nothing is
    // lost — this is what the success page reads back afterwards
    const order = {
      orderId: generateOrderId(),
      date: new Date().toISOString(),
      customer: {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
      },
      items: orderTotals.lineItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        category: item.category,
        qty: item.qty,
        price: item.price,
        lineTotal: item.lineTotal,
      })),
      subtotal: orderTotals.subtotal,
      deliveryFee: orderTotals.deliveryFee,
      total: orderTotals.total,
    };

    // Briefly simulate order processing so the loading state feels real,
    // then persist the order, empty the cart, and move to the confirmation page
    setTimeout(() => {
      localStorage.setItem("lastOrder", JSON.stringify(order));
      localStorage.removeItem("cart");
      window.location.href = "success.html";
    }, 1200);
  });
}

/* ---------- Success page ---------- */

function renderSuccessPage() {
  const container = document.getElementById("orderConfirmed");
  if (!container) return; // Not on the success page

  const noOrderState = document.getElementById("noOrderFound");
  const raw = localStorage.getItem("lastOrder");

  if (!raw) {
    // Someone landed here directly without placing an order
    container.hidden = true;
    noOrderState.hidden = false;
    return;
  }

  const order = JSON.parse(raw);

  container.hidden = false;
  noOrderState.hidden = true;

  document.getElementById("orderId").textContent = order.orderId;
  document.getElementById("orderCustomerName").textContent = order.customer.fullName;
  document.getElementById("orderAddress").textContent = `${order.customer.address}, ${order.customer.city}`;
  document.getElementById("orderEmail").textContent = order.customer.email;

  document.getElementById("orderItems").innerHTML = order.items
    .map(
      (item) => `
      <div class="summary-item">
        ${productMediaHTML(item, "summary-item__image")}
        <div class="summary-item__info">
          <p class="summary-item__name">${item.name}</p>
          <p class="summary-item__qty">Qty: ${item.qty}</p>
        </div>
        <p class="summary-item__price">${formatPrice(item.lineTotal)}</p>
      </div>
    `
    )
    .join("");

  document.getElementById("orderSubtotal").textContent = formatPrice(order.subtotal);
  document.getElementById("orderDelivery").textContent = formatPrice(order.deliveryFee);
  document.getElementById("orderTotal").textContent = formatPrice(order.total);
}

document.addEventListener("DOMContentLoaded", () => {
  const orderTotals = renderCheckoutSummary();
  initCheckoutForm(orderTotals);
  renderSuccessPage();
});
