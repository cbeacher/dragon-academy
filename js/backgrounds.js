(function () {
  const POOL = [
    "../assets/backgrounds/dragon-landscape.jpg",
    "../assets/backgrounds/dragon-gold-sky.jpg",
    "../assets/backgrounds/dragon-purple-sky.jpeg",
    "../assets/backgrounds/dragon-black-swamp.jpg",
    "../assets/backgrounds/dragon-black-spiky.jpg",
    "../assets/backgrounds/dragon-fire-red.jpg",
  ];

  let last = null;

  function cycle() {
    let pick = POOL[Math.floor(Math.random() * POOL.length)];
    if (POOL.length > 1) {
      while (pick === last) pick = POOL[Math.floor(Math.random() * POOL.length)];
    }
    last = pick;
    document.body.style.setProperty("--bg-image", 'url("' + pick + '")');
  }

  window.PurseBackgrounds = { cycle: cycle };
  cycle();
})();
