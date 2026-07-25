/* Purse — periodic table highlight renderer
   Draws assets/periodic-table/full-table.png onto a canvas with the rest of
   the table dimmed except the target cell(s), which get a red box. Grid
   calibrated by sampling border-line pixel positions on the source image
   (see DragonPix/Periodic Table/generate_highlights.py for the derivation —
   these constants must match if the source image is ever replaced). */

window.PurseElements = (function () {
  const IMG_SRC = "assets/periodic-table/full-table.png";

  const COL_BOUNDS = [41, 114.5, 188, 261.5, 335.5, 408.5, 482.5, 555.5, 629.5, 702.5,
    776.5, 850, 923.5, 997, 1070.5, 1144.5, 1217.5, 1291.5, 1364.5]; // group 1..18 edges
  const ROW_BOUNDS = [185.5, 259, 332.5, 406, 479.5, 553.5, 626.5, 700.5]; // period 1..7 edges

  // English element name -> [period, group], for every element the quiz asks about directly.
  const NAME_POS = {
    Hydrogen: [1, 1], Helium: [1, 18],
    Lithium: [2, 1], Beryllium: [2, 2], Boron: [2, 13], Carbon: [2, 14], Nitrogen: [2, 15],
    Oxygen: [2, 16], Fluorine: [2, 17], Neon: [2, 18],
    Sodium: [3, 1], Magnesium: [3, 2], Aluminium: [3, 13], Silicon: [3, 14], Phosphorus: [3, 15],
    Sulfur: [3, 16], Chlorine: [3, 17], Argon: [3, 18],
    Potassium: [4, 1], Calcium: [4, 2], Scandium: [4, 3], Titanium: [4, 4], Vanadium: [4, 5],
    Chromium: [4, 6], Manganese: [4, 7], Iron: [4, 8], Cobalt: [4, 9], Nickel: [4, 10],
    Copper: [4, 11], Zinc: [4, 12], Gallium: [4, 13], Germanium: [4, 14], Arsenic: [4, 15],
    Selenium: [4, 16], Bromine: [4, 17], Krypton: [4, 18],
    Rubidium: [5, 1], Strontium: [5, 2], Yttrium: [5, 3], Zirconium: [5, 4], Niobium: [5, 5],
    Molybdenum: [5, 6], Ruthenium: [5, 8], Rhodium: [5, 9], Palladium: [5, 10], Silver: [5, 11],
    Cadmium: [5, 12], Indium: [5, 13], Tin: [5, 14], Antimony: [5, 15], Tellurium: [5, 16],
    Iodine: [5, 17], Xenon: [5, 18],
    Caesium: [6, 1], Barium: [6, 2], Tungsten: [6, 6], Platinum: [6, 10], Gold: [6, 11],
    Mercury: [6, 12], Thallium: [6, 13], Lead: [6, 14], Bismuth: [6, 15]
  };

  const TRANSITION_BLOCK = (() => {
    const cells = [];
    for (let p = 4; p <= 7; p++) for (let g = 3; g <= 12; g++) cells.push([p, g]);
    return cells;
  })();

  const CATEGORY_CELLS = {
    "alkali-metals": ["Lithium", "Sodium", "Potassium", "Rubidium", "Caesium"].map(n => NAME_POS[n]),
    "alkaline-earth-metals": ["Beryllium", "Magnesium", "Calcium", "Strontium", "Barium"].map(n => NAME_POS[n]),
    "halogens": ["Fluorine", "Chlorine", "Bromine", "Iodine"].map(n => NAME_POS[n]),
    "noble-gases": ["Helium", "Neon", "Argon", "Krypton", "Xenon"].map(n => NAME_POS[n]),
    "metalloids": ["Boron", "Silicon", "Germanium", "Arsenic", "Tellurium"].map(n => NAME_POS[n]),
    "post-transition-metals": ["Aluminium", "Gallium", "Indium", "Tin", "Thallium", "Lead", "Bismuth"].map(n => NAME_POS[n]),
    "nonmetals": ["Hydrogen", "Carbon", "Nitrogen", "Oxygen", "Phosphorus", "Sulfur", "Selenium"].map(n => NAME_POS[n]),
    "transition-metals": TRANSITION_BLOCK
  };

  function cellsForQuestion(question) {
    if (question.group) return CATEGORY_CELLS[question.group] || null;
    if (question.element) {
      const pos = NAME_POS[question.element];
      return pos ? [pos] : null;
    }
    return null;
  }

  function cellRect(period, group) {
    const x0 = COL_BOUNDS[group - 1], x1 = COL_BOUNDS[group];
    const y0 = ROW_BOUNDS[period - 1], y1 = ROW_BOUNDS[period];
    return [x0, y0, x1, y1];
  }

  let baseImg = null;
  let loadPromise = null;
  function loadBase() {
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { baseImg = img; resolve(img); };
      img.src = IMG_SRC;
    });
    return loadPromise;
  }

  function draw(canvas, cells) {
    if (!baseImg || !cells || !cells.length) return false;
    const w = baseImg.naturalWidth, h = baseImg.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImg, 0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(0, 0, w, h);

    const pad = 3;
    cells.forEach(([period, group]) => {
      const [x0, y0, x1, y1] = cellRect(period, group);
      ctx.drawImage(baseImg, x0 - pad, y0 - pad, (x1 - x0) + pad * 2, (y1 - y0) + pad * 2,
        x0 - pad, y0 - pad, (x1 - x0) + pad * 2, (y1 - y0) + pad * 2);
    });

    ctx.strokeStyle = "#e61e1e";
    ctx.lineWidth = 5;
    cells.forEach(([period, group]) => {
      const [x0, y0, x1, y1] = cellRect(period, group);
      ctx.strokeRect(x0 - pad, y0 - pad, (x1 - x0) + pad * 2, (y1 - y0) + pad * 2);
    });
    return true;
  }

  return { loadBase, cellsForQuestion, draw };
})();
