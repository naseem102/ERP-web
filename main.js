(function () {
  function shouldShowIntro() {
    var type = "navigate";
    try {
      var nav = performance.getEntriesByType("navigation")[0];
      if (nav && nav.type) type = nav.type;
    } catch (e) {}

    // Full reload → show animation
    if (type === "reload") return true;

    // Browser back/forward → no animation
    if (type === "back_forward") return false;

    // Internal link from Privacy / Terms / same site → no animation
    if (document.referrer) {
      try {
        var ref = new URL(document.referrer);
        if (ref.origin === location.origin) return false;
      } catch (e2) {}
    }

    // First open or coming from outside → show
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
  if (!("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("show"); });
    return;
  }
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
})();
