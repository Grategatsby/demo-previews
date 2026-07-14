/*
  Mike's Auto Repair — shared site behavior (nav dropdown, FAQ accordion, gallery
  lightbox, open/closed badge). Loaded on every page.
*/
(function () {
  "use strict";

  // ---- Defensive: a dropdown must NEVER render open on page load ----
  function closeAllDropdowns() {
    document.querySelectorAll(".has-dropdown").forEach(function (li) {
      li.classList.remove("open");
      var link = li.querySelector(".nav-link");
      if (link) link.setAttribute("aria-expanded", "false");
    });
  }
  closeAllDropdowns();
  window.addEventListener("pageshow", closeAllDropdowns);

  // ---- Mobile nav toggle ----
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("mobile-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (!isOpen) closeAllDropdowns();
    });
  }

  var MOBILE = "(max-width: 900px)";

  // ---- Services dropdown parent: first tap opens the submenu on mobile ----
  document.querySelectorAll(".has-dropdown > .nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia(MOBILE).matches) {
        var li = link.parentElement;
        if (!li.classList.contains("open")) {
          e.preventDefault();
          document.querySelectorAll(".has-dropdown.open").forEach(function (o) {
            if (o !== li) o.classList.remove("open");
          });
          li.classList.add("open");
          link.setAttribute("aria-expanded", "true");
        }
      }
    });
  });

  // ---- Choosing any real destination closes the menu + clears dropdown/focus state ----
  document.querySelectorAll(".dropdown a, .nav-list > li:not(.has-dropdown) > a.nav-link").forEach(function (a) {
    a.addEventListener("click", function () {
      if (nav) nav.classList.remove("mobile-open");
      closeAllDropdowns();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    });
  });

  // ---- FAQ accordion ----
  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (i) {
        i.classList.remove("open");
        var btn = i.querySelector(".faq-q");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---- Lightbox gallery (home page only) ----
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = document.getElementById("lightbox-img");
    var lbCap = document.getElementById("lightbox-cap");
    var lbClose = document.getElementById("lightbox-close");
    document.querySelectorAll(".gallery-grid a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute("href");
        lbImg.alt = a.querySelector("img").alt;
        lbCap.textContent = a.getAttribute("data-caption") || "";
        lightbox.classList.add("open");
      });
    });
    function closeLightbox() { lightbox.classList.remove("open"); lbImg.src = ""; }
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  // ---- Open/Closed badge computed from visitor's local time ----
  var hours = {
    0: null,          // Sunday closed
    1: [9, 18],
    2: [9, 18],
    3: [9, 18],
    4: [9, 18],
    5: [9, 18],
    6: [9, 17]
  };
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var now = new Date();
  var day = now.getDay();
  var hourDecimal = now.getHours() + now.getMinutes() / 60;
  var todayHours = hours[day];
  var isOpen = todayHours ? (hourDecimal >= todayHours[0] && hourDecimal < todayHours[1]) : false;
  var badge = document.getElementById("status-badge");
  if (badge) {
    badge.innerHTML = isOpen
      ? '<span class="status-badge status-open"><span class="dot"></span>Open Now</span>'
      : '<span class="status-badge status-closed"><span class="dot"></span>Closed Now</span>';
  }
  var todayName = dayNames[day];
  document.querySelectorAll("#hours-table tr").forEach(function (r) {
    if (r.getAttribute("data-day") === todayName) r.classList.add("today");
  });
})();
