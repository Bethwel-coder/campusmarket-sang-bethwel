/**
 * CampusMarket — Weeks 1-4 Integration Script
 */

// Master Product Dataset
const products = [
  {
    id: 1,
    name: "Calculus: Early Transcendentals",
    category: "books",
    price: 2500,
    description: "Essential textbook for Year 1 Mathematics.",
    image: "https://picsum.photos/id/24/600/350",
    alt: "Calculus hardcover textbook"
  },
  {
    id: 2,
    name: "Scientific Calculator FX-991EX",
    category: "tech",
    price: 3200,
    description: "Approved for engineering and CS examinations.",
    image: "https://picsum.photos/id/0/600/350",
    alt: "Casio scientific calculator on a desk"
  },
  {
    id: 3,
    name: "Stainless Steel Water Flask",
    category: "lifestyle",
    price: 1200,
    description: "1-liter insulated thermal flask.",
    image: "https://picsum.photos/id/1060/600/350",
    alt: "Insulated water flask"
  },
  {
    id: 4,
    name: "Data Structures & Algorithms in C++",
    category: "books",
    price: 2800,
    description: "Core textbook for CCS 2315.",
    image: "https://picsum.photos/id/367/600/350",
    alt: "Programming reference book"
  },
  {
    id: 5,
    name: "Wireless Ergonomic Mouse",
    category: "tech",
    price: 1800,
    description: "2.4GHz rechargeable wireless mouse.",
    image: "https://picsum.photos/id/1010/600/350",
    alt: "Computer wireless mouse"
  }
];

// Shared State across components
let filteredProducts = [...products];
let currentGalleryIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Check active page context
  if (document.getElementById("productsContainer")) {
    initCatalogPage();
  }

  if (document.getElementById("registrationForm")) {
    initRegistrationPage();
  }
});

/* ==========================================================================
   Part 1 Check 1 & Part 2: Integrated Catalog & Dynamic Gallery
   ========================================================================== */
function initCatalogPage() {
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Pure addEventListener (No inline onclicks)
  searchInput.addEventListener("input", filterAndRender);
  categorySelect.addEventListener("change", filterAndRender);
  
  prevBtn.addEventListener("click", () => navigateGallery(-1));
  nextBtn.addEventListener("click", () => navigateGallery(1));

  // Initial display setup
  filterAndRender();
}

function filterAndRender() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const category = document.getElementById("categorySelect").value;

  // Filter Logic with Loop and Conditionals
  filteredProducts = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const matchesCategory = (category === "all" || p.category === category);
    const matchesSearch = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);

    if (matchesCategory && matchesSearch) {
      filteredProducts.push(p);
    }
  }

  renderProductGrid(filteredProducts);
  
  // Integration Requirement 1: Filtered results drive gallery image dataset
  currentGalleryIndex = 0;
  updateGalleryDisplay();
  calculateSubtotal();
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

  // Proper DOM manipulation
  items.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.alt; // Part 1 Check 5: Descriptive alt text

    const title = document.createElement("h4");
    title.textContent = product.name;

    const desc = document.createElement("p");
    desc.textContent = product.description;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `KES ${product.price.toLocaleString()}`;

    const qtyLabel = document.createElement("label");
    qtyLabel.textContent = "Qty: ";
    
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "0";
    qtyInput.value = "0";
    qtyInput.className = "qty-input";
    qtyInput.dataset.price = product.price;

    // Integration Requirement 2: Calculation triggers on validated input
    qtyInput.addEventListener("input", calculateSubtotal);

    qtyLabel.appendChild(qtyInput);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);
    card.appendChild(qtyLabel);

    container.appendChild(card);
  });
}

/* Gallery Controls with Wraparound */
function updateGalleryDisplay() {
  const galleryImg = document.getElementById("galleryImg");
  const galleryCaption = document.getElementById("galleryCaption");

  if (filteredProducts.length === 0) {
    galleryImg.src = "https://picsum.photos/id/1080/600/350";
    galleryImg.alt = "No products found";
    galleryCaption.textContent = "No items available for this filter selection";
    return;
  }

  const currentItem = filteredProducts[currentGalleryIndex];
  galleryImg.src = currentItem.image;
  galleryImg.alt = currentItem.alt; // Part 1 Check 5: Alt text
  galleryCaption.textContent = `${currentItem.name} — KES ${currentItem.price.toLocaleString()}`;
}

function navigateGallery(direction) {
  if (filteredProducts.length === 0) return;

  currentGalleryIndex += direction;

  // Wraparound boundaries
  if (currentGalleryIndex < 0) {
    currentGalleryIndex = filteredProducts.length - 1;
  } else if (currentGalleryIndex >= filteredProducts.length) {
    currentGalleryIndex = 0;
  }

  updateGalleryDisplay();
}

/* ==========================================================================
   Part 1 Check 2: Validated Subtotal Calculation
   ========================================================================== */
function calculateSubtotal() {
  const qtyInputs = document.querySelectorAll(".qty-input");
  const runningTotalEl = document.getElementById("runningTotal");
  const calcError = document.getElementById("calcError");

  let total = 0;
  let hasError = false;

  qtyInputs.forEach(input => {
    const val = input.value.trim();
    const qty = Number(val);
    const price = parseFloat(input.dataset.price);

    // Validation checks for numerical quantity inputs
    if (val !== "" && (!Number.isInteger(qty) || qty < 0)) {
      hasError = true;
      input.style.borderColor = "red";
    } else {
      input.style.borderColor = "#ccc";
      if (qty > 0) {
        total += qty * price;
      }
    }
  });

  if (hasError) {
    calcError.textContent = "Please enter valid, non-negative whole numbers for quantity.";
    calcError.classList.remove("hidden");
  } else {
    calcError.classList.add("hidden");
    runningTotalEl.textContent = `KES ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  }
}

/* ==========================================================================
   Part 1 Check 3 & 4: Form Validation & Dynamic Feedback
   ========================================================================== */
function initRegistrationPage() {
  const form = document.getElementById("registrationForm");
  
  // Use event.preventDefault() on submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    let isValid = true;

    // Rule 1: Required check
    if (fullName.value.trim() === "") {
      showError("nameError", "Full Name is required.", fullName);
      isValid = false;
    } else {
      clearError("nameError", fullName);
    }

    // Rule 2: Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
      showError("emailError", "Campus Email is required.", email);
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError("emailError", "Email must include a valid format (e.g., user@domain.com).", email);
      isValid = false;
    } else {
      clearError("emailError", email);
    }

    // Rule 3: Custom Rule — Password Matching & Length
    if (password.value.length < 6) {
      showError("passwordError", "Password must be at least 6 characters long.", password);
      isValid = false;
    } else {
      clearError("passwordError", password);
    }

    if (confirmPassword.value === "") {
      showError("confirmPasswordError", "Please re-type your password.", confirmPassword);
      isValid = false;
    } else if (password.value !== confirmPassword.value) {
      showError("confirmPasswordError", "Passwords do not match.", confirmPassword);
      isValid = false;
    } else {
      clearError("confirmPasswordError", confirmPassword);
    }

    // Success Handling with Animation
    if (isValid) {
      form.reset();
      form.classList.add("hidden");
      
      const successBanner = document.getElementById("successBanner");
      // Triggers @keyframes animation via CSS class
      successBanner.classList.remove("hidden");
    }
  });
}

function showError(errorId, text, inputEl) {
  const errorSpan = document.getElementById(errorId);
  errorSpan.textContent = text;
  errorSpan.classList.add("visible");
  if (inputEl) inputEl.classList.add("invalid");
}

function clearError(errorId, inputEl) {
  const errorSpan = document.getElementById(errorId);
  errorSpan.textContent = "";
  errorSpan.classList.remove("visible");
  if (inputEl) inputEl.classList.remove("invalid");
}