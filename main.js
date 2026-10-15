(function () {
  var intro = document.getElementById("intro");
  if (intro) {
    window.setTimeout(function () {
      intro.classList.add("hide");
      document.body.style.overflow = "";
    }, 2400);
    document.body.style.overflow = "hidden";
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
