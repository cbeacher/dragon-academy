/* Purse — ambient audio
   Three independent layers: a quiet looping music playlist, a constant quiet
   fireplace crackle behind the fire portal, and random dragon roar/wing SFX.
   Browsers block audio autoplay before any user interaction, so everything
   starts on the first click/keypress rather than on page load. */
(function () {
  const DIR = "assets/audio/";
  const MUSIC_VOLUME = 0.26;
  const FIRE_VOLUME = 0.14;
  const DRAGON_VOLUME = 0.4;

  // Track selection rule: any source file Clinton has prefaced "music " in
  // Purse/Audio/ counts as a rotation track — fireplace-crackle.mp3 qualifies
  // under that rule (source name was "music restfuldreamingtunes-...-
  // fireplace...") even though it also plays a second, independent role as
  // the constant looping ambience behind the fire portal (startFireCrackle
  // below) — one asset file, two separate Audio() instances, no conflict.
  const MUSIC_TRACKS = [
    "music-kohoutek.mp3",
    "music-piano.mp3",
    "music-winter-winds.mp3",
    "music-wind-blowing.mp3",
    "music-distant-bells.mp3",
    "fireplace-crackle.mp3"
  ];

  const DRAGON_SFX = [
    "dragon-fire-breath.mp3",
    "dragon-roar-1.mp3",
    "dragon-roar-2.mp3",
    "dragon-roar-3.mp3",
    "dragon-roar-4.mp3",
    "dragon-wings-1.mp3",
    "dragon-wings-2.mp3"
  ];

  let started = false;
  let lastMusicTrack = null;

  function pickDifferent(list, last) {
    if (list.length === 1) return list[0];
    let choice;
    do {
      choice = list[Math.floor(Math.random() * list.length)];
    } while (choice === last);
    return choice;
  }

  function playNextMusicTrack() {
    const track = pickDifferent(MUSIC_TRACKS, lastMusicTrack);
    lastMusicTrack = track;
    const audio = new Audio(DIR + track);
    audio.volume = MUSIC_VOLUME;
    audio.addEventListener("ended", playNextMusicTrack);
    audio.play().catch(() => {});
  }

  function startFireCrackle() {
    const audio = new Audio(DIR + "fireplace-crackle.mp3");
    audio.loop = true;
    audio.volume = FIRE_VOLUME;
    audio.play().catch(() => {});
  }

  function scheduleDragonSfx() {
    const delay = 15000 + Math.random() * 25000; // 15-40s, matches flying-dragons.js cadence
    setTimeout(function () {
      const file = DRAGON_SFX[Math.floor(Math.random() * DRAGON_SFX.length)];
      const audio = new Audio(DIR + file);
      audio.volume = DRAGON_VOLUME;
      audio.play().catch(() => {});
      scheduleDragonSfx();
    }, delay);
  }

  function start() {
    if (started) return;
    started = true;
    playNextMusicTrack();
    startFireCrackle();
    setTimeout(scheduleDragonSfx, 4000 + Math.random() * 4000);
  }

  document.addEventListener("click", start, { once: true });
  document.addEventListener("keydown", start, { once: true });

  window.PurseAudio = { start: start };
})();
