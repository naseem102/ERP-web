(function () {
  var COOKIE_KEY = "erp_cookie_consent";

  function shouldShowIntro() {
    var type = "navigate";
    try {
      var nav = performance.getEntriesByType("navigation")[0];
      if (nav && nav.type) type = nav.type;
    } catch (e) {}
    if (type === "reload") return true;
    if (type === "back_forward") return false;
    if (document.referrer) {
      try {
        var ref = new URL(document.referrer);
        if (ref.origin === location.origin) return false;
      } catch (e2) {}
    }
    return true;
  }

  var intro = document.getElementById("intro");
  if (intro) {
    if (shouldShowIntro()) {
      document.body.style.overflow = "hidden";
      window.setTimeout(function () {
        intro.classList.add("hide");
        document.body.style.overflow = "";
      }, 2400);
    } else {
      intro.classList.add("hide");
      intro.style.display = "none";
    }
  }

  var y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("show"); });
  }

  /* ===== Cookie consent ===== */
  function readConsent() {
    try {
      var raw = localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(prefs) {
    var data = {
      necessary: true,
      preferences: !!prefs.preferences,
      analytics: !!prefs.analytics,
      ts: Date.now()
    };
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
    } catch (e) {}
    applyConsent(data);
    return data;
  }

  function applyConsent(data) {
    // Necessary always on (consent storage itself)
    // Preferences: site UI memory (e.g. future theme/lang)
    if (data && data.preferences) {
      document.documentElement.setAttribute("data-prefs", "1");
    } else {
      document.documentElement.removeAttribute("data-prefs");
    }
    // Analytics: only if accepted — hook for future tools (no third-party loaded by default)
    if (data && data.analytics) {
      document.documentElement.setAttribute("data-analytics", "1");
      // Example placeholder: window.ERP_ANALYTICS = true;
      window.ERP_ANALYTICS = true;
    } else {
      document.documentElement.removeAttribute("data-analytics");
      window.ERP_ANALYTICS = false;
    }
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.classList.add("cookie-hide");
    window.setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 350);
  }

  function showCookieBanner() {
    if (document.getElementById("cookie-banner")) return;

    var banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<div class="cookie-text">' +
          '<strong>We use cookies</strong>' +
          '<p>Necessary cookies keep the site working. Optional cookies remember your preferences and help us improve the site if you allow analytics. ' +
          '<a href="privacy.html#cookies">Cookie details</a></p>' +
          '<div class="cookie-details" id="cookie-details" hidden>' +
            '<label><input type="checkbox" checked disabled /> <span><b>Necessary</b> — store your consent choice</span></label>' +
            '<label><input type="checkbox" id="ck-pref" checked /> <span><b>Preferences</b> — remember UI choices on this device</span></label>' +
            '<label><input type="checkbox" id="ck-analytics" /> <span><b>Analytics</b> — anonymous usage to improve the site (no ads)</span></label>' +
          '</div>' +
        '</div>' +
        '<div class="cookie-actions">' +
          '<button type="button" class="cookie-btn cookie-btn-ghost" id="ck-manage">Manage</button>' +
          '<button type="button" class="cookie-btn cookie-btn-ghost" id="ck-necessary">Necessary only</button>' +
          '<button type="button" class="cookie-btn cookie-btn-primary" id="ck-accept">Accept all</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      banner.classList.add("cookie-show");
    });

    var details = banner.querySelector("#cookie-details");
    banner.querySelector("#ck-manage").addEventListener("click", function () {
      var open = details.hasAttribute("hidden");
      if (open) details.removeAttribute("hidden");
      else details.setAttribute("hidden", "");
    });

    banner.querySelector("#ck-necessary").addEventListener("click", function () {
      saveConsent({ preferences: false, analytics: false });
      hideBanner(banner);
    });

    banner.querySelector("#ck-accept").addEventListener("click", function () {
      var prefEl = banner.querySelector("#ck-pref");
      var anEl = banner.querySelector("#ck-analytics");
      // Accept all: if details closed, enable both optional; if open, use checkboxes
      var detailsOpen = !details.hasAttribute("hidden");
      saveConsent({
        preferences: detailsOpen ? prefEl.checked : true,
        analytics: detailsOpen ? anEl.checked : true
      });
      hideBanner(banner);
    });
  }

  var existing = readConsent();
  if (existing) {
    applyConsent(existing);
  } else {
    // After intro (if any), show banner
    var delay = document.getElementById("intro") && shouldShowIntro() ? 2600 : 400;
    window.setTimeout(showCookieBanner, delay);
  }
})();
