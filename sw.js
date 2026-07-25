const CACHE_NAME = "dragon-academy-v4";
const SCOPE_URL = new URL(self.registration.scope);

const PRECACHE_PATHS = [
  "./",
  "assets/audio/dragon-fire-breath.mp3",
  "assets/audio/dragon-roar-1.mp3",
  "assets/audio/dragon-roar-2.mp3",
  "assets/audio/dragon-roar-3.mp3",
  "assets/audio/dragon-roar-4.mp3",
  "assets/audio/dragon-wings-1.mp3",
  "assets/audio/dragon-wings-2.mp3",
  "assets/audio/fireplace-crackle.mp3",
  "assets/audio/music-distant-bells.mp3",
  "assets/audio/music-kohoutek.mp3",
  "assets/audio/music-piano.mp3",
  "assets/audio/music-wind-blowing.mp3",
  "assets/audio/music-winter-winds.mp3",
  "assets/backgrounds/dragon-black-spiky.jpg",
  "assets/backgrounds/dragon-black-swamp.jpg",
  "assets/backgrounds/dragon-fire-red.jpg",
  "assets/backgrounds/dragon-gold-sky.jpg",
  "assets/backgrounds/dragon-landscape.jpg",
  "assets/backgrounds/dragon-purple-sky.jpeg",
  "assets/backgrounds/leather.webp",
  "assets/dragons/baby-blue.png",
  "assets/dragons/baby-orange.png",
  "assets/dragons/baby-purple.png",
  "assets/dragons/baby-red.png",
  "assets/dragons/hand-green.png",
  "assets/dragons/hand-pink.png",
  "assets/dragons/hand-purple.png",
  "assets/dragons/hand-teal.png",
  "assets/effects/dragon-silhouette.png",
  "assets/effects/fire.gif",
  "assets/fonts/cinzel-600-latin-ext.woff2",
  "assets/fonts/cinzel-600-latin.woff2",
  "assets/fonts/medievalsharp-400-latin-ext.woff2",
  "assets/fonts/medievalsharp-400-latin.woff2",
  "assets/fonts/pinyonscript-400-latin-ext.woff2",
  "assets/fonts/pinyonscript-400-latin.woff2",
  "assets/fonts/pinyonscript-400-vietnamese.woff2",
  "assets/hatch-sequence/1-sticks.png",
  "assets/hatch-sequence/2-log.png",
  "assets/hatch-sequence/3-fire-lit.png",
  "assets/hatch-sequence/4-egg-in-fire.png",
  "assets/hatch-sequence/5-egg-cracking.png",
  "assets/hatch-sequence/6-egg-hatched.png",
  "assets/hatchlings/01_Ember_Rex.png",
  "assets/hatchlings/02_Lava_Pup.png",
  "assets/hatchlings/03_Ashwing.png",
  "assets/hatchlings/04_Cinder_Drake.png",
  "assets/hatchlings/05_Magma_Lord.png",
  "assets/hatchlings/06_Ice_Wing.png",
  "assets/hatchlings/07_Frostbite.png",
  "assets/hatchlings/08_Glacier_Drake.png",
  "assets/hatchlings/09_Snow_Prowler.png",
  "assets/hatchlings/10_Cryo_Queen.png",
  "assets/hatchlings/11_Thunder_Hatch.png",
  "assets/hatchlings/12_Stormling.png",
  "assets/hatchlings/13_Tempest_Talon.png",
  "assets/hatchlings/14_Cyclone_Drake.png",
  "assets/hatchlings/15_Volt_Striker.png",
  "assets/hatchlings/16_Leaf_Drake.png",
  "assets/hatchlings/17_Mossling.png",
  "assets/hatchlings/18_Vine_Serpent.png",
  "assets/hatchlings/19_Bloomwing.png",
  "assets/hatchlings/20_Forest_Elder.png",
  "assets/hatchlings/21_Light_Talon.png",
  "assets/hatchlings/22_Radiant_Hatch.png",
  "assets/hatchlings/23_Sunflare.png",
  "assets/hatchlings/24_Halo_Drake.png",
  "assets/hatchlings/25_Celestia.png",
  "assets/hatchlings/26_Darkling.png",
  "assets/hatchlings/27_Shade_Stalker.png",
  "assets/hatchlings/28_Night_Maw.png",
  "assets/hatchlings/29_Void_Wyrm.png",
  "assets/hatchlings/30_Obsidian_Overlord.png",
  "assets/hatchlings/31_Rockscale.png",
  "assets/hatchlings/32_Stone_Pup.png",
  "assets/hatchlings/33_Granite_Guard.png",
  "assets/hatchlings/34_Terra_Drake.png",
  "assets/hatchlings/35_Mountain_King.png",
  "assets/hatchlings/36_Tide_Pup.png",
  "assets/hatchlings/37_Coral_Drake.png",
  "assets/hatchlings/38_Wave_Dancer.png",
  "assets/hatchlings/39_Abysslurker.png",
  "assets/hatchlings/40_Ocean_Monarch.png",
  "assets/hatchlings/41_Arcane_Wisp.png",
  "assets/hatchlings/42_Spellscale.png",
  "assets/hatchlings/43_Enigma_Drake.png",
  "assets/hatchlings/44_Rune_Guardian.png",
  "assets/hatchlings/45_Mystic_Sage.png",
  "assets/hatchlings/46_Chrono_Dragon.png",
  "assets/hatchlings/47_Prismwing.png",
  "assets/hatchlings/48_Eternal_Flame.png",
  "assets/hatchlings/49_Galaxy_Seraph.png",
  "assets/hatchlings/50_Zenith_Dragon.png",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/logo-dragon-head.png",
  "assets/periodic-table/full-table.png",
  "css/fonts.css",
  "css/style.css",
  "index.html",
  "js/audio.js",
  "js/backgrounds.js",
  "js/dragon.js",
  "js/flying-dragons.js",
  "js/game.js",
  "js/periodic-table.js",
  "js/subjects/chemistry.js",
  "js/subjects/economics.js",
  "js/subjects/geography.js",
  "js/subjects/history.js",
  "js/subjects/physics.js",
  "manifest.json",
];

const PRECACHE_URLS = PRECACHE_PATHS.map((p) => new URL(p, SCOPE_URL).href);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
