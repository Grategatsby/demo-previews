/*
  Marie Avenue Service — centralized phone config (DNI-ready)
  Single source of truth for the business phone number. Every tel:/sms: link and every
  on-page display of the number on every page reads from this file at load time, so a
  future swap to a call-tracking (CallRail/Twilio) number for paid-traffic tracking is a
  ONE-LINE edit here, not a per-page find/replace. The literal number is still written
  directly into each page's HTML text and JSON-LD (for SEO + verification) — this script
  just keeps every element in sync with the same source and updates instantly if the
  number below ever changes.

  To swap in a tracking number later: change PHONE.display / PHONE.tel below only.
*/
(function () {
  var PHONE = {
    display: "(651) 451-0911",
    tel: "+16514510911",
    smsBody: "Hi! I'd like to book a service appointment."
  };
  window.SITE_PHONE = PHONE;

  function apply() {
    document.querySelectorAll("[data-phone-tel]").forEach(function (el) {
      el.setAttribute("href", "tel:" + PHONE.tel);
    });
    document.querySelectorAll("[data-phone-sms]").forEach(function (el) {
      var body = el.getAttribute("data-sms-body") || PHONE.smsBody;
      el.setAttribute("href", "sms:" + PHONE.tel + "?&body=" + encodeURIComponent(body));
    });
    document.querySelectorAll("[data-phone-display]").forEach(function (el) {
      el.textContent = PHONE.display;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
