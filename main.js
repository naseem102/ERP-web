(function () {
  var COOKIE_KEY = "erp_cookie_consent";
  var introDone = false;

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

  function closeIntro(intro) {
    if (!intro || introDone) return;
    introDone = true;
    intro.classList.add("hide");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      if (intro.parentNode) intro.style.display = "none";
      maybeCookies();
    }, 700);
  }

  var intro = document.getElementById("intro");
  var showIntro = intro && shouldShowIntro();
  if (intro) {
    if (showIntro) {
      document.body.style.overflow = "hidden";
      // Original premium intro: float logo + ring + bar, then fade (~2.4s)
      window.setTimeout(function () { closeIntro(intro); }, 2400);
    } else {
      intro.classList.add("hide");
      intro.style.display = "none";
      introDone = true;
    }
  } else {
    introDone = true;
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
    if (data && data.preferences) {
      document.documentElement.setAttribute("data-prefs", "1");
    } else {
      document.documentElement.removeAttribute("data-prefs");
    }
    if (data && data.analytics) {
      document.documentElement.setAttribute("data-analytics", "1");
      window.ERP_ANALYTICS = true;
    } else {
      document.documentElement.removeAttribute("data-analytics");
      window.ERP_ANALYTICS = false;
    }
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.classList.add("cookie-hide");
    banner.classList.remove("cookie-show");
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
          '<div class="cookie-details" id="cookie-details">' +
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
    var manageBtn = banner.querySelector("#ck-manage");

    manageBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = details.classList.toggle("is-open");
      manageBtn.textContent = open ? "Hide" : "Manage";
      manageBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    banner.querySelector("#ck-necessary").addEventListener("click", function (e) {
      e.preventDefault();
      saveConsent({ preferences: false, analytics: false });
      hideBanner(banner);
    });

    banner.querySelector("#ck-accept").addEventListener("click", function (e) {
      e.preventDefault();
      var detailsOpen = details.classList.contains("is-open");
      var prefEl = banner.querySelector("#ck-pref");
      var anEl = banner.querySelector("#ck-analytics");
      saveConsent({
        preferences: detailsOpen ? prefEl.checked : true,
        analytics: detailsOpen ? anEl.checked : true
      });
      hideBanner(banner);
    });
  }

  function maybeCookies() {
    var existing = readConsent();
    if (existing) {
      applyConsent(existing);
      return;
    }
    showCookieBanner();
  }

  if (introDone) maybeCookies();
})();
