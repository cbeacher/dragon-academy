(function () {
  const container = document.createElement("div");
  container.className = "flying-dragons";
  document.body.appendChild(container);

  function spawn() {
    const el = document.createElement("img");
    el.className = "flying-dragon " + (Math.random() < 0.5 ? "fly-ltr" : "fly-rtl");
    el.src = "assets/effects/dragon-silhouette.png";
    el.alt = "";
    el.style.setProperty("--fly-top", 45 + Math.random() * 45 + "vh");
    el.style.setProperty("--fly-rise", 30 + Math.random() * 30 + "vh");
    el.style.setProperty("--fly-duration", 18 + Math.random() * 14 + "s");
    el.style.width = 36 + Math.random() * 34 + "px";
    container.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }

  function scheduleNext(delay) {
    setTimeout(() => {
      spawn();
      scheduleNext(15000 + Math.random() * 25000);
    }, delay);
  }

  scheduleNext(3000 + Math.random() * 4000);
})();
