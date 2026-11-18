(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Greeting cycle: one greeting per language the work has been localized into (plus Tamil, English). */
  var track = document.getElementById("helloTrack");
  if (track && !reduceMotion) {
    var count = track.children.length;
    var step = 0;
    var rowHeight = function () { return track.children[0].getBoundingClientRect().height; };

    setInterval(function () {
      step = (step + 1) % (count + 1);
      if (step === count) {
        // Past the last item: snap back to the first without animating.
        track.style.transition = "none";
        track.style.transform = "translateY(0)";
        void track.offsetHeight;
        track.style.transition = "";
        step = 0;
        return;
      }
      track.style.transform = "translateY(" + -step * rowHeight() + "px)";
    }, 2400);
  }

  /* RTL layout preview: the CSS uses logical properties, so flipping dir mirrors the whole page. */
  var toggle = document.getElementById("rtlToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var rtl = document.documentElement.dir !== "rtl";
      document.documentElement.dir = rtl ? "rtl" : "ltr";
      toggle.setAttribute("aria-pressed", String(rtl));
    });
  }

  /* Active section in the nav, so the bar tells you where you are. */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* Copy email with visible confirmation. */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = document.querySelector(".contact__email").textContent.trim();
      var done = function () {
        copyBtn.textContent = "Copied";
        copyBtn.classList.add("is-done");
        setTimeout(function () {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("is-done");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () {});
      }
    });
  }
})();
