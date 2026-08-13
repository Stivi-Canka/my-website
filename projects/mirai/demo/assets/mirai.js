/* Mirai demo — tiny progressive enhancement. Every element it touches has a
   sensible static value in the HTML, so the page is fine with JS disabled. */

(function () {
  "use strict";

  /* The greeting is deliberately fixed in the HTML — it belongs to the issue,
     not to the moment the page is opened. Nothing here touches it. */

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function render() {
    var now = new Date();

    var clocks = document.querySelectorAll("[data-clock]");
    for (var i = 0; i < clocks.length; i++) {
      clocks[i].textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
    }
  }

  render();
  setInterval(render, 30000);
})();
