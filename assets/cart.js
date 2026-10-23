// Marks JS as available so scroll fade-in can hide content until it is revealed.
document.documentElement.classList.add("js");

// Catalog and cart. The cart lives in the visitor's browser only; no payment is taken on this site.
var BALM_INGREDIENTS = "Aloe Vera Gel (containing enzymes, mono and poly-saccharides, tannins, amino acids, saponins, salicylic acid, arachidonic acid, lipids, vitamins and minerals), Carbowax, PG, Herbal Essences";

function fruityBooty(handle, scent) {
  return {
    id: handle, brand: "Fruity Booty by Bum Bliss", price: 24.99, size: "2 oz",
    name: "Fruity Booty Intimate Deodorant Balm, " + scent,
    image: "assets/" + handle + ".jpg",
    summary: "A leave-in deodorant balm for the bum, intimate areas and underarms, scented with " + scent + ".",
    points: [
      "Deodorant balm that neutralizes odor on the bum, intimate areas and underarms.",
      "Gentle leave-in formula. No rinsing and no peroxide.",
      "Made with aloe vera gel and fruit essences."
    ],
    ingredients: BALM_INGREDIENTS
  };
}
function bumBliss(handle, scent) {
  return {
    id: handle, brand: "Bum Bliss", price: 24.99, size: "35 g (1.2 oz)",
    name: "Bum Bliss Intimate Deodorant Balm, " + scent,
    image: "assets/" + handle + ".jpg",
    summary: "A leave-in deodorant balm for the bum, intimate areas and underarms, in " + scent + ".",
    points: [
      "Deodorant balm that neutralizes odor on the bum, intimate areas and underarms.",
      "Gentle leave-in formula. No rinsing and no peroxide.",
      "Made with aloe vera gel and herbal essences."
    ],
    ingredients: BALM_INGREDIENTS
  };
}

var CATALOG = [
  { id: "ejmix-50ml", brand: "Bloomsdays", price: 29.98, size: "50 ml",
    name: "EJmix Aromatherapy Blend & Diluent (50ml)", image: "assets/ejmix-50ml.jpg", url: "ejmix.html",
    summary: "An odorless glycol base for diluting essential oils for reed diffusers and oil diffusers." },
  fruityBooty("fruity-booty-balm-apple", "Red Apple Bottoms"),
  fruityBooty("fruity-booty-balm-mango", "Mango Tango"),
  fruityBooty("fruity-booty-balm-passionfruit", "Passionfruit Frenzy"),
  fruityBooty("fruity-booty-balm-peach", "Peach Buzz"),
  bumBliss("bumbliss-apricot", "Apricot"),
  bumBliss("bumbliss-lavender", "Lavender"),
  bumBliss("bumbliss-rose", "Rose"),
  bumBliss("bumbliss-vanilla", "Vanilla")
];

function findProduct(id) {
  for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i];
  return null;
}
function productUrl(p) { return p.url || ("product.html?p=" + encodeURIComponent(p.id)); }

function readCart() {
  try { return JSON.parse(localStorage.getItem("bd_cart") || "{}"); } catch (e) { return {}; }
}
function writeCart(cart) {
  try { localStorage.setItem("bd_cart", JSON.stringify(cart)); } catch (e) {}
  showCount();
}
function cartCount() {
  var c = readCart(), n = 0;
  for (var k in c) if (findProduct(k)) n += c[k];
  return n;
}
function showCount() {
  var el = document.getElementById("cart-count");
  if (el) el.textContent = cartCount();
}
function addToCart(id, qty) {
  var c = readCart();
  c[id] = Math.min(99, (c[id] || 0) + qty);
  writeCart(c);
}
function setQty(id, qty) {
  var c = readCart();
  if (qty > 0) c[id] = Math.min(99, qty); else delete c[id];
  writeCart(c);
}
function money(n) { return "$" + n.toFixed(2); }
function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

function wireBuy(id) {
  var btn = document.getElementById("add"), qty = document.getElementById("qty"), msg = document.getElementById("added");
  btn.addEventListener("click", function () {
    var n = Math.max(1, Math.min(99, parseInt(qty.value, 10) || 1));
    addToCart(id, n);
    msg.innerHTML = 'Added to cart. <a href="cart.html">View cart</a>';
  });
}

// Product tabs. Without JS both panels stay visible.
function initTabs() {
  var box = document.querySelector(".tabs");
  if (!box) return;
  var links = box.querySelectorAll(".tab-nav a"), panels = box.querySelectorAll(".tab-panel");
  function show(i) {
    for (var k = 0; k < panels.length; k++) {
      var on = k === i;
      panels[k].classList.toggle("selected", on);
      links[k].classList.toggle("selected", on);
      links[k].setAttribute("aria-selected", on ? "true" : "false");
    }
  }
  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); show(i); });
  });
  box.classList.add("js");
  show(0);
}

// Subtle fade-in on scroll. Without JS (or with reduced motion) everything is shown as is.
function initFade() {
  var els = document.querySelectorAll(".fade");
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });
  els.forEach(function (el) { io.observe(el); });
}

document.addEventListener("DOMContentLoaded", function () { showCount(); initTabs(); initFade(); });
