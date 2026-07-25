/* Purse — dragon mascot rig
   Two art "families" (assets/dragons/*.png), each with several colour
   variants. After a correct answer:
     - most of the time: nothing changes
     - sometimes: crossfade to another colour within the same family
       ("slowly changes colour")
     - rarely: crossfade to a different family entirely, a genuinely
       different dragon shape ("morphs into another shaped dragon")
*/

(function () {
  const ASSET_DIR = "assets/dragons/";

  const FAMILIES = [
    { key: "baby", variants: ["baby-purple.png", "baby-orange.png", "baby-red.png", "baby-blue.png"] },
    { key: "hand", variants: ["hand-green.png", "hand-purple.png", "hand-pink.png", "hand-teal.png"] }
  ];

  let el = null;
  let img = null;
  let familyIndex = 0;
  let variantIndex = 0;

  function currentSrc() {
    const family = FAMILIES[familyIndex];
    return ASSET_DIR + family.variants[variantIndex];
  }

  function randomOtherIndex(current, length) {
    if (length <= 1) return current;
    let next;
    do { next = Math.floor(Math.random() * length); } while (next === current);
    return next;
  }

  function swapTo(nextFamilyIndex, nextVariantIndex, slow) {
    el.classList.add("morphing");
    if (slow) el.classList.add("slow-fade");
    setTimeout(() => {
      familyIndex = nextFamilyIndex;
      variantIndex = nextVariantIndex;
      img.src = currentSrc();
      void el.offsetWidth; // force reflow so the fade-in transition runs
      el.classList.remove("morphing");
      if (slow) {
        setTimeout(() => el.classList.remove("slow-fade"), 750);
      }
    }, slow ? 700 : 320);
  }

  function init(containerEl) {
    el = containerEl;
    el.innerHTML = "";
    img = document.createElement("img");
    img.className = "dragon-img";
    img.alt = "Dragon companion";
    img.src = currentSrc();
    el.appendChild(img);
  }

  // Call after a correct answer.
  function onCorrectAnswer() {
    if (!el) return;
    const roll = Math.random();

    if (roll < 0.15) {
      // Morph: a different family altogether — a new silhouette.
      const nextFamily = randomOtherIndex(familyIndex, FAMILIES.length);
      const nextVariant = Math.floor(Math.random() * FAMILIES[nextFamily].variants.length);
      swapTo(nextFamily, nextVariant, false);
    } else if (roll < 0.45) {
      // Colour drift: stay in the same family, pick another variant, slow fade.
      const nextVariant = randomOtherIndex(variantIndex, FAMILIES[familyIndex].variants.length);
      swapTo(familyIndex, nextVariant, true);
    }
  }

  window.PurseDragon = { init: init, onCorrectAnswer: onCorrectAnswer };
})();
