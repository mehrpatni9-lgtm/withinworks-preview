(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Phone booking bar: appears once the hero buttons have scrolled away
  var bar = document.querySelector(".mobile-cta");
  var heroActions = document.querySelector(".hero-actions");
  if (bar && heroActions && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var away = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      bar.classList.toggle("show", away);
      document.body.classList.toggle("cta-on", away);
    }).observe(heroActions);
  } else if (bar) {
    bar.classList.add("show");
  }

  // Reveal on scroll, and count the stats up once
  if (!("IntersectionObserver" in window)) return;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("motion");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("seen");
      io.unobserve(e.target);
      if (e.target.classList.contains("stats") && !still) countUp(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  document.querySelectorAll(".rise").forEach(function (el, i) {
    el.classList.add("d" + ((i % 3) + 1));
    io.observe(el);
  });

  function countUp(scope) {
    scope.querySelectorAll("[data-to]").forEach(function (el, i) {
      var target = parseInt(el.getAttribute("data-to"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1500;
      var start = null;
      var delay = 220 + i * 130;
      el.textContent = "0" + suffix;
      setTimeout(function () {
        requestAnimationFrame(function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        });
      }, delay);
    });
  }
})();
