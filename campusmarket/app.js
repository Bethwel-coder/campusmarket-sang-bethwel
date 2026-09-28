/**
 * CampusMarket \u2014 Unified Integration Script
 * Enhanced: expanded catalog, add-to-cart controls, sorting, toasts,
 * gallery autoplay + dots, live registration validation.
 */

// Master Product Dataset
const products = [
  { id: 1,  name: "Calculus: Early Transcendentals",       category: "books",     price: 2500, description: "Essential textbook for Year 1 Mathematics.",            image: "https://pictures.abebooks.com/isbn/9780618502981-us.jpg", alt: "Calculus textbook cover" },
  { id: 2,  name: "Scientific Calculator FX-991EX",         category: "tech",      price: 3200, description: "Approved for engineering and CS examinations.",         image: "https://i.ebayimg.com/images/g/dNsAAOSwk3VnMzLx/s-l1200.jpg", alt: "Casio ClassWiz FX-991EX scientific calculator" },
  { id: 3,  name: "Stainless Steel Water Flask",            category: "lifestyle", price: 1200, description: "1-liter insulated thermal flask.",                     image: "https://images.thdstatic.com/productImages/37d77f0f-e238-4184-9934-369656d5773a/svn/wudkey-travel-mugs-tumblers-yc7y87-3-64_600.jpg", alt: "Stainless steel insulated water flask" },
  { id: 4,  name: "Data Structures & Algorithms in C++",    category: "books",     price: 2800, description: "Core textbook for CCS 2315.",                          image: "https://m.media-amazon.com/images/I/61hH3KIEIRL._AC_UF1000,1000_QL80_.jpg", alt: "Data Structures and Algorithms in C++ book cover" },
  { id: 5,  name: "Wireless Ergonomic Mouse",               category: "tech",      price: 1800, description: "2.4GHz rechargeable wireless mouse.",                 image: "https://m.media-amazon.com/images/I/51TlYuAqbsL._AC_UF894,1000_QL80_.jpg", alt: "Wireless ergonomic computer mouse" },
  { id: 6,  name: "Organic Chemistry, 8th Edition",         category: "books",     price: 3000, description: "Comprehensive reference for CHE 2201.",              image: "https://m.media-amazon.com/images/I/61rYrfXdLKL._AC_UF1000,1000_QL80_.jpg", alt: "Organic Chemistry textbook cover" },
  { id: 7,  name: "Introduction to Psychology",             category: "books",     price: 2200, description: "Foundational reading for PSY 1101.",                  image: "https://m.media-amazon.com/images/I/91EkMmX6y6L._AC_UF1000,1000_QL80_.jpg", alt: "Introduction to Psychology textbook cover" },
  { id: 8,  name: "Financial Accounting Fundamentals",      category: "books",     price: 2600, description: "Practice-focused text for BCA 2102.",               image: "https://m.media-amazon.com/images/I/61v0vG3Sp0L._UF1000,1000_QL80_.jpg", alt: "Financial Accounting textbook cover" },
  { id: 9,  name: "Engineering Mechanics: Statics",         category: "books",     price: 2900, description: "Problem sets aligned with EME 2105.",               image: "https://m.media-amazon.com/images/I/81wDO0PXQVL._AC_UF1000,1000_QL80_.jpg", alt: "Engineering Mechanics: Statics textbook cover" },
  { id: 10, name: "USB-C 65W Fast Charger",                 category: "tech",      price: 2400, description: "GaN charger for laptops and phones.",                image: "https://www.gearit.com/cdn/shop/files/GI-GC65W-C2A1-BK.1.jpg?v=1788459088&width=1200", alt: "65W USB-C GaN fast charger" },
  { id: 11, name: "Noise-Cancelling Headphones",           category: "tech",      price: 4500, description: "Over-ear ANC headset for focused study.",           image: "https://m.media-amazon.com/images/I/71YM2N5whtL.jpg", alt: "Over-ear noise-cancelling headphones" },
  { id: 12, name: "16GB USB 3.0 Flash Drive",               category: "tech",      price: 900,  description: "Fast transfer drive for assignments.",              image: "https://www.sandisk.com/content/dam/store/en-us/assets/products/usb-flash-drives/ultra-usb-3-0/gallery/ultra-usb-3-0-front.png", alt: "SanDisk USB 3.0 flash drive" },
  { id: 13, name: "Laptop Cooling Pad",                     category: "tech",      price: 1600, description: "Dual-fan stand to keep your laptop cool.",          image: "https://m.media-amazon.com/images/I/71jY2GkOIJL.jpg", alt: "Dual-fan laptop cooling pad" },
  { id: 14, name: "1080p HD Webcam",                        category: "tech",      price: 3100, description: "Clip-on camera for online classes.",               image: "https://m.media-amazon.com/images/I/81-rvqTiJnL.jpg", alt: "1080p HD webcam" },
  { id: 15, name: "Adjustable Study Desk Lamp",             category: "lifestyle", price: 1500, description: "Dimmable LED lamp with USB port.",                 image: "https://m.media-amazon.com/images/I/71fJyc-FZ3L._AC_UF894,1000_QL80_.jpg", alt: "Dimmable LED desk lamp" },
  { id: 16, name: "Memory Foam Seat Cushion",               category: "lifestyle", price: 1900, description: "Ergonomic support for long study sessions.",       image: "https://m.media-amazon.com/images/I/71mnqkk5CRL._AC_UF894,1000_QL80_.jpg", alt: "Memory foam seat cushion" },
  { id: 17, name: "Compact Mini Fridge 4L",                 category: "lifestyle", price: 6500, description: "Portable dorm fridge for drinks and snacks.",       image: "https://www.honeywellstore.com/store/images/products/large_images/h16mrs-honeywell-mini-fridge-with-freezer-stainless-steel-1.jpg", alt: "Compact stainless steel mini fridge" }
];

const CATEGORY_LABELS = { books: "Textbooks", tech: "Electronics", lifestyle: "Lifestyle" };

// Persistent Cart State across pages
let cart = JSON.parse(localStorage.getItem("campusmarket_cart")) || {};
let filteredProducts = [...products];
let currentGalleryIndex = 0;
let galleryTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  ensureToastContainer();
  updateNavCartCount();

  if (document.getElementById("productsContainer")) {
    initCatalogPage();
  }
  if (document.getElementById("registrationForm")) {
    initRegistrationPage();
  }
  if (document.getElementById("cartTableBody")) {
    initCartPage();
  }
});

function saveCart() {
  localStorage.setItem("campusmarket_cart", JSON.stringify(cart));
  updateNavCartCount();
}

function cartItemCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function updateNavCartCount() {
  const badge = document.getElementById("navCartCount");
  if (!badge) return;
  const count = cartItemCount();
  badge.textContent = count;
  badge.classList.remove("bump");
  // restart animation
  void badge.offsetWidth;
  badge.classList.add("bump");
}

function formatKES(amount, withDecimals) {
  const opts = withDecimals ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {};
  return `KES ${amount.toLocaleString(undefined, opts)}`;
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */
function ensureToastContainer() {
  if (document.querySelector(".toast-container")) return;
  const container = document.createElement("div");
  container.className = "toast-container";
  container.setAttribute("aria-live", "polite");
  container.setAttribute("aria-atomic", "true");
  document.body.appendChild(container);
}

function showToast(message, type) {
  const container = document.querySelector(".toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type || "info"}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}
/* ==========================================================================
   Catalog Page & Gallery Controls
   ========================================================================== */
function initCatalogPage() {
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const sortSelect = document.getElementById("sortSelect");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  searchInput.addEventListener("input", filterAndRender);
  categorySelect.addEventListener("change", filterAndRender);
  if (sortSelect) sortSelect.addEventListener("change", filterAndRender);

  prevBtn.addEventListener("click", () => { navigateGallery(-1); restartGalleryAutoplay(); });
  nextBtn.addEventListener("click", () => { navigateGallery(1); restartGalleryAutoplay(); });

  // Keyboard navigation for the gallery
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { navigateGallery(-1); restartGalleryAutoplay(); }
    if (e.key === "ArrowRight") { navigateGallery(1); restartGalleryAutoplay(); }
  });

  // Pause autoplay while hovering the gallery
  const galleryContainer = document.querySelector(".gallery-container");
  if (galleryContainer) {
    galleryContainer.addEventListener("mouseenter", stopGalleryAutoplay);
    galleryContainer.addEventListener("mouseleave", startGalleryAutoplay);
  }

  filterAndRender();
  startGalleryAutoplay();
}

function filterAndRender() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const category = document.getElementById("categorySelect").value;
  const sortSelect = document.getElementById("sortSelect");
  const sortBy = sortSelect ? sortSelect.value : "featured";

  filteredProducts = products.filter(p => {
    const matchesCategory = (category === "all" || p.category === category);
    const matchesSearch = p.name.toLowerCase().includes(query) ||
                          p.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  switch (sortBy) {
    case "price-asc":  filteredProducts.sort((a, b) => a.price - b.price); break;
    case "price-desc": filteredProducts.sort((a, b) => b.price - a.price); break;
    case "name-asc":   filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: /* featured = original order */ break;
  }

  renderProductGrid(filteredProducts);
  updateResultCount(filteredProducts.length);
  currentGalleryIndex = 0;
  buildGalleryDots();
  updateGalleryDisplay();
  updateRunningTotal();
}

function updateResultCount(count) {
  const el = document.getElementById("resultCount");
  if (!el) return;
  el.textContent = count === products.length
    ? `Showing all ${count} products`
    : `Showing ${count} of ${products.length} products`;
}

function renderProductGrid(items) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  if (items.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No products found matching your search.";
    container.appendChild(emptyMsg);
    return;
  }

  items.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.alt;
    img.loading = "lazy";

    const badge = document.createElement("span");
    badge.className = `category-badge ${product.category}`;
    badge.textContent = CATEGORY_LABELS[product.category] || product.category;

    const title = document.createElement("h4");
    title.textContent = product.name;

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = product.description;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatKES(product.price);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.appendChild(buildCardControls(product));

    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

// Renders either an "Add to Cart" button or a quantity stepper per product.
function buildCardControls(product) {
  const qty = cart[product.id] || 0;

  if (qty <= 0) {
    const addBtn = document.createElement("button");
    addBtn.className = "add-btn";
    addBtn.type = "button";
    addBtn.textContent = "Add to Cart";
    addBtn.addEventListener("click", () => {
      cart[product.id] = 1;
      saveCart();
      refreshCardControls(product);
      updateRunningTotal();
      showToast(`${product.name} added to cart`, "success");
    });
    return addBtn;
  }

  const stepper = document.createElement("div");
  stepper.className = "stepper";

  const minus = document.createElement("button");
  minus.type = "button";
  minus.textContent = "\u2212";
  minus.setAttribute("aria-label", `Decrease quantity of ${product.name}`);
  minus.addEventListener("click", () => setCartQty(product, qty - 1));

  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.value = qty;
  input.className = "qty-input";
  input.setAttribute("aria-label", `Quantity of ${product.name}`);
  input.addEventListener("change", (e) => {
    const val = parseInt(e.target.value, 10);
    setCartQty(product, isNaN(val) ? 0 : val);
  });

  const plus = document.createElement("button");
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", `Increase quantity of ${product.name}`);
  plus.addEventListener("click", () => setCartQty(product, qty + 1));

  stepper.appendChild(minus);
  stepper.appendChild(input);
  stepper.appendChild(plus);

  const label = document.createElement("span");
  label.className = "in-cart-label";
  label.textContent = "In cart";

  const wrap = document.createDocumentFragment();
  wrap.appendChild(stepper);
  wrap.appendChild(label);
  return wrap;
}

function setCartQty(product, newQty) {
  if (newQty > 0) {
    cart[product.id] = newQty;
  } else {
    delete cart[product.id];
    showToast(`${product.name} removed from cart`, "info");
  }
  saveCart();
  refreshCardControls(product);
  updateRunningTotal();
}

// Re-render just one card's controls without rebuilding the whole grid.
function refreshCardControls(product) {
  const container = document.getElementById("productsContainer");
  if (!container) return;
  const cards = container.querySelectorAll(".product-card");
  const index = filteredProducts.findIndex(p => p.id === product.id);
  if (index < 0 || !cards[index]) return;
  const actions = cards[index].querySelector(".card-actions");
  if (!actions) return;
  actions.innerHTML = "";
  actions.appendChild(buildCardControls(product));
}

/* ---- Featured gallery ---- */
function buildGalleryDots() {
  const dotsWrap = document.getElementById("galleryDots");
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  if (filteredProducts.length === 0) return;

  filteredProducts.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === currentGalleryIndex ? " active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => {
      currentGalleryIndex = i;
      updateGalleryDisplay();
      restartGalleryAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
}

function updateGalleryDisplay() {
  const galleryImg = document.getElementById("galleryImg");
  const galleryCaption = document.getElementById("galleryCaption");
  if (!galleryImg) return;

  if (filteredProducts.length === 0) {
    galleryImg.src = "https://placehold.co/600x350?text=No+products";
    galleryImg.alt = "No products found";
    galleryCaption.textContent = "No items available for this filter selection";
    const dotsWrap = document.getElementById("galleryDots");
    if (dotsWrap) dotsWrap.innerHTML = "";
    return;
  }

  const currentItem = filteredProducts[currentGalleryIndex];
  galleryImg.src = currentItem.image;
  galleryImg.alt = currentItem.alt;
  galleryCaption.textContent = `${currentItem.name} \u2014 ${formatKES(currentItem.price)}`;

  const dots = document.querySelectorAll("#galleryDots .dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === currentGalleryIndex));
}

function navigateGallery(direction) {
  if (filteredProducts.length === 0) return;
  currentGalleryIndex += direction;
  if (currentGalleryIndex < 0) {
    currentGalleryIndex = filteredProducts.length - 1;
  } else if (currentGalleryIndex >= filteredProducts.length) {
    currentGalleryIndex = 0;
  }
  updateGalleryDisplay();
}

function startGalleryAutoplay() {
  stopGalleryAutoplay();
  if (filteredProducts.length <= 1) return;
  galleryTimer = setInterval(() => navigateGallery(1), 5000);
}

function stopGalleryAutoplay() {
  if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; }
}

function restartGalleryAutoplay() {
  startGalleryAutoplay();
}

// Running subtotal reflects the WHOLE cart, not just the filtered view.
function updateRunningTotal() {
  const runningTotalEl = document.getElementById("runningTotal");
  const itemsEl = document.getElementById("subtotalItems");
  const calcError = document.getElementById("calcError");
  if (!runningTotalEl) return;

  let total = 0;
  let count = 0;
  Object.keys(cart).forEach(id => {
    const product = products.find(p => p.id === Number(id));
    if (!product) return;
    const qty = cart[id];
    total += product.price * qty;
    count += qty;
  });

  runningTotalEl.textContent = formatKES(total, true);
  if (itemsEl) {
    itemsEl.textContent = count === 0
      ? "Your cart is empty."
      : `${count} item${count === 1 ? "" : "s"} in your cart.`;
  }
  if (calcError) calcError.classList.add("hidden");
}
/* ==========================================================================
   Cart Page Logic
   ========================================================================== */
function initCartPage() {
  renderCartTable();

  const clearBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (Object.keys(cart).length === 0) return;
      if (!confirm("Remove all items from your cart?")) return;
      cart = {};
      saveCart();
      renderCartTable();
      showToast("Cart cleared", "info");
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (Object.keys(cart).length === 0) {
        showToast("Your cart is empty", "error");
        return;
      }
      cart = {};
      saveCart();
      document.getElementById("cartContent").classList.add("hidden");
      document.getElementById("checkoutSuccess").classList.remove("hidden");
      showToast("Order placed successfully", "success");
    });
  }
}

function renderCartTable() {
  const tbody = document.getElementById("cartTableBody");
  const emptyBox = document.getElementById("emptyCartMsg");
  const cartContent = document.getElementById("cartContent");
  const cartTotalEl = document.getElementById("cartTotal");
  if (!tbody) return;

  const itemIds = Object.keys(cart);

  if (itemIds.length === 0) {
    emptyBox.classList.remove("hidden");
    cartContent.classList.add("hidden");
    return;
  }

  emptyBox.classList.add("hidden");
  cartContent.classList.remove("hidden");
  tbody.innerHTML = "";

  let grandTotal = 0;

  itemIds.forEach(id => {
    const product = products.find(p => p.id === Number(id));
    if (!product) return;

    const qty = cart[id];
    const itemTotal = product.price * qty;
    grandTotal += itemTotal;

    const tr = document.createElement("tr");

    // Product cell (text set via textContent to avoid HTML injection)
    const infoTd = document.createElement("td");
    const info = document.createElement("div");
    info.className = "cart-item-info";
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.alt;
    img.loading = "lazy";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = product.name;
    info.appendChild(img);
    info.appendChild(nameSpan);
    infoTd.appendChild(info);

    const priceTd = document.createElement("td");
    priceTd.textContent = formatKES(product.price);

    const qtyTd = document.createElement("td");
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = qty;
    qtyInput.className = "qty-input cart-qty-input";
    qtyInput.dataset.id = product.id;
    qtyInput.setAttribute("aria-label", `Quantity of ${product.name}`);
    qtyTd.appendChild(qtyInput);

    const totalTd = document.createElement("td");
    totalTd.textContent = formatKES(itemTotal, true);

    const actionTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-danger remove-btn";
    removeBtn.dataset.id = product.id;
    removeBtn.textContent = "Remove";
    actionTd.appendChild(removeBtn);

    tr.appendChild(infoTd);
    tr.appendChild(priceTd);
    tr.appendChild(qtyTd);
    tr.appendChild(totalTd);
    tr.appendChild(actionTd);
    tbody.appendChild(tr);
  });

  cartTotalEl.textContent = formatKES(grandTotal, true);

  document.querySelectorAll(".cart-qty-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const newQty = parseInt(e.target.value, 10);
      if (!isNaN(newQty) && newQty > 0) {
        cart[id] = newQty;
      } else {
        delete cart[id];
      }
      saveCart();
      renderCartTable();
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const product = products.find(p => p.id === Number(id));
      delete cart[id];
      saveCart();
      renderCartTable();
      showToast(`${product ? product.name : "Item"} removed`, "info");
    });
  });
}

/* ==========================================================================
   Form Validation & Dynamic Feedback
   ========================================================================== */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initRegistrationPage() {
  const form = document.getElementById("registrationForm");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  // Live validation once the user leaves a field, and error clearing on input.
  fullName.addEventListener("blur", () => validateName(fullName));
  email.addEventListener("blur", () => validateEmail(email));
  password.addEventListener("blur", () => validatePassword(password));
  confirmPassword.addEventListener("blur", () => validateConfirm(password, confirmPassword));

  password.addEventListener("input", () => updatePasswordStrength(password.value));

  // Show / hide password toggles
  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const show = target.type === "password";
      target.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const okName = validateName(fullName);
    const okEmail = validateEmail(email);
    const okPass = validatePassword(password);
    const okConfirm = validateConfirm(password, confirmPassword);

    if (okName && okEmail && okPass && okConfirm) {
      form.reset();
      form.classList.add("hidden");
      document.getElementById("successBanner").classList.remove("hidden");
      showToast("Registration successful", "success");
    } else {
      showToast("Please fix the highlighted fields", "error");
    }
  });
}

function validateName(el) {
  if (el.value.trim() === "") {
    showError("nameError", "Full Name is required.", el);
    return false;
  }
  clearError("nameError", el);
  return true;
}

function validateEmail(el) {
  const val = el.value.trim();
  if (val === "") {
    showError("emailError", "Campus Email is required.", el);
    return false;
  }
  if (!emailRegex.test(val)) {
    showError("emailError", "Email must include a valid format (e.g., user@domain.com).", el);
    return false;
  }
  clearError("emailError", el);
  return true;
}

function validatePassword(el) {
  if (el.value.length < 6) {
    showError("passwordError", "Password must be at least 6 characters long.", el);
    return false;
  }
  clearError("passwordError", el);
  return true;
}

function validateConfirm(passwordEl, confirmEl) {
  if (confirmEl.value === "") {
    showError("confirmPasswordError", "Please re-type your password.", confirmEl);
    return false;
  }
  if (passwordEl.value !== confirmEl.value) {
    showError("confirmPasswordError", "Passwords do not match.", confirmEl);
    return false;
  }
  clearError("confirmPasswordError", confirmEl);
  return true;
}

function updatePasswordStrength(value) {
  const bar = document.getElementById("passwordStrength");
  if (!bar) return;
  let score = 0;
  if (value.length >= 6) score++;
  if (value.length >= 10) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const levels = [
    { pct: "0%",   color: "var(--danger)" },
    { pct: "25%",  color: "var(--danger)" },
    { pct: "50%",  color: "#f9a825" },
    { pct: "75%",  color: "#f9a825" },
    { pct: "100%", color: "var(--accent)" },
    { pct: "100%", color: "var(--accent)" }
  ];
  const level = levels[Math.min(score, levels.length - 1)];
  bar.style.setProperty("--strength", value ? level.pct : "0%");
  bar.style.setProperty("--strength-color", level.color);
}

function showError(errorId, text, inputEl) {
  const errorSpan = document.getElementById(errorId);
  errorSpan.textContent = text;
  errorSpan.classList.add("visible");
  if (inputEl) { inputEl.classList.add("invalid"); inputEl.classList.remove("valid"); }
}

function clearError(errorId, inputEl) {
  const errorSpan = document.getElementById(errorId);
  errorSpan.textContent = "";
  errorSpan.classList.remove("visible");
  if (inputEl) { inputEl.classList.remove("invalid"); inputEl.classList.add("valid"); }
}
