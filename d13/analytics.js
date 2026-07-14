/*
  Auto Body Lopez — dormant analytics/event hook.
  Every CTA on the site carries data-cta + data-cta-location attributes. This listener
  logs a dataLayer event for each click so a future GA4/GTM install (see the commented
  loader snippet in <head>) starts counting call/text/directions taps immediately —
  no markup changes needed at upgrade time. window.dataLayer does not exist until GTM is
  installed, so this is a silent no-op in the demo.
*/
(function () {
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (!el) return;
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "cta_click",
        cta_type: el.getAttribute("data-cta"),
        cta_location: el.getAttribute("data-cta-location") || "unknown"
      });
    }
  });
})();
