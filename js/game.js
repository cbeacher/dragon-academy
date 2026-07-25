/* Purse — game engine
   Loads a subject's question bank (see js/subjects/*.js), runs the quiz loop,
   and tracks level/XP progress in localStorage.

   Design rule: wrong answers never cost anything. A correct answer earns XP
   and moves the collection forward; a wrong answer just doesn't — no score
   loss, no penalty. The explanation is shown either way, then play continues.
*/

(function () {
  const STORAGE_KEY = "purse-save-chemistry-v2"; // kept as-is across subjects to preserve existing progress
  const XP_PER_CORRECT = 10;
  const XP_PER_LEVEL = 30;

  // The 50-dragon collection, cropped from assets/hatchlings/. Grouped in
  // families of 5 (index 0-4 = Ember, 5-9 = Frost, etc); see RARITY_WEIGHTS
  // below for how often each position within a family is drawn.
  const HATCHLING_DIR = "assets/hatchlings/";
  // subjectLock: only obtainable from a level-up triggered by that subject's
  // questions; omitted (undefined) means obtainable from any subject.
  const REWARDS_50 = [
    { name: "Ember Rex", family: "ember", subjectLock: "chemistry" },
    { name: "Lava Pup", family: "ember", subjectLock: "chemistry" },
    { name: "Ashwing", family: "ember", subjectLock: "chemistry" },
    { name: "Cinder Drake", family: "ember", subjectLock: "chemistry" },
    { name: "Magma Lord", family: "ember", subjectLock: "chemistry" },
    { name: "Ice Wing", family: "frost", subjectLock: "chemistry" },
    { name: "Frostbite", family: "frost", subjectLock: "chemistry" },
    { name: "Glacier Drake", family: "frost", subjectLock: "chemistry" },
    { name: "Snow Prowler", family: "frost", subjectLock: "chemistry" },
    { name: "Cryo Queen", family: "frost", subjectLock: "chemistry" },
    { name: "Thunder Hatch", family: "storm", subjectLock: "physics" },
    { name: "Stormling", family: "storm", subjectLock: "physics" },
    { name: "Tempest Talon", family: "storm", subjectLock: "physics" },
    { name: "Cyclone Drake", family: "storm", subjectLock: "physics" },
    { name: "Volt Striker", family: "storm", subjectLock: "physics" },
    { name: "Leaf Drake", family: "nature", subjectLock: "economics" },
    { name: "Mossling", family: "nature", subjectLock: "economics" },
    { name: "Vine Serpent", family: "nature", subjectLock: "economics" },
    { name: "Bloomwing", family: "nature", subjectLock: "economics" },
    { name: "Forest Elder", family: "nature", subjectLock: "economics" },
    { name: "Light Talon", family: "light", subjectLock: "physics" },
    { name: "Radiant Hatch", family: "light", subjectLock: "physics" },
    { name: "Sunflare", family: "light", subjectLock: "physics" },
    { name: "Halo Drake", family: "light", subjectLock: "physics" },
    { name: "Celestia", family: "light", subjectLock: "physics" },
    { name: "Darkling", family: "shadow", subjectLock: "history" },
    { name: "Shade Stalker", family: "shadow", subjectLock: "history" },
    { name: "Night Maw", family: "shadow", subjectLock: "history" },
    { name: "Void Wyrm", family: "shadow", subjectLock: "history" },
    { name: "Obsidian Overlord", family: "shadow", subjectLock: "history" },
    { name: "Rockscale", family: "earth", subjectLock: "geography" },
    { name: "Stone Pup", family: "earth", subjectLock: "geography" },
    { name: "Granite Guard", family: "earth", subjectLock: "geography" },
    { name: "Terra Drake", family: "earth", subjectLock: "geography" },
    { name: "Mountain King", family: "earth", subjectLock: "geography" },
    { name: "Tide Pup", family: "sea", subjectLock: "geography" },
    { name: "Coral Drake", family: "sea", subjectLock: "geography" },
    { name: "Wave Dancer", family: "sea", subjectLock: "geography" },
    { name: "Abysslurker", family: "sea", subjectLock: "geography" },
    { name: "Ocean Monarch", family: "sea", subjectLock: "geography" },
    { name: "Arcane Wisp", family: "mystic" },
    { name: "Spellscale", family: "mystic" },
    { name: "Enigma Drake", family: "mystic" },
    { name: "Rune Guardian", family: "mystic" },
    { name: "Mystic Sage", family: "mystic" },
    { name: "Chrono Dragon", family: "legendary" },
    { name: "Prismwing", family: "legendary" },
    { name: "Eternal Flame", family: "legendary" },
    { name: "Galaxy Seraph", family: "legendary" },
    { name: "Zenith Dragon", family: "legendary" }
  ];

  const FAMILY_EFFECTS = {
    ember: { particle: "🔥", color: "#e2725b" },
    frost: { particle: "❄️", color: "#6fc3e8" },
    storm: { particle: "⚡", color: "#a97bff", flash: true },
    nature: { particle: "🍃", color: "#6fbf73" },
    light: { particle: "✨", color: "#e8b84b" },
    shadow: { particle: null, color: "#6a5b95" },
    earth: { particle: "🪨", color: "#a9825a" },
    sea: { particle: "🫧", color: "#4f9fd1" },
    mystic: { particle: "✨", color: "#b06fe0" },
    legendary: { particle: "✨", color: "#e8c468", grand: true }
  };

  const FAMILY_ORDER = ["ember", "frost", "storm", "nature", "light", "shadow", "earth", "sea", "mystic", "legendary"];
  const FAMILY_LABELS = {
    ember: "🔥 Ember Family", frost: "❄️ Frost Family", storm: "⚡ Storm Family",
    nature: "🍃 Nature Family", light: "✨ Light Family", shadow: "🌙 Shadow Family",
    earth: "🪨 Earth Family", sea: "🫧 Sea Family", mystic: "🔮 Mystic Family",
    legendary: "👑 Legendary Family"
  };

  function hatchlingFile(index) {
    const base = REWARDS_50[index];
    const num = String(index + 1).padStart(2, "0");
    return num + "_" + base.name.replace(/ /g, "_") + ".png";
  }

  function getRewardBase(index) {
    const base = REWARDS_50[index];
    return {
      index: index,
      name: base.name,
      img: HATCHLING_DIR + hatchlingFile(index),
      family: base.family,
      effect: FAMILY_EFFECTS[base.family]
    };
  }

  // Rarity: position within a 5-dragon family. Position 0 (eg. "Ember Rex")
  // is common; position 4 (eg. "Magma Lord") is rare. Weights are relative.
  const RARITY_WEIGHTS = [10, 6, 4, 2, 1];

  function pickWeightedIndex(subjectId) {
    const eligible = [];
    REWARDS_50.forEach((r, i) => {
      if (!r.subjectLock || r.subjectLock === subjectId) eligible.push(i);
    });
    const weights = eligible.map((i) => RARITY_WEIGHTS[i % 5]);
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let k = 0; k < eligible.length; k++) {
      roll -= weights[k];
      if (roll <= 0) return eligible[k];
    }
    return eligible[eligible.length - 1];
  }

  // --- Subject picker -------------------------------------------------
  // Two-level picker: top-level areas (Science / HASS) each have subsections,
  // plus a top-level "everything" that spans all loaded subjects. Only
  // subjects that actually have a loaded js/subjects/*.js file appear —
  // e.g. Civics has no content yet, so it's simply absent until it does.
  const SUBJECT_AREA = {
    chemistry: "science", physics: "science",
    economics: "hass", geography: "hass", history: "hass", civics: "hass"
  };
  const SUBJECT_LABELS = {
    chemistry: "🧪 Chemistry", physics: "⚡ Physics",
    economics: "💰 Economics", geography: "🌏 Geography", history: "📜 History", civics: "🏛️ Civics"
  };
  const AREA_LABELS = { science: "Science", hass: "HASS" };
  const AREA_TAB_LABELS = { science: "🔬 Science", hass: "🌐 HASS" };

  const MODE_KEY = "purse-mode-v1";

  function loadedSubjectIds() {
    return Object.keys(window.PURSE_SUBJECTS || {});
  }

  function subjectIdsInArea(area) {
    return loadedSubjectIds().filter((id) => SUBJECT_AREA[id] === area);
  }

  function loadMode() {
    let mode = null;
    try {
      const raw = localStorage.getItem(MODE_KEY);
      if (raw) mode = JSON.parse(raw);
    } catch (e) {
      /* ignore corrupt save, use default */
    }
    if (!mode || !mode.top) mode = { top: "science", sub: "chemistry" };
    return mode;
  }

  function saveMode() {
    localStorage.setItem(MODE_KEY, JSON.stringify(mode));
  }

  // Resolves the current mode to the list of subject ids questions are drawn from.
  function activeSubjectIds() {
    if (mode.top === "everything") return loadedSubjectIds();
    const ids = subjectIdsInArea(mode.top);
    if (mode.sub && mode.sub !== "mix" && ids.indexOf(mode.sub) !== -1) return [mode.sub];
    return ids;
  }

  const els = {
    subjectTitle: document.getElementById("subject-title"),
    pickerTop: document.getElementById("picker-top"),
    pickerSub: document.getElementById("picker-sub"),
    levelBadge: document.getElementById("level-badge"),
    xpFill: document.getElementById("xp-fill"),
    xpLabel: document.getElementById("xp-label"),
    collectionCount: document.getElementById("collection-count"),
    viewCollectionBtn: document.getElementById("view-collection-btn"),
    saveProgressBtn: document.getElementById("save-progress-btn"),
    restoreProgressBtn: document.getElementById("restore-progress-btn"),
    collectionModal: document.getElementById("collection-modal"),
    collectionGrid: document.getElementById("collection-grid"),
    collectionCloseBtn: document.getElementById("collection-close-btn"),
    howToBtn: document.getElementById("how-to-btn"),
    instructionsModal: document.getElementById("instructions-modal"),
    instructionsCloseBtn: document.getElementById("instructions-close-btn"),
    dragonWrap: document.getElementById("dragon-wrap"),
    dragon: document.getElementById("dragon"),
    speech: document.getElementById("speech"),
    tableReveal: document.getElementById("table-reveal"),
    tableCanvas: document.getElementById("table-canvas"),
    topic: document.getElementById("question-topic"),
    prompt: document.getElementById("question-prompt"),
    options: document.getElementById("options"),
    feedback: document.getElementById("feedback-panel"),
    feedbackHeading: document.getElementById("feedback-heading"),
    feedbackText: document.getElementById("feedback-text"),
    nextBtn: document.getElementById("next-btn"),
    levelupFlash: document.getElementById("levelup-flash"),
    levelupOverlay: document.getElementById("levelup-overlay"),
    levelupEgg: document.getElementById("levelup-egg"),
    levelupParticles: document.getElementById("levelup-particles"),
    levelupTitle: document.getElementById("levelup-title"),
    levelupName: document.getElementById("levelup-name")
  };

  let progress = loadProgress();
  let mode = loadMode();
  const subjectQueues = {}; // subjectId -> shuffled array (queue), consumed via pop()
  let current = null;
  let lastPrompt = null;

  function setMode(top, sub) {
    mode = { top: top, sub: sub || "mix" };
    saveMode();
    renderPicker();
    nextQuestion();
  }

  function renderPicker() {
    els.pickerTop.innerHTML = "";
    ["science", "hass", "everything"].forEach((top) => {
      if (top !== "everything" && subjectIdsInArea(top).length === 0) return;
      const btn = document.createElement("button");
      btn.className = "picker-btn" + (mode.top === top ? " active" : "");
      btn.type = "button";
      btn.textContent = top === "everything" ? "🎲 Mix Everything" : AREA_TAB_LABELS[top];
      btn.addEventListener("click", () => setMode(top, top === "everything" ? null : "mix"));
      els.pickerTop.appendChild(btn);
    });

    els.pickerSub.innerHTML = "";
    if (mode.top !== "everything") {
      const ids = subjectIdsInArea(mode.top);
      ids.forEach((id) => {
        const btn = document.createElement("button");
        btn.className = "picker-btn" + (mode.sub === id ? " active" : "");
        btn.type = "button";
        btn.textContent = SUBJECT_LABELS[id];
        btn.addEventListener("click", () => setMode(mode.top, id));
        els.pickerSub.appendChild(btn);
      });
      if (ids.length > 1) {
        const mixBtn = document.createElement("button");
        mixBtn.className = "picker-btn" + (mode.sub === "mix" ? " active" : "");
        mixBtn.type = "button";
        mixBtn.textContent = "🎲 Mix " + AREA_LABELS[mode.top];
        mixBtn.addEventListener("click", () => setMode(mode.top, "mix"));
        els.pickerSub.appendChild(mixBtn);
      }
    }

    if (mode.top === "everything") {
      els.subjectTitle.textContent = "Mix Everything";
    } else if (mode.sub === "mix") {
      els.subjectTitle.textContent = "Mix " + AREA_LABELS[mode.top];
    } else {
      els.subjectTitle.textContent = AREA_LABELS[mode.top] + ": " + SUBJECT_LABELS[mode.sub];
    }
  }

  function loadProgress() {
    let data = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) data = JSON.parse(raw);
    } catch (e) {
      /* ignore corrupt save, start fresh */
    }
    if (!data) data = {};
    data.xp = data.xp || 0;
    data.hatchStep = data.hatchStep || 0;
    data.unlockedIndices = data.unlockedIndices || [];
    data.totalHatches = data.totalHatches || 0;
    return data;
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  // Compact obfuscated save code, not human-readable JSON — a curious kid
  // opening the exported file shouldn't be able to just add numbers to a
  // plain "unlockedIndices" array and grant themselves every dragon.
  const SAVE_PREFIX = "DA1-";
  const SAVE_XOR_BASE = 0xA5;

  function encodeSaveCode() {
    const bytes = new Uint8Array(13);
    bytes[0] = 1;
    bytes[1] = (progress.xp >> 8) & 0xff;
    bytes[2] = progress.xp & 0xff;
    bytes[3] = progress.hatchStep & 0xff;
    bytes[4] = (progress.totalHatches >> 8) & 0xff;
    bytes[5] = progress.totalHatches & 0xff;
    (progress.unlockedIndices || []).forEach((i) => {
      if (i >= 0 && i < 56) bytes[6 + Math.floor(i / 8)] |= 1 << (i % 8);
    });
    for (let i = 0; i < bytes.length; i++) bytes[i] ^= (SAVE_XOR_BASE + i) & 0xff;
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return SAVE_PREFIX + btoa(bin).replace(/=+$/, "");
  }

  function decodeSaveCode(code) {
    const trimmed = (code || "").trim();
    if (!trimmed.startsWith(SAVE_PREFIX)) return null;
    let bin;
    try {
      bin = atob(trimmed.slice(SAVE_PREFIX.length));
    } catch (e) {
      return null;
    }
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    for (let i = 0; i < bytes.length; i++) bytes[i] ^= (SAVE_XOR_BASE + i) & 0xff;
    if (bytes.length < 13 || bytes[0] !== 1) return null;
    const unlockedIndices = [];
    for (let i = 0; i < 50; i++) {
      if (bytes[6 + Math.floor(i / 8)] & (1 << (i % 8))) unlockedIndices.push(i);
    }
    return {
      xp: (bytes[1] << 8) | bytes[2],
      hatchStep: bytes[3],
      totalHatches: (bytes[4] << 8) | bytes[5],
      unlockedIndices,
    };
  }

  function downloadSaveFile() {
    const code = encodeSaveCode();
    const stamp = new Date().toISOString().slice(0, 10);
    const contents =
      "Dragon Academy - Save Code\n" +
      "Saved: " + stamp + "\n\n" +
      code + "\n\n" +
      "To restore this progress, open Dragon Academy, tap \"Restore Progress\",\n" +
      "and paste this code in.\n";
    const blob = new Blob([contents], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dragon-academy-save-" + stamp + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function restoreFromPrompt() {
    const pasted = window.prompt("Paste your Dragon Academy save code:");
    if (pasted === null) return;
    const match = pasted.match(/DA1-[A-Za-z0-9+/_-]+/);
    const decoded = decodeSaveCode(match ? match[0] : pasted);
    if (!decoded) {
      window.alert("That doesn't look like a valid save code — nothing was changed.");
      return;
    }
    if (!window.confirm("Restore this save? Your current progress on this device will be replaced.")) {
      return;
    }
    progress = decoded;
    saveProgress();
    location.reload();
  }

  function levelFromXp(xp) {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function refillSubjectQueue(subjectId) {
    subjectQueues[subjectId] = shuffle(window.PURSE_SUBJECTS[subjectId].questions);
  }

  // Draws one question. When multiple subjects are active (a "mix" mode), each
  // draw picks a subject with EQUAL weight regardless of how large its bank is,
  // so a mix feels like an even blend rather than skewing toward the biggest bank.
  function drawQuestion() {
    const ids = activeSubjectIds();
    const subjectId = ids[Math.floor(Math.random() * ids.length)];
    if (!subjectQueues[subjectId] || subjectQueues[subjectId].length === 0) {
      refillSubjectQueue(subjectId);
    }
    const q = subjectQueues[subjectId].pop();
    const src = window.PURSE_SUBJECTS[subjectId];
    q._subjectId = subjectId;
    q._subjectTitle = src.title;
    q._topic = q.topic || src.topic;
    return q;
  }

  function setDragonMood(mood) {
    els.dragon.classList.remove("idle", "happy", "gentle");
    void els.dragon.offsetWidth; // restart animation
    els.dragon.classList.add(mood);
  }

  // Main-screen dragon slot currently shows the firewood/egg progress toward
  // the next hatch, not the mascot art (js/dragon.js) — that's paused, not
  // removed, pending a decision on where its sprites fit in the layout.
  function renderDragonStage() {
    const step = HATCH_SEQUENCE[progress.hatchStep] || HATCH_SEQUENCE[0];
    els.dragon.innerHTML = "";
    const img = document.createElement("img");
    img.className = "dragon-img";
    img.src = HATCH_SEQUENCE_DIR + step.file;
    img.alt = step.caption;
    els.dragon.appendChild(img);
  }

  function renderHud() {
    const level = levelFromXp(progress.xp);
    const xpIntoLevel = progress.xp % XP_PER_LEVEL;
    const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

    els.levelBadge.textContent = "Level " + level;
    els.xpFill.style.width = pct + "%";
    els.xpLabel.textContent = xpIntoLevel + " / " + XP_PER_LEVEL + " XP";

    const unlockedCount = progress.unlockedIndices.length;
    els.collectionCount.textContent = unlockedCount + " / " + REWARDS_50.length +
      " creatures collected · " + progress.totalHatches + " eggs hatched";
    els.viewCollectionBtn.textContent = "View Collection (" + unlockedCount + "/" + REWARDS_50.length + ")";
  }

  function renderCollectionGrid() {
    els.collectionGrid.innerHTML = "";
    FAMILY_ORDER.forEach((familyKey, f) => {
      const section = document.createElement("div");
      section.className = "family-section";

      const header = document.createElement("div");
      header.className = "family-header";
      header.textContent = FAMILY_LABELS[familyKey];
      header.style.setProperty("--family-color", FAMILY_EFFECTS[familyKey].color);
      section.appendChild(header);

      const row = document.createElement("div");
      row.className = "family-row";
      for (let p = 0; p < 5; p++) {
        const i = f * 5 + p;
        const base = REWARDS_50[i];
        const unlocked = progress.unlockedIndices.indexOf(i) !== -1;
        const item = document.createElement("div");
        item.className = "collection-item";
        const tile = document.createElement("div");
        tile.className = "collection-tile " + (unlocked ? "unlocked" : "locked");
        tile.title = unlocked ? base.name : "Not hatched yet";
        const img = document.createElement("img");
        img.src = HATCHLING_DIR + hatchlingFile(i);
        img.alt = unlocked ? base.name : "Locked";
        tile.appendChild(img);
        item.appendChild(tile);
        const label = document.createElement("div");
        label.className = "collection-name";
        label.textContent = unlocked ? base.name : "???";
        item.appendChild(label);
        row.appendChild(item);
      }
      section.appendChild(row);
      els.collectionGrid.appendChild(section);
    });
  }

  function spawnBurst(effect) {
    els.levelupParticles.innerHTML = "";
    const count = effect.grand ? 16 : 10;

    if (effect.particle) {
      for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.className = "particle";
        span.textContent = effect.particle;
        const angle = Math.random() * Math.PI * 2;
        const distance = 55 + Math.random() * 55;
        span.style.setProperty("--tx", (Math.cos(angle) * distance).toFixed(1) + "px");
        span.style.setProperty("--ty", (Math.sin(angle) * distance).toFixed(1) + "px");
        span.style.setProperty("--rot", (Math.random() * 260 - 130).toFixed(0) + "deg");
        span.style.animationDelay = (i * 25) + "ms";
        els.levelupParticles.appendChild(span);
      }
    }

    // Elements with no particle emoji (or the finale) get radiating glow rings.
    if (!effect.particle || effect.grand) {
      const ringCount = effect.grand ? 3 : 2;
      for (let i = 0; i < ringCount; i++) {
        const ring = document.createElement("div");
        ring.className = "glow-ring";
        ring.style.setProperty("--ring-color", effect.color);
        ring.style.animationDelay = (i * 150) + "ms";
        els.levelupParticles.appendChild(ring);
      }
    }

    if (effect.flash) {
      els.levelupFlash.classList.remove("flash");
      void els.levelupFlash.offsetWidth; // restart animation
      els.levelupFlash.classList.add("flash");
    }
  }

  const HATCH_SEQUENCE_DIR = "assets/hatch-sequence/";
  const HATCH_SEQUENCE = [
    { file: "1-sticks.png", caption: "Sticks collected for a fire" },
    { file: "2-log.png", caption: "Bigger log added" },
    { file: "3-fire-lit.png", caption: "Fire lit" },
    { file: "4-egg-in-fire.png", caption: "Dragon egg being put in the fire" },
    { file: "5-egg-cracking.png", caption: "The egg is starting to crack..." }
  ];
  const EMBER_FLICKER = { particle: "🔥", color: "#e2725b" };

  function showSequenceImage(file, caption, extraClass) {
    els.levelupEgg.innerHTML = "";
    els.levelupEgg.className = "levelup-egg" + (extraClass ? " " + extraClass : "");
    const img = document.createElement("img");
    img.className = "levelup-reveal-img";
    img.src = HATCH_SEQUENCE_DIR + file;
    img.alt = caption;
    els.levelupEgg.appendChild(img);
    els.levelupName.textContent = caption;
  }

  // Each level-up (one full XP-bar fill) advances the fire/egg sequence by a
  // single step. Only once the sequence completes does a dragon actually
  // hatch — picked from a weighted pool where low-numbered family members
  // (eg. "Ember Rex") are common and high-numbered ones (eg. "Magma Lord")
  // are rare, so duplicates of common dragons are expected along the way.
  function showLevelUp(level, subjectId) {
    if (window.PurseBackgrounds) window.PurseBackgrounds.cycle();
    els.levelupParticles.innerHTML = "";
    els.levelupTitle.textContent = "Level " + level;

    // Advance first, then display at the new value — so the popup shows the
    // exact same stage the main dragon slot will show afterward (previously
    // this displayed the pre-increment stage while advancing past it, so the
    // main slot always looked one stage ahead of what the popup had shown).
    progress.hatchStep++;
    saveProgress();

    if (progress.hatchStep < HATCH_SEQUENCE.length) {
      const step = HATCH_SEQUENCE[progress.hatchStep];
      const isCrackStep = progress.hatchStep === HATCH_SEQUENCE.length - 1;

      showSequenceImage(step.file, step.caption, isCrackStep ? "shake" : "pop");
      spawnBurst(EMBER_FLICKER);
      els.levelupOverlay.classList.add("show");
      return;
    }

    // The sequence is complete — reveal what actually hatched.
    const index = pickWeightedIndex(subjectId);
    const isNew = progress.unlockedIndices.indexOf(index) === -1;
    if (isNew) progress.unlockedIndices.push(index);
    progress.totalHatches++;
    progress.hatchStep = 0;
    saveProgress();
    renderHud();
    renderCollectionGrid();

    const reward = getRewardBase(index);
    els.levelupEgg.className = "levelup-egg";
    els.levelupEgg.innerHTML = "";
    const img = document.createElement("img");
    img.className = "levelup-reveal-img";
    img.src = reward.img;
    img.alt = reward.name;
    els.levelupEgg.appendChild(img);
    els.levelupEgg.classList.add("pop");
    els.levelupName.textContent = (isNew ? "You hatched a NEW " : "You hatched another ") + reward.name + "!";
    spawnBurst(reward.effect);
    els.levelupOverlay.classList.add("show");
  }

  // Replaces the dragon/speech-bubble area in place — rather than covering the
  // whole screen — so the options and the explanation stay visible alongside it.
  function showTableReveal(question) {
    if (!window.PurseElements) return;
    const cells = window.PurseElements.cellsForQuestion(question);
    if (!cells) return;
    window.PurseElements.loadBase().then(() => {
      if (question !== current) return; // moved on before the image finished loading
      if (window.PurseElements.draw(els.tableCanvas, cells)) {
        els.dragonWrap.classList.add("hidden-for-table");
        els.speech.classList.add("hidden-for-table");
        els.tableReveal.classList.add("show");
      }
    });
  }

  function hideTableReveal() {
    els.tableReveal.classList.remove("show");
    els.dragonWrap.classList.remove("hidden-for-table");
    els.speech.classList.remove("hidden-for-table");
  }

  els.tableCanvas.addEventListener("click", hideTableReveal);

  function nextQuestion() {
    els.feedback.classList.remove("show");
    hideTableReveal();
    els.nextBtn.style.display = "none";
    setDragonMood("idle");
    renderDragonStage();
    els.speech.textContent = "Pick the answer you think is right — no rush!";

    current = drawQuestion();
    if (current.prompt === lastPrompt) current = drawQuestion(); // avoid an immediate repeat
    lastPrompt = current.prompt;

    els.topic.textContent = current._subjectTitle + " · " + current._topic;
    els.prompt.textContent = current.prompt;

    const shuffledOptions = shuffle(current.options);
    els.options.innerHTML = "";
    shuffledOptions.forEach((optionText) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.type = "button";
      btn.textContent = optionText;
      btn.addEventListener("click", () => handleAnswer(btn, optionText));
      els.options.appendChild(btn);
    });
  }

  function handleAnswer(clickedBtn, selectedText) {
    const buttons = Array.from(els.options.querySelectorAll(".option-btn"));
    buttons.forEach((b) => (b.disabled = true));

    const isCorrect = selectedText === current.correct;

    if (isCorrect) {
      clickedBtn.classList.add("correct");
      setDragonMood("happy");
      els.speech.textContent = "Nice one! That's correct.";

      const prevLevel = levelFromXp(progress.xp);
      progress.xp += XP_PER_CORRECT;
      saveProgress();
      renderHud();
      const newLevel = levelFromXp(progress.xp);
      if (newLevel > prevLevel) showLevelUp(newLevel, current._subjectId);

      els.feedbackHeading.textContent = "Correct!";
      els.feedbackText.textContent = current.explanation;
      showTableReveal(current);
      els.feedback.classList.add("show");
      els.nextBtn.style.display = "inline-block";
    } else {
      clickedBtn.classList.add("incorrect");

      // Beat 1: let the red sink in before anything else moves.
      setTimeout(() => {
        setDragonMood("gentle");
        els.speech.textContent = "Not quite — here's the answer, no worries at all.";
        els.feedbackHeading.textContent = "Not quite — here's why:";
        els.feedbackText.textContent = current.explanation;
        els.feedback.classList.add("show");
        showTableReveal(current);

        // Beat 2: pause on the explanation, then the correct answer glows in.
        setTimeout(() => {
          buttons.forEach((b) => {
            if (b.textContent === current.correct) b.classList.add("reveal-glow");
          });

          // Beat 3: let the glow land before offering Next.
          setTimeout(() => {
            els.nextBtn.style.display = "inline-block";
          }, 1100);
        }, 900);
      }, 500);
    }
  }

  els.nextBtn.addEventListener("click", nextQuestion);

  els.levelupOverlay.addEventListener("click", () => {
    els.levelupOverlay.classList.remove("show");
  });

  els.viewCollectionBtn.addEventListener("click", () => {
    renderCollectionGrid();
    els.collectionModal.classList.add("show");
  });
  els.saveProgressBtn.addEventListener("click", downloadSaveFile);
  els.restoreProgressBtn.addEventListener("click", restoreFromPrompt);
  els.collectionCloseBtn.addEventListener("click", () => {
    els.collectionModal.classList.remove("show");
  });
  els.collectionModal.addEventListener("click", (e) => {
    if (e.target === els.collectionModal) els.collectionModal.classList.remove("show");
  });

  els.howToBtn.addEventListener("click", () => {
    els.instructionsModal.classList.add("show");
  });
  els.instructionsCloseBtn.addEventListener("click", () => {
    els.instructionsModal.classList.remove("show");
  });
  els.instructionsModal.addEventListener("click", (e) => {
    if (e.target === els.instructionsModal) els.instructionsModal.classList.remove("show");
  });

  // init
  renderPicker();
  if (window.PurseElements) window.PurseElements.loadBase();
  renderHud();
  renderCollectionGrid();
  nextQuestion();
})();
