/*
  Southview 66 — shared site behavior (nav, dropdown, FAQ accordion).
  Loaded on every page after phone-config.js.
*/
(function () {
  "use strict";

  // ---- Defensive: a dropdown must NEVER render open on page load ----
  // (Guards against a stale `.open` class or a browser restoring focus/hover state after
  //  navigation — the "dropdown still open on the destination page" bug.)
  function closeAllDropdowns() {
    document.querySelectorAll(".has-dropdown").forEach(function (li) {
      li.classList.remove("open");
      var link = li.querySelector(".nav-link");
      if (link) link.setAttribute("aria-expanded", "false");
    });
  }
  closeAllDropdowns();
  // Also close on bfcache restore (back/forward), which can replay old state.
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
        // If already open, let the click follow the link to the Services hub.
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

  // ---- Lightbox gallery (home page only — safe no-op elsewhere) ----
  (function () {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var img = document.getElementById("lightboxImg");
    var cap = document.getElementById("lightboxCap");
    var closeBtn = document.getElementById("lightboxClose");

    document.querySelectorAll(".gallery-grid a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        img.src = a.getAttribute("href");
        img.alt = a.querySelector("img").alt;
        cap.textContent = a.getAttribute("data-caption") || "";
        lightbox.classList.add("open");
      });
    });

    function close() {
      lightbox.classList.remove("open");
      img.src = "";
    }
    if (closeBtn) closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();
})();
