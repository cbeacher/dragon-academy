# Purse (Dragon Academy) — Progress / Handoff

**Status as of 2026-07-24 (evening).**

## ⏸ RESUME POINT (2026-07-24, evening) — read this first
Picked back up from the 2026-07-23 pause for a short polish/bugfix round (see the dated entries
below for full detail on each). Nothing left mid-flight; this is a clean stopping point.

**What changed this round:**
- **Collection tiles + level-up reveal now have a white backing** behind the transparent dragon
  PNGs (`.collection-tile` and `.levelup-reveal-img` in `css/style.css`) — previously the tile
  background was dark leather (`#1c130c`), which let dark-toned dragons (Clinton's example:
  Frostbite) nearly vanish into the tile. This was the same bug PBird had and already fixed —
  ported the identical fix back here. Purse didn't need PBird's extra `.bird-reveal` class split
  since Purse's hatch-sequence images are still plain opaque fire/log photos (never replaced with
  transparent-cornered art the way PBird's nest sequence was), so one shared white background is
  safe everywhere here.
- **Locked (not-yet-collected) tiles now get a deep red-brown, near-opaque wash**
  (`.collection-tile.locked::before`, `rgba(107, 31, 18, 0.9)`) layered over the white backing —
  makes uncollected dragons genuinely hard to make out, not just slightly desaturated. Went through
  a couple of quick rounds live (started brown/60%, then "redder, more opaque" → deep red at 0.78 →
  "more opaque" → 0.9, current value). The existing "?" mark is `z-index`'d above the wash so it
  stays legible.
- **Music volume raised** `0.16 → 0.26` (`MUSIC_VOLUME` in `js/audio.js`) — Clinton asked for music
  "a bit more often"; turned out the playlist already chains continuously with no gaps (`ended` →
  next random track, never repeating immediately), so the actual issue was just that 0.16 was quiet
  enough to go unnoticed for long stretches, not an infrequency bug.
- **`fireplace-crackle.mp3` added as a 6th entry in `MUSIC_TRACKS`**, alongside its existing separate
  role as the constant looping ambience behind the fire portal — Clinton's stated rule is that any
  source file he's prefaced "music " in `Purse/Audio/` counts as a rotation track, and that file's
  source name does start with "music " even though it was originally only wired in as ambience.
  One asset, two independent `Audio()` instances/roles, no conflict. **Total real distinct tracks
  in the playlist is still 5** (kohoutek, piano, winter-winds, wind-blowing, distant-bells) plus
  this one repurposed ambience recording — audited the entire `Purse/Audio/` source folder file-by-
  file and confirmed nothing else is sitting there unused/unwired.

**Still parked from the 2026-07-23 pause, unchanged:**
- **Mathematics subject** — the SEQTA-scope blocker actually resolved without anyone noticing: a
  real file, `Maths/Year 10 Advanced Program 2026.pdf` (Lumen Christi's official whole-year Year 10
  program — 4 terms, topic-by-topic with WA Curriculum links and a 6-test assessment schedule),
  landed in `~/Purse/Maths/` around 2026-07-23 20:56 and was never processed. This answers the old
  "current unit vs. fuller spread" scope question — it defines the fuller spread. **Not yet
  built** — Clinton hasn't confirmed he wants the full-year build started; asked and awaiting his
  call the last time this came up.
- **Year 6 bird-themed sibling app** — this is resolved, just via a different route than originally
  planned: built as **PBird**, a fully separate project at `~/PBird`, not a themed fork of this
  codebase. See PBird's own `PROGRESS.md`/memory for its state — don't expect to find it referenced
  further in this file.

To resume further work: say "pick up the Purse project" — read this file top-to-bottom for full
state, same as before.

## 2026-07-24 evening — collection/reveal white backing, locked-tile wash, music tweaks
Short session, picked up directly from the 2026-07-23 pause via a Purse screenshot Clinton sent
showing Frostbite (a dark-toned dragon) barely visible on its collection tile.

- **White backing ported from PBird.** `.collection-tile` background changed `#1c130c` (dark
  leather) → `#ffffff`; `.levelup-reveal-img` gained `background: #ffffff; padding: 10px`. Exact
  same problem PBird hit and fixed earlier the same day (transparent dragon PNGs need a reliable
  opaque backing since some dragons are dark-toned themselves) — this time no need for PBird's
  `.bird-reveal`-class split, since Purse's `HATCH_SEQUENCE` images (`1-sticks.png` etc.) are still
  the original opaque fire/log photos, never replaced with transparent-cornered art. Verified via
  `HATCH_SEQUENCE` array contents before applying, rather than assuming.
- **Locked-tile wash, iterated live in a few quick rounds:** Clinton asked for "an opaque 60% brown
  wash" over not-yet-collected tiles to make them hard to see. Added `.collection-tile.locked::before`
  (full-tile overlay, `z-index: 1`) at `rgba(61, 42, 26, 0.6)`, existing "?" corner mark bumped to
  `z-index: 2` so it stays legible on top. Follow-ups: "make the wash redder, and more opaque" →
  `rgba(107, 31, 18, 0.78)` → "more opaque" → `rgba(107, 31, 18, 0.9)` (current, near-fully opaque).
- **Music volume 0.16 → 0.26.** Clinton: "have some backing music playing a bit more often... do
  you have enough?" Checked `js/audio.js` first rather than guessing — `playNextMusicTrack()`
  already chains every track straight into a new random pick on `ended`, no silence gaps, running
  continuously from first click/keypress onward. So "not often enough" was a volume-perception issue,
  not a scheduling bug. 5 real distinct tracks were already live (kohoutek, piano, winter-winds,
  wind-blowing, distant-bells), shuffled with no immediate repeats (`pickDifferent()`).
- **`fireplace-crackle.mp3` added to `MUSIC_TRACKS` as a 6th entry.** Clinton clarified his rule for
  what counts as a music track: anything he's prefaced "music " in the raw `Purse/Audio/` source
  folder. Audited that whole folder file-by-file against what's deployed in `assets/audio/` —
  every one of the 13 raw files is already wired in somewhere (5 music / 7 dragon SFX / 1 fireplace
  ambience), nothing sitting unused. Three raw files actually carry the "music " prefix: kohoutek,
  piano, and the fireplace-crackle source (`music restfuldreamingtunes-...-fireplace...273945.mp3`)
  — the last one hadn't been added to the rotation because it was originally wired in only as the
  constant ambience loop behind the fire portal. Per Clinton's rule it belongs in the rotation too;
  added the same asset file to `MUSIC_TRACKS` alongside its existing separate ambience role — one
  file, two independent `Audio()` instances, no technical conflict. If it sounds odd as a "music"
  track in shuffle (it's a texture/ambience recording, not a melody), worth a follow-up listen.
- **Live-verification note:** couldn't get clean screenshots this round — Chrome kept losing focus
  to Clinton's other live windows (Outlook, a Microsoft 365 admin panel, VS Code) since he was
  actively using the same physical screen at the same time. Stopped attempting screenshots rather
  than keep grabbing his live work inbox/admin sessions by accident. All changes here are verified
  via CSS brace-balance checks and `node --check`, not a live visual pass — worth Clinton confirming
  the wash/white-backing/music actually look and sound right next time he opens it.

## 2026-07-23 update — transparent-cutout dragon art, How to Play modal, ambient audio
Three separate features landed this session.

- **New dragon collection art, cut out as transparent PNGs.** Clinton dropped a fresh
  50-dragon reference sheet at `DragonPix/images260726/New pix.png` (1536×1024, 10×5
  grid, same 50 names/families as `REWARDS_50` in `js/game.js`) and asked for it "split
  down." Mechanically cropped all 50 cells (uniform grid math, `assets` names verified
  to match `hatchlingFile()`'s output exactly). Compared against the live
  `assets/hatchlings/` art first — the dragon designs/poses are the same characters,
  but the current live set has each dragon baked onto a dark card with its name printed
  underneath, while the new sheet has a plain white background per cell. Flagged this to
  Clinton rather than assuming; he chose **transparent cutouts** (crop out the label
  text entirely, key out the white background, no card) over re-matching the old dark-
  card style. Implemented via a "white-matte removal" formula (`alpha = 1 - min(r,g,b)`,
  then un-blend the color using that alpha) rather than a flat threshold — handles the
  soft anti-aliased edges around wings/horns cleanly, confirmed by compositing a few
  sample cutouts over a solid mid-green test background and checking for no white
  fringing. Checked `.collection-tile`/`.levelup-reveal-img` CSS first: both already
  supply their own dark plaque/leather background independent of the image, so the new
  transparent art drops in with zero CSS changes needed — old dark-card set backed up
  to `assets/hatchlings.bak-2026-07-23` before overwriting, in case Clinton wants to
  compare or revert.
- **"How to Play" instructions modal**, added per Clinton's ask. New `❓ How to Play`
  button top-left of `.hud-top` (mirrors the existing subject-label pill top-right).
  Opens a modal (`#instructions-modal`) built the same way as the Dragon Collection
  modal — same leather/stitched-frame treatment (folded into the shared `::before`/
  `::after` selector list) and gold-foil `MedievalSharp` header — covering answering
  (wrong answers cost nothing), XP/levelling, hatching/rarity, and how the subject
  picker + subject-locked dragons work. Click-outside-to-close and a ✕ button, same
  pattern as the collection modal.
- **Ambient audio** (`js/audio.js`, new). Clinton supplied a folder of sound effects and
  clarified the intended roles for each category: **quiet looping background "music"**
  (a shuffled playlist of the longer tracks — piano improvisation, "kohoutek", winter
  winds, wind-blowing, distant bells — each track chaining into a randomly-picked next
  one on `ended`, never repeating the same track twice in a row), a **constant quiet
  fireplace-crackle loop** (native `loop = true`, low volume) meant to sit behind the
  fire-portal `.dragon-wrap` element, and **random dragon roar/wing-flap/fire-breath
  SFX** (7 short clips, one played at a random 15–40s interval — same cadence pattern
  already used by `js/flying-dragons.js`'s silhouette spawner, so the two features feel
  like they belong together even though they're wired independently). All audio starts
  on the first click/keydown rather than page load, since browsers block unprompted
  autoplay-with-sound — `PurseAudio.start()` is idempotent and exposed on `window` in
  case it's ever worth triggering explicitly (e.g. from a "tap to begin" prompt) rather
  than relying on the first incidental click. Source files copied into `assets/audio/`
  with simplified names; originals untouched in `~/Purse/Audio/`.
- **Live Chrome screenshot attempted, not achieved.** Tried the usual
  `screencapture`/AppleScript route to show Clinton the current state, but Chrome's
  window this session sits at a fixed position (`bounds` stuck at
  `{-2560, -332, 0, 956}`) that silently reverts every `set bounds`/`activate` attempt —
  looks like something in this environment (possibly a managed/virtual display) is
  pinning it, not a normal user window. Gave up after several attempts rather than
  burning further time; Clinton can check visually himself or troubleshoot `/chrome`
  fresh if he wants a live screenshot next time.
- **Not yet play-tested live in a browser** — everything above is validated via Node
  syntax checks + Python-side pixel inspection of the cutouts, not an actual click-
  through. Worth confirming next session: do the transparent dragons look right at
  collection-tile and level-up-reveal size, does the How to Play modal read clearly
  against the leather background, and does the audio actually start on first click and
  loop/cycle correctly (in particular whether 0.14–0.4 volumes feel balanced against
  each other once real audio hardware is in the loop, not just reasoned about on paper).

## 2026-07-23 update — flying dragons: diagonal climb + fixed layering-through-cards bug
Two fixes on the flying-dragon feature:
- **Diagonal flight.** Clinton pointed out the artwork's pose already implies a climb (nose drawn
  up-and-right), so flat horizontal drift didn't match. Added a `--fly-rise` custom property
  (randomized 30–60vh in `flying-dragons.js`) and changed both keyframes in `style.css` to animate
  `translateY` alongside `translateX` — the un-mirrored `fly-ltr` climbs up-right (matching the
  art's native orientation), `fly-rtl` (already `scaleX(-1)`) naturally climbs up-left once
  mirrored. Start position (`--fly-top`) moved lower (45–90vh) so the climb has room to read before
  fading out.
- **Was rendering in front of the leather, not behind it.** Root cause: `.flying-dragons` used
  `z-index: -1`, same as the `z-index: -1` on `.hud::after`/`.stage::after` (the leather texture
  layer added earlier this session). Neither `.hud`/`.stage` nor `<body>` establish their own
  stacking context, so both ended up as siblings in the *same* (root) stacking context — at equal
  z-index, paint order falls back to DOM order, and `.flying-dragons` (appended to `<body>` last,
  after `.app`) was winning that tie and painting over the leather. Fixed by dropping it to
  `z-index: -2`, which is strictly behind regardless of DOM order. Confirmed live: the silhouette
  now only shows in the open background margins, never over a card's surface.

## 2026-07-23 update — real dragon silhouette wired in, replacing the emoji placeholder
Clinton generated a proper dragon silhouette image. Processed and wired in:
- Saved to `assets/effects/dragon-silhouette.png`, cropped to its bounding box (744×1052 →
  580×558). **Gotcha caught before it shipped:** first attempt tried to manually punch out a white
  background (checking `r,g,b > 240`), but the source image already had a proper transparent
  background (`(0,0,0,0)` at the corners, confirmed by inspecting raw pixel values) — my white-
  detection logic didn't match the actual (black, alpha-0) background pixels, so the `else` branch
  incorrectly forced them to `alpha=255`, silently filling in the transparency with solid black.
  Caught by compositing the "transparent" result over a colored test background and seeing solid
  black instead of a cutout, before it ever reached the app. Fixed by just cropping the original
  (already-correct) RGBA image with no recoloring step.
- `js/flying-dragons.js`: swapped the `<span>🐉</span>` emoji element for an `<img
  src="assets/effects/dragon-silhouette.png">`, sized via `style.width` (36–70px) instead of
  `font-size`. Spawn/animation/removal logic unchanged.
  Removed the now-unneeded `filter: brightness(0)` from `.flying-dragon` in `style.css` (the asset
  is already black) and bumped the mid-flight opacity from 0.45 → 0.6 since there's actual
  silhouette detail worth seeing now, not just a small emoji blob.
- Confirmed live via a manually-spawned instance (6s flight so it doesn't disappear before a
  screenshot lands) — reads clearly as a dragon in flight behind the HUD card. Concept + asset both
  confirmed good now; no known open issues on this feature.

## 2026-07-23 update — flying dragon silhouettes (concept confirmed, asset pending)
New ask: small black dragon silhouettes occasionally drifting across the background, behind the
cards. Built end to end:
- `js/flying-dragons.js` — spawns a silhouette element periodically (first one 3-7s after load,
  then every 15-40s), randomized vertical position/size/duration/direction (left-to-right or
  right-to-left, mirrored via `scaleX(-1)`), removes itself after the animation completes.
- `css/style.css` — `.flying-dragons` container is `position: fixed` on `body`, `z-index: -1` so it
  paints behind `.app`'s static content but above the body's own background image (a negative
  z-index descendant paints behind normal-flow siblings, but still above the ancestor's own
  background — see the comment in the CSS). `fly-across-ltr`/`fly-across-rtl` keyframes handle the
  cross-screen translate + fade in/out at the edges.
- **Placeholder used the 🐉 emoji** (forced to a black silhouette via `filter: brightness(0)`) just
  to prove out the timing/animation/layering. Clinton confirmed the concept works (spotted one
  crossing live) but said the emoji itself "is no good" as a silhouette — he's generating a proper
  image asset instead. **Next step:** once he provides a PNG/SVG, swap the `<span>🐉</span>` in
  `flying-dragons.js` for an `<img src="assets/...">` pointing at it — the spawn/animation/removal
  logic doesn't need to change, only the element type.
- **Chrome multi-tab/multi-display gotcha recurred this round** — even after calling `activate` on
  Chrome, a several-second `sleep` before screenshotting let another app (Firefox, one of Clinton's
  other windows) regain focus in between, so the capture showed the wrong app again. Re-activating
  Chrome a second time immediately before the screenshot (right after the wait, not just once at
  the start) fixed it. Worth doing this "activate right before capture" pattern any time there's a
  multi-second gap (e.g. waiting for an animation/timer) between triggering something and
  screenshotting it in this environment.

## 2026-07-23 update — removed the "!" from the level-up title entirely
The space-before-"!" fix from earlier still looked like a stray vertical line to Clinton rather than
a clear exclamation mark — MedievalSharp's "!" glyph just doesn't read well next to a number at this
size/style, spacing or not. Simplest fix: drop the "!" entirely. `js/game.js` `showLevelUp()` now
sets `els.levelupTitle.textContent = "Level " + level` (no trailing punctuation). Confirmed live —
"Level 15" reads cleanly with nothing that could be mistaken for a line or extra digit.

## 2026-07-23 update — stronger shadow on "Level X!" + live-testing tooling fix
Clinton flagged the level-up title specifically needed a stronger dark shadow to pop — it already
shared the same text-shadow rule as the main title (confirmed only one other `.levelup-title` block
exists and it doesn't touch color/shadow), so this was a "push it further" request, not a missed
selector. Pushed the shared shadow from `3px 4px 4px rgba(0,0,0,0.8)` to `4px 5px 3px
rgba(0,0,0,0.95)` (bigger offset, less blur, near-opaque) — reads as a much harder, more defined
shadow now, confirmed live on "Level 14!".

**Live-testing tooling gotcha, worth remembering for next time:** screenshots started coming back
showing an unrelated Firefox window (a work Sprint Dashboard, not Purse) even though the AppleScript
was correctly finding the Chrome window/tab with "Purse" in its URL and reordering it to the front
*within Chrome*. Root cause: `set index of window wi to 1` only reorders Chrome's own windows
relative to each other — it doesn't raise the Chrome *application* above other apps (like Firefox)
that happen to be stacked on top of it at the OS level on that display. Fix: call `activate` on the
Chrome application first, *then* find/reorder the Purse tab's window. Also worth noting Clinton has
several other tabs open in the same Chrome window (Google Images searches for gold-leather
reference photos, a "Settings" tab) — reloading "the active tab" blindly can hit the wrong one if
Chrome wasn't just activated.

## 2026-07-23 update — darkened title shadow + gave the dragon-head emoji its own shadow
Two follow-ups on the gold title shadow: darkened the drop shadow (`rgba(0,0,0,0.55)` →
`rgba(0,0,0,0.8)`) for more pop, and added a shadow behind the 🐲 emoji next to "Dragon Academy" —
which needed a *different* mechanism, not just extending the existing rule. Color emoji render as
bitmap/color glyphs, and `text-shadow` only affects the outline of a regular (single-color) text
glyph — it silently does nothing on color emoji, which is why the emoji had no shadow even though
the whole `<h1>` already had a `text-shadow` rule. Fixed by wrapping the emoji in
`<span class="title-emoji">` (`index.html`) and applying `filter: drop-shadow(...)` instead, which
operates on actual rendered pixels regardless of glyph type — same offset/color as the text shadow
so the two read as one consistent light source.

## 2026-07-23 update — added a real drop shadow behind the gold title for "pop"
Small follow-up: the title had a soft blurred dark shadow (`0 3px 6px`) mixed in with the glow, which
read more as haze than a shadow. Changed to an offset, less-blurred drop shadow (`3px 4px 4px
rgba(0,0,0,0.55)`) so it reads as a distinct shadow sitting behind/below the letters — gives the
gold text a lifted, dimensional feel against the leather rather than looking flat-printed on it.

## 2026-07-23 update — gold title outline tuning (black → white, bold tried and reverted)
Fast iteration round on the `.hud-top h1` gold-foil title from the previous entry, all confirmed via
live screenshots:
- Tried a sharp black `-webkit-text-stroke` for definition against the leather — Clinton said it
  didn't work (too dark/muddy against Pinyon Script's thin cursive strokes).
- Switched to white stroke — confirmed much easier to read, but at 1px it was thick enough to wash
  out most of the gold fill, reading closer to plain white script than gold.
- Tried `font-weight: 700` to make it bolder/more present — Pinyon Script has no real bold on
  Google Fonts, so this is a synthetic/faux bold. It thickened the strokes but made the white
  outline dominate even more, losing the gold almost entirely. Clinton confirmed white > black for
  readability but wanted the gold back, so reverted to `font-weight: 400`.
- **Landed on:** thinner white stroke (`0.6px` instead of `1px`) + a more saturated gradient (top
  stop moved from near-white `#fff8dc` to a warmer `#ffe9a8`, other stops pushed toward richer gold/
  amber) — keeps the crisp readable edge Clinton wanted while letting the gold actually show through
  the fill instead of being overpowered by the outline. This is the current state, not yet
  re-confirmed with Clinton since the change just landed.
- **If a real bold weight is wanted later:** Pinyon Script doesn't offer one. Would need a different
  Google Font with an actual bold cut (most decorative script fonts are single-weight, so this may
  mean picking a less ornate script family) rather than relying on synthetic bold, which visibly
  degrades quality on thin cursive strokes.

## 2026-07-23 update — gold-foil title treatment overhauled, real embossed lettering
Clinton wasn't happy with the flat-gold + text-shadow approach on "Dragon Academy" / "Level X!" /
the collection header, and sent three reference photos of genuine embossed/foil-stamped leather
lettering (a "Success" emboss, a leather logo debossing, and a gold-foil "Law" book-spine stamp) —
then a fourth reference: a generated mockup of "Dragon Academy" itself in an elegant gold script.
- **Gradient fill, not flat color.** Flat `color` + `text-shadow` reads as "gold-colored text with a
  glow," not stamped foil. Switched to `background: linear-gradient(...)` clipped to the text via
  `background-clip: text` (white-cream at top fading to amber-gold at bottom) — the actual
  technique that sells a lit, dimensional letterform. Shared across `.hud-top h1`, `.levelup-title`,
  `.collection-modal-header h2` via one grouped selector.
  - First pass (gradient ending in dark `#7a4a12`) read muddy against the busy leather — the dark
    end of the gradient blended into the background. Brightened the bottom stop to `#c9862f` and
    added `-webkit-text-stroke: 1px rgba(20,10,5,0.55)` for a crisp edge so the letterform stays
    legible regardless of what leather grain sits behind it.
- **Font swapped for the main title only.** Clinton's follow-up reference showed an elegant flowing
  script (loops/flourishes on capitals), not the blackletter "MedievalSharp" used before. Added
  Google Font "Pinyon Script" and applied it to `.hud-top h1` specifically (size bumped to 3.4rem —
  script fonts read visually lighter/smaller than blackletter at the same size).
  **Deliberately left `.levelup-title`/`.collection-modal-header h2` on MedievalSharp** — those
  need to render numbers clearly ("Level 10!") and Pinyon Script's connected cursive strokes risk
  the same kind of glyph-fusion misread already hit and fixed once this session (the "Level 9!" →
  "Level 91" bug). Flagged to Clinton rather than silently deciding; open to extending the script
  font there too if he wants full consistency and it turns out legible enough in practice.
- **Also fixed:** the "Level 9!" exclamation mark was rendering nearly identical to "1" against a
  digit in MedievalSharp, misreading as "Level 91" — confirmed via Clinton's screenshots at two
  different sizes (so it wasn't a sizing issue). Fixed in `js/game.js` by inserting a space before
  the "!" so the glyphs no longer visually fuse.
- **Chrome-tab gotcha hit this round:** reloading "the active tab" via AppleScript reloaded a Google
  Images search tab instead of the app — Clinton had multiple tabs open in the same window and was
  actively searching for reference images while I worked. Fixed by finding the tab whose URL
  contains "Purse" and activating that specific tab/window before reloading, rather than assuming
  the front tab is always the app. Worth remembering for any future live-testing in this project.

## 2026-07-23 update — level-up/hatch popup brought into theme (last flat-white leftover)
Clinton sent a screenshot confirming the `.levelup-card` popup (shown on every level-up and dragon
hatch) was still the old flat `var(--card)` white style — exactly the item flagged as "noticed but
not yet fixed" in the previous entry. Fixed the same way as `.collection-modal-card`: folded
`.levelup-card` into the shared `::before`/`::after` selector list (stitched dashed frame + rivets,
leather layer with the saturate/brightness/contrast filter) rather than duplicating the recipe.
`.levelup-title` recolored gold + switched to "MedievalSharp" (matching the main title / collection
header), `.levelup-name` and `.levelup-hint` recolored from `var(--muted)` to light parchment tones
since they now sit directly on dark leather instead of flat cream.
- **Testing note:** verifying this needed an actual level-up to fire, which is awkward to force
  deterministically since the correct-option button isn't identifiable from outside the closure.
  Ran a capped loop in the live Chrome tab via JS (click Next → click every option → check
  `#levelup-overlay` for `.show` → repeat) rather than guessing at manual click sequences — got
  there in a handful of iterations. Worth remembering as a technique if this needs re-testing later
  rather than clicking blindly and hoping for a lucky correct answer.
- All three modals (feedback panel, collection grid, level-up popup) now consistently share the
  same leather+stitching system as the main HUD/stage cards. No other flat-white leftovers spotted
  in a pass over the remaining CSS.

## 2026-07-23 update — feedback panel + dragon collection modal brought into theme
Closed out the two remaining flat-cream leftovers flagged across the last couple of rounds.
- **`.feedback-panel`** (the post-answer "Correct!"/"Not quite" explanation box) — now the same
  embossed-parchment recipe as `.option-btn`, just scaled up (bigger padding/heading size) since it
  holds a full explanation rather than a short answer. Verified live: reads clearly, no contrast
  issues.
- **`.collection-modal-card`** (the "Dragon Collection" grid) — was still a flat `var(--card)` white
  dialog, the last piece that hadn't been pulled into the leather/plaque system. Fixed by folding it
  into the *same* shared `::before`/`::after` pseudo-element rules already used by `.hud`/`.stage`
  (stitched dashed frame + rivets, leather layer with the saturate/brightness/contrast filter) —
  rather than duplicating the recipe, it now just rides the existing selector list
  (`.hud::before, .stage::before, .collection-modal-card::before` etc. in `style.css`). Header
  recolored gold + MedievalSharp font, close button and family-name pills (Ember/Frost/Storm/...)
  given the same embossed bevel treatment, dynamic per-family colors left untouched.
- **Noticed but not yet fixed:** `.levelup-card` (the level-up/dragon-hatch popup) is still the old
  flat `var(--card)` white style — same category of leftover as the two just fixed. Likely the next
  thing to flag/tackle if Clinton wants full consistency across every modal.
- Clinton also flagged the HUD header (`Image #3` in chat) as "not quite right" without a specific
  detail — compared live against the screenshot and couldn't conclusively identify the defect (title
  centering looked correct in a fresh screenshot); left open for him to point at specifically next
  time rather than guessing further.

## 2026-07-23 update — unified the HUD into the same embossed-leather theme
Clinton pointed at the HUD (top card) and asked for it to match the look already achieved on the
stage/question card (dark carved plaques + parchment-embossed buttons), plus three specific fixes.
- **`#picker-sub` tray** — was a flat bright-cream panel (`#fff3df`) with plain white sub-buttons,
  the one piece of the HUD that hadn't been brought into the new theme. Now a dark carved plaque
  (same recipe as `.question-plaque`) with parchment-embossed sub-buttons (same recipe as
  `.option-btn`), connecting triangle updated to match.
- **Darkened the "dark plaque" family consistently** — `.question-plaque` alpha bumped 0.55→0.72
  per Clinton's ask ("make the darkness behind the questions a little darker... continue where
  used elsewhere"), and the same darker value (`rgba(15,7,3,0.68/0.72)`) applied to every other
  dark-plaque element for consistency: `.hud-top .subject`, `.xp-label`, `.collection-count`,
  `#picker-sub`.
- **`.speech-bubble` inverted from `.option-btn`** — was still the old flat cream bubble (`#fff3df`
  + purple-dark text). Rebuilt as the color-and-bevel inverse of the answer buttons: dark
  leather gradient background, gold-cream text, bevel direction flipped (dark-top/light-bottom
  instead of light-top/dark-bottom) — reads as a pressed-in twin of the buttons now.
- **`.level-badge` / `.view-collection-btn`** — added the same dual inset-shadow bevel (light-top,
  dark-bottom) and a thin dark leather-edge border used elsewhere, so they read as embossed rather
  than flat generic pills. Kept the orange/red brand gradient (didn't recolor to the dark-plaque
  family) since these are accent/action elements, not passive labels.
- All verified live via screenshot (Screen Recording permission + AppleScript, no automation
  framework) — no new contrast regressions this round; the darker plaques still read clearly since
  they all use light text on dark, not dark-on-dark.
- **Still open, not yet touched:** the feedback panel (post-answer "Not quite — here's why" box)
  is still the old flat-cream style — flagged to Clinton twice now, natural next candidate if he
  wants full theme consistency.

## 2026-07-23 update — "classy leather/fire-stitching/studded-chest" visual pass (live-iterated)
Clinton asked for a broader visual upgrade beyond the wallpaper feature — inspiration words:
"rich colour, embossed, immersive, escapist, thematic, steel sword, red blood, stitched books and
studded chest." Because live browser screenshots now work (see previous entry), this whole pass
was iterated by editing CSS → reload Chrome → screenshot → adjust, catching two real regressions
before they shipped rather than guessing blind. Final state, in order of iteration:
1. **Stitched-leather frame** — dashed gold "thread" `::before` border inset into `.hud`/`.stage`,
   corner rivets upgraded twice: first flat dots, then true steel-highlight/grey/blood-dark-rim
   studs (bigger, more defined, per Clinton's "rivets bigger more defined" feedback).
2. **Vignette + steel trim** — body background gets a radial-gradient dark vignette (immersive/
   escapist framing), cards get a thin steel-coloured outer ring + inset dark falloff.
3. **Leather intensity** — Clinton compared the leather to a fire-image screenshot and said it
   needed to be "as intense." Fix: moved the leather photo onto its own `::after` layer (`z-index:
   -1`, `filter: saturate/brightness/contrast`) so intensity can be pushed hard without the filter
   touching the text sitting on top of it (a `filter` on the element itself would have blurred/
   recoloured children too). **Regression caught and fixed:** first attempt (brightness 0.68,
   contrast 1.25, saturate 1.7) made the leather so dark that question text and topic labels
   became illegible again — the exact bug fixed earlier today, reintroduced by a different cause.
   Backed off to brightness 0.95/contrast 1.1/saturate 1.5, which keeps the grain rich without
   killing contrast.
4. **Gold-leaf title** — "Dragon Academy" recolored from dark purple-brown (too low-contrast on
   the richer leather) to a gold-leaf tone with an embossed multi-layer text-shadow — reads as
   stamped lettering on a book cover.
5. **Second regression, root-caused properly this time:** Clinton flagged the question prompt and
   "creatures collected" text as still unreadable, plus wanted answer boxes/headings to look
   "embossed into the book," the fire slot to look like "a curved raised glass portal," and the
   title centered in an Old-English typeface. Fixes:
   - Question topic/prompt wrapped in a new `.question-plaque` (`index.html` + `style.css`) — a
     solid dark carved-plaque background behind the text, not just a text-shadow — so contrast no
     longer depends on the leather grain pattern behind it. Same treatment (dark pill background)
     applied to `.collection-count` and `.xp-label`.
   - `.option-btn` redesigned from flat white cards to warm parchment tone with an embossed bevel
     (inset light-top/dark-bottom shadow), matching the book aesthetic instead of looking like a
     generic UI card pasted on top.
   - `.dragon-wrap` reworked into a circular "glass portal": dark+steel bezel rings via layered
     `box-shadow`, inset highlight/shadow for a convex-glass feel, and a diagonal glass-shine
     `::after` overlay.
   - `.hud-top` restructured (was flex space-between) to center the `<h1>`, with the subject label
     now an absolutely-positioned pill top-right. Added Google Font "MedievalSharp" (linked in
     `index.html` `<head>`) applied to just the `<h1>`, for an Old-English book-cover feel without
     hurting readability of the actual quiz UI (kept "Baloo 2" everywhere else).
   - **Not yet addressed:** the feedback panel (the "Not quite — here's why" box shown after
     answering) is still the old flat-cream style — flagged to Clinton as a visible inconsistency,
     not yet reworked since it wasn't in his explicit list. Natural next step if he wants full
     consistency.
- **Lesson for next time:** any future darkening/intensity pass on `.hud`/`.stage` must be checked
  against `.question-plaque`/`.option-btn`/pill text specifically, not just eyeballed generally —
  contrast regressions here have twice come from tuning the leather without re-checking text.

## 2026-07-23 update — first live browser play-test + random-cycling background wallpaper
Screen Recording permission was granted this session, so for the first time this project could
actually be seen running in Chrome (via `screencapture` + AppleScript, not a headless
automation tool). Confirmed live: the leather texture on both `.hud` and `.stage` reads clearly,
the darkened `.question-topic`/`.hud-top .subject` text fix from earlier today is legible against
the grain, the yellow/red/black/orange palette reads cohesive, and the fire GIF aura sits as a
tight border around the hatch-stage art rather than dominating it — all previously "not yet
play-tested" items from today's earlier entries are now confirmed working as intended.
- **New: random-cycling background wallpaper.** Clinton added 6 candidate dragon images to
  `DragonPix/Wallpapers/` and asked for the body background to rotate. Reviewed all 6 — 5 are
  usable (current `dragon-landscape.jpg` plus 4 new: gold dragon/blue sky, purple-sky dragon,
  black-dragon-in-swamp, black spiky dragon, red fire dragon), copied into `assets/backgrounds/`
  as `dragon-gold-sky.jpg`, `dragon-purple-sky.jpeg`, `dragon-black-swamp.jpg`,
  `dragon-black-spiky.jpg`, `dragon-fire-red.jpg`. One candidate (a small 440px-wide battle-scene
  thumbnail) was excluded for being too low-resolution to use as a full-page background, not for
  content — Clinton clarified his daughter is 14 and likes dragons/fire generally, so the
  darker/epic images were kept in rather than filtered out as "too scary."
  - New `js/backgrounds.js` (`window.PurseBackgrounds.cycle()`) picks a random image from the pool
    (avoiding an immediate repeat) and sets it via a `--bg-image` CSS custom property on `body`.
    Runs once on page load, and again from `js/game.js`'s `showLevelUp()` on every level-up call —
    which covers both requested triggers ("level up" and "gets a dragon") in one hook, since a
    dragon hatch is itself the final step of a `showLevelUp()` call.
  - **Gotcha hit and fixed:** a relative `url()` inside a CSS custom property resolves against the
    *stylesheet where `var()` is consumed* (here, `css/style.css`), not the document or wherever
    the variable is set from JS. First attempt used paths like `"assets/backgrounds/…"` (relative
    to `index.html`) and silently resolved to the wrong location
    (`css/assets/backgrounds/…`, a folder that doesn't exist) — no console error, image just never
    rendered. Fixed by using `"../assets/backgrounds/…"` in `js/backgrounds.js`'s `POOL`, mirroring
    the same `../assets/...` pattern `style.css` already uses for `leather.webp`. Verified via
    Chrome's JS execution that `getComputedStyle(document.body).backgroundImage` now resolves to a
    real `file://` path, and confirmed visually in a screenshot.
- **Next (in progress):** Clinton wants a broader visual pass beyond wallpaper — "classy, leather,
  fire stitching, dragons etc," sharpening colours/layout throughout, not just this one feature.
  Scope not yet nailed down — pick this up next session.

## 2026-07-23 update — muted-grey text darkened against the leather texture
Clinton flagged the "CHEMISTRY · BONDING" topic label as hard to read against the now-visible
leather grain. Root cause: `.question-topic` used `var(--muted)` (a soft brown-grey, designed for a
flat cream background) — low contrast against a busy textured photo. Fixed in `css/style.css`:
- `.question-topic` → `var(--ink)` + bolder weight (700).
- Proactively also fixed `.hud-top .subject` (the "Science: Chemistry" mode label at the top) the
  same way, since it's the identical issue on the HUD card I textured in the previous change —
  Clinton didn't flag this one specifically but it's the same root cause.
- Left `.xp-label`/`.collection-count`/`.attribution` etc. on `var(--muted)` for now — they're
  smaller/secondary text where the softer tone is more intentional, but worth a look if any of those
  turn out hard to read too once seen live.
- **Not yet play-tested live in a browser** — worth Clinton confirming both fixed labels are now
  comfortably legible, and flagging anything else that's still hard to read against the grain.

## 2026-07-23 update — leather wash lightened + extended to the HUD card
Two quick follow-ups from a screenshot: the cream wash over the leather texture was too opaque
(barely any grain showing), and the leather treatment was wanted on the top HUD card too, not just
`.stage`.
- Dropped the wash opacity from `0.9` to `0.55` on both `.stage` and the new `.hud` background
  (`css/style.css`) — same translucent-cream-over-`leather.webp` layering technique, just lighter,
  so the grain reads clearly now instead of being nearly washed out.
- `.hud` now uses the same leather backdrop as `.stage`, so the whole app (HUD + question card)
  reads as one consistent textured surface.
- **Not yet play-tested live in a browser** — worth Clinton confirming the new 0.55 opacity still
  keeps HUD text (level badge, XP label, picker buttons) comfortably legible against the leather
  grain, since that card has more small text/UI elements than the stage.

## 2026-07-23 update — yellow/red/black/orange palette + leather texture backdrop
Clinton asked to retheme from the original purple/teal/cream look to yellow, red, black and orange.
- **`css/style.css` `:root`**: `--purple`→`#d84a1b` (flame orange, primary accent/buttons/active
  states), `--purple-dark`→`#7a1f0d` (deep ember, headings), `--teal`→`#ffb300` (amber-yellow, XP
  bar gradient partner), `--gold`→`#ffd54a` (glow pulses), `--bg`/`--card`/`--ink`/`--muted` all
  warmed from purple-grey tints to warm cream/espresso tones. **Kept `--soft-green` green for
  "Correct"** and darkened `--soft-red` slightly (`#c62828`) for "Incorrect" — deliberately did NOT
  force these into the 4-colour palette, since red/green right-or-wrong is a convention a kid
  already reads instantly, and making "wrong" too close to the new red-orange brand accent would
  blur that signal. Flagged this to Clinton rather than silently deciding it; open to revisiting.
  Variable *names* (`--purple`, `--purple-dark`) were kept even though they now hold orange/near-
  black values — renaming them would've meant touching every `var(--purple)` usage across the file
  for no functional benefit.
- Swept every hardcoded (non-var) hex colour that referenced the old purple-tinted palette (picker
  buttons/tray, XP bar track, family-header fallback, collection-tile dark bg, collection modal
  backdrop, speech bubble, option buttons + their glow-in keyframe, feedback panel, level-up overlay
  backdrop, glow-ring fallback) — confirmed via grep that none of the old hex values remain.
  Dragon-family flavour colours in `js/game.js` (`FAMILY_EFFECTS` — ember/frost/storm/etc.)
  deliberately left untouched — those are intentionally varied per-dragon collectible colours, not
  part of the app's UI chrome/theme.
- **Leather texture**: Clinton supplied a distressed brown leather photo → saved as
  `assets/backgrounds/leather.webp`, used as `.stage`'s (the main quiz card) background, under a
  translucent warm-cream wash (same layering technique the body background already used for the
  dragon-landscape photo) so the leather grain shows through subtly without hurting text legibility.
- **Not yet play-tested live in a browser** — worth Clinton checking: does the new palette actually
  read as cohesive fire tones rather than clashing, is text still comfortably legible on the leather-
  textured stage, and does he want the same leather treatment extended to the `.hud` card too (only
  applied to `.stage` so far, since that's what was specifically asked for — "behind the questions").

## 2026-07-23 update — fire aura was way too dominant, sized down
Clinton sent a screenshot: the fire GIF background was stretching across the full width of the
`.stage` card (since `.dragon-wrap` had no explicit width, it filled its block-level parent), making
the flames huge and the actual egg/hatch-stage art tiny in the middle — opposite of the intended
"tight aura." Fixed in `css/style.css`:
- `.dragon-wrap` now has an explicit `width: 250px` + `margin: 0 auto` (was unconstrained width,
  centered only via flex `justify-content`, which centers content *inside* a box, not the box
  itself within its parent — that's why it silently filled the whole card width before).
- `.dragon` (the actual image) bumped from 170px → 218px, per "image needs to be larger".
- Net effect: a 218px image inside a 250px frame leaves only ~16px of padding on each side, so the
  fire GIF (still `background-size: cover` on that now-small box) reads as a tight flame border/
  glow around the art instead of a huge separate background banner.
- **Not yet play-tested live in a browser** — worth Clinton checking the new proportions actually
  look like "a bit of flame" as intended, not too tight or still too much.

## 2026-07-23 update — fixed hatch-stage sync bug
Clinton reported the main dragon slot and the level-up popup's progression image were out of sync.
Root cause in `showLevelUp()` (`js/game.js`): the popup displayed `HATCH_SEQUENCE[progress.hatchStep]`
using the value *before* incrementing, then incremented `hatchStep` right after — so by the time the
main slot re-rendered (`renderDragonStage()`, which reads the same `progress.hatchStep`), it was
already one stage ahead of what the popup had just shown (e.g. popup shows "log", main slot then
immediately jumps to "fire lit", skipping visually past what was just revealed).
Fix: increment `hatchStep` *first*, then use that same post-increment value for both the popup
display and the bounds check — so popup and main slot always reference the identical stage index.
Verified by simulating the full 5-stage cycle: every popup reveal now exactly matches what the main
slot shows immediately afterward, including the reset back to stage 1 after a dragon hatches.
**Not yet play-tested live in a browser** — worth Clinton clicking through a full level-up cycle to
confirm the fix feels right visually, not just numerically correct.

## 2026-07-23 update — picker hierarchy + polish, real fire GIF
Three related asks: make the HUD look more professional, make the picker visually show that
subsections belong UNDER their parent (HASS→History, not two peer rows), and use a real animated
fire GIF instead of the CSS glow pulse.
- **Picker hierarchy**: top-level tabs (`#picker-top`) are now bigger/bolder pill buttons with a
  lifted/shadowed active state. The sub-level row (`#picker-sub`) is now a distinct tinted "tray"
  panel sitting directly beneath, connected by a small rotated-square triangle (`::before`) pointing
  up toward the active tab — a standard "this belongs to that" visual (like a tooltip pointer).
  `#picker-sub:empty { display: none; }` handles the "Mix Everything" case (no sub-row) cleanly.
- **Warmth/polish**: every subject/area button now has a leading emoji (🧪 Chemistry, ⚡ Physics,
  💰 Economics, 🌏 Geography, 📜 History, 🏛️ Civics, 🔬 Science, 🌐 HASS, 🎲 Mix). Split the area
  label into two constants in `js/game.js` — `AREA_LABELS` (plain "Science"/"HASS", used inside
  phrases like "Mix HASS") vs `AREA_TAB_LABELS` (emoji-prefixed, used only for the top-level tab
  button text) — so the emoji doesn't end up awkwardly mid-sentence.
- **Real fire**: Clinton supplied `Animated_fire_by_nevit.gif` (480×360, black background) → saved
  as `assets/effects/fire.gif`. `.dragon-wrap` in `css/style.css` now has a dark background-color
  with the GIF layered on top via `background-blend-mode: screen` — this makes the GIF's black
  background vanish (screen blend against dark = transparent-looking) while the bright flame colours
  show through vividly, giving a genuine flickering fire aura behind the egg/hatch-stage art. Removed
  the old `ember-glow` CSS box-shadow pulse animation since the real GIF replaces its purpose (no
  redundant effect). Note: the existing hatch-sequence PNGs (`assets/hatch-sequence/*.png`) already
  have painted flames baked into the artwork itself (confirmed by viewing one) — this fire GIF is a
  separate animated aura layer behind/around that art, not a replacement for it.
- **Not yet play-tested live in a browser** — worth Clinton checking: does the screen-blend fire
  look right in an actual browser (blend modes can render slightly differently across browsers/
  Chrome vs Safari), does the picker tray/triangle connector look correctly attached under the
  active tab, and is the emoji rendering consistently across whatever device/OS she uses.

## 2026-07-23 update — multi-subject picker: Science + HASS, 767 questions total
Big one. Full plan at `~/.claude/plans/golden-purring-pie.md` (approved via plan mode this
session) — read that first for the complete rationale/design discussion, especially around the
GDP growth-rate figure discrepancy (resolved: use 2-3%, matching the RBA's real trend-growth view;
the source slide deck's "3.25-3.5%" was a content error, worth Clinton flagging to the deck owner)
and the dragon family/subject-lock mapping (below).

**What changed, end to end:**
- **Picker**: two-level HUD control — top level **Science / HASS / Mix Everything**; Science
  splits into **Chemistry / Physics / Mix Science**; HASS splits into **Economics / Geography /
  History / Mix HASS** (Civics has no content yet, so its button simply doesn't appear — adding
  `js/subjects/civics.js` later and giving it a `subjectLock` slot is all that's needed to light it
  up, no other plumbing required). Selection persists in `localStorage` (`purse-mode-v1`), default
  is Science → Chemistry so nothing changes for existing play unless she picks something else.
- **`js/game.js` rework**: subject registry is just `window.PURSE_SUBJECTS` (whatever's loaded);
  `activeSubjectIds()` resolves the current picker state to a subject-id list; `drawQuestion()`
  picks a subject with **equal weight regardless of bank size** each draw (verified: chemistry's
  347 questions and history's 67 both come up ~20% of the time in "everything" mode, not
  proportional to bank size), then pops from that subject's own shuffled queue. Each drawn question
  gets stamped with `_subjectId`/`_subjectTitle`/`_topic` so the on-screen header is correct
  per-question even mid-mix.
- **Progress stays single/shared** (confirmed by Clinton) — same `purse-save-chemistry-v2` XP/level/
  collection regardless of picker mode; the picker only changes the question pool.
- **Subject-locked dragons**: `REWARDS_50` entries in `game.js` now carry an optional
  `subjectLock` id. Current split: Chemistry→Ember+Frost, Physics→Storm+Light, Geography→Earth+Sea,
  History→Shadow, Economics→Nature, Civics→(none yet), Mystic+Legendary→universal. Confirmed by
  Clinton, but it's just a one-line-per-dragon data table if he wants to rebalance later.
  `pickWeightedIndex(subjectId)` filters to `subjectLock == null || subjectLock === subjectId`
  before the existing rarity-weighted pick — verified via simulation that e.g. answering an
  Economics question never hatches a Chemistry-locked dragon.
- **Chemistry extended in place** (`chemistry.js`, 214 → 347 Qs) with **Bonding** (electron config,
  ionic/covalent bonding, formula writing incl. polyatomic ions, predicting bond type from periodic
  table position — reuses the existing table-highlight mechanism) and **Reactions** (word/balanced
  equations, precipitation/acid reactions, rate factors & collision theory). Existing 214 Periodic
  Table questions untouched — they don't carry their own `topic` field, so `drawQuestion()` falls
  back to the subject's default `topic` for them; new Bonding/Reactions questions each carry an
  explicit `topic`.
- **New `js/subjects/physics.js`** (123 Qs): Kinematics (scalar/vector, speed/velocity/acceleration
  calculations & graphs, vector diagrams), Newton's Laws (force types, all three laws, F=ma
  calculations, real-world applications), Energy Conservation (conservation law, energy forms,
  efficiency calculations).
- **New `js/subjects/economics.js`** (136 Qs, the flagship/most detailed subject): six core
  concepts, growth & GDP (using the confirmed 2-3% figure), inflation, unemployment, the business
  cycle, government influence & externalities, income/wealth distribution & living standards,
  business responses to change, productivity, ethical decision-making, the changing work
  environment.
- **New `js/subjects/geography.js`** (94 Qs): SPICESS concepts + PQE analysis method, Environmental
  Change & Management (sustainability's three pillars, four ecosystem services, ecosystem collapse
  & direct/indirect drivers, climate change), Geographies of Human Wellbeing (material/non-material
  indicators, GDP per capita, HDI, UN SDGs, spatial variation between countries).
- **New `js/subjects/history.js`** (67 Qs): causes of WWII (Treaty of Versailles, hyperinflation,
  the Great Depression, rise of the Nazi Party — including its actual 1920 platform), Australian
  WWII service (Kokoda, North Africa, fall of Singapore, POWs), the Australian Homefront (1939
  National Security Act, censorship, propaganda, internment), the Holocaust & atomic bomb, Rights &
  Freedoms (Universal Declaration of Human Rights, Aboriginal and Torres Strait Islander campaigns
  pre-1965). **Civics** — no source material yet, deferred; slots into this exact same pattern
  whenever notes arrive.
- All 5 subject files individually validated with Node (every `correct` matches an option, no
  duplicate options per question, chemistry's `group`/`element` tags all resolve to real periodic-
  table cells) — **767 questions total** across the app. Full end-to-end smoke test (all 5 files +
  `game.js` loaded together against a minimal DOM stub) runs clean with no exceptions.
- **Not yet play-tested live in a browser** (still no browser automation this session) — everything
  above is validated via Node (data integrity + mode-resolution/mixing logic simulation matching the
  real implementation), not an actual click-through. Worth Clinton checking next session: does the
  two-row picker look right in the HUD, does the topic header update correctly per-question in a
  mix mode, and does at least one subject-locked dragon behave as expected live.

## 2026-07-23 update — feedback text moved above the table, click-to-close
Two small follow-ups on the inline table reveal:
- Moved `#feedback-panel` in `index.html` to sit right before `#table-reveal` (was after `#options`)
  — so the "Correct!"/"Not quite" text now renders above the table image, both together replacing
  the dragon/speech-bubble slot. Question/options position is unchanged.
- Clicking the table canvas now calls `hideTableReveal()` directly (`els.tableCanvas.addEventListener
  ("click", hideTableReveal)` in `js/game.js`) — collapses the table and brings the dragon/speech
  bubble back, without touching the feedback text (that stays until "Next Question" is clicked).
  Added `cursor: pointer` on the canvas as an affordance hint.

## 2026-07-23 update — table reveal redesigned as inline scroll-down, dragon glow made static
Clinton didn't like the full-screen popup for wrong answers — it covered the options and the
explanation, which defeats the point (he wants "the table AND the explanation" visible together).
Replaced it entirely with an inline reveal that takes over the dragon/speech-bubble slot instead:
- New `#table-reveal` element sits right after `#dragon-wrap`/`#speech` in `index.html`. On any
  answered question (right or wrong) with a highlight target, `showTableReveal()` in `js/game.js`
  hides the dragon and speech bubble (`.hidden-for-table`) and grows the table in in their place —
  a CSS grid-rows trick (`grid-template-rows: 0fr → 1fr`, transition) for the "roll down" feel, plus
  a fade/slide-up on the canvas itself. Options and the feedback-panel explanation below are never
  touched, so both stay visible the whole time. `hideTableReveal()` (called at the top of every
  `nextQuestion()`) restores the dragon/speech and collapses the panel again.
- Deleted the old full-screen `#pt-overlay` modal and the small tappable feedback-panel thumbnail
  entirely (HTML, CSS, JS) — both fully superseded by the one inline mechanism now. Confirmed via
  grep there are no leftover references anywhere.
- Dragon slot: removed the `bob` idle animation (Clinton didn't want the fire/egg image bouncing).
  `.dragon` now has a permanent `ember-glow` box-shadow pulse (warm orange/red) instead, static
  position. The happy/gentle reaction animations (cheer/tilt) still work — retargeted from the
  `.dragon` container onto the `.dragon-img` child so they don't fight the container's own glow
  animation on the shared CSS `animation` property.
- **Not yet play-tested live in a browser** (still no browser automation this session) — particularly
  worth checking: does the grid-rows reveal animate smoothly (it's a modern-CSS technique, should work
  in current Chrome/Safari/Firefox but hasn't been visually confirmed), and does the layout reflow
  (options/explanation shifting down while the table grows in) feel acceptable rather than jumpy.

## 2026-07-23 update — main dragon slot now shows hatch progress, HUD polish
Clinton wants the `#dragon` slot (previously the `js/dragon.js` baby/hand mascot art, idling and
occasionally colour-morphing on correct answers) to instead show the *current* firewood/egg stage
(`assets/hatch-sequence/1-sticks.png` → `5-egg-cracking.png`, keyed off `progress.hatchStep`, same
images already used inside the level-up overlay). Done: `js/game.js` has a new `renderDragonStage()`,
called on init and at the top of every `nextQuestion()`, that swaps `#dragon`'s content to the image
matching the current hatch step. `js/dragon.js`'s `init`/`onCorrectAnswer` calls were removed from
`game.js` (the mood bounce/cheer/tilt animations on the `#dragon` container itself are untouched and
still fire — only the image source changed).
- **`js/dragon.js` itself is untouched, just disconnected** — Clinton still wants the baby/hand
  mascot sprites somewhere, hasn't decided where yet since the main slot's now taken. Don't delete
  the file/assets; when a placement idea firms up, wiring it back in is small (re-add the two
  `PurseDragon.*` calls, probably to a different element than `#dragon`).
- Centered `.view-collection-btn` and `.collection-count` (previously left-aligned in the `.hud`
  block) and gave both a soft looping gold glow (`soft-glow-btn`/`soft-glow-text` keyframes in
  `css/style.css`) to draw the eye there.
- **Not yet play-tested live in a browser** (still no browser automation this session) — worth
  checking next session that the hatch-stage image looks right at the `.dragon` slot's 170×170 size
  (the hatch-sequence source images may have different aspect ratios than the old square mascot art).

## 2026-07-23 update — chemistry question rebalance
Clinton's feedback: the question bank leaned too hard on rote atomic-number/proton-count recall
across the *entire* periodic table (obscure elements included) — not realistic for a kid to know
cold. Rebalanced `js/subjects/chemistry.js`:
- Dropped atomic-number/proton-count questions for anything outside a "should know these" core
  list of 20 common elements (Hydrogen, Helium, Carbon, Nitrogen, Oxygen, Sodium, Magnesium,
  Aluminium, Silicon, Phosphorus, Sulfur, Chlorine, Potassium, Calcium, Iron, Copper, Zinc, Silver,
  Gold, Lead). Cut 102 questions this way.
- Kept all symbol questions (name↔symbol) and all "which of these is a [noble gas / halogen /
  alkali metal / alkaline earth metal / transition metal / post-transition metal / metalloid /
  nonmetal]?" classification questions — these test concepts, not memorization.
- Added 16 new **reverse-direction group questions** — e.g. "Helium, Neon, and Argon all belong to
  which group of elements?" with the group name as the 4-way choice — per Clinton's specific ask
  for more "what group is this" style questions.
- Net: 314 lines → 228 lines, 300 questions → 214 questions. Old file backed up as
  `js/subjects/chemistry.js.bak-2026-07-22` (safe to delete once the new set is confirmed good).
- Validated with Node: all 214 questions parse, every `correct` value matches one of its 4
  `options`, no duplicate options. **Not yet play-tested in a browser** — worth a quick run-through
  next session to confirm difficulty/flow feels right.

## 2026-07-23 update — periodic table highlighting, wired into every question
Clinton supplied a real periodic table image (`DragonPix/Periodic Table/Periodic Table.png`,
© Encyclopaedia Britannica — fine for this private/personal use, but don't redistribute or publish
this game with that image bundled without checking licensing) and asked for it to show alongside
quiz answers. First pass generated 8 static pre-baked category images (still documented via
`DragonPix/Periodic Table/generate_highlights.py`, which is how the pixel-grid calibration below
was derived) — then Clinton asked for two more things: (1) *every* periodic-table question should
reinforce the answer's location, not just the 58 group/classification ones, and (2) show it bigger,
as a popup, not a small inline thumbnail. Rebuilt around that:
- `js/periodic-table.js` (new) — `window.PurseElements`. Ports the calibrated grid
  (`COL_BOUNDS`/`ROW_BOUNDS`, pixel-sampled from the source image) plus a `NAME_POS` map of all 62
  element names the quiz references, and 8 named category cell-lists. Draws onto any `<canvas>` at
  runtime: whole table dimmed, target cell(s) left sharp with a red box, from
  `assets/periodic-table/full-table.png` (the one base image now needed — the 8 static category
  PNGs from the first pass were deleted, superseded by this).
- **Every one of the 214 questions** now resolves to a highlight target: the 58 group/classification
  questions via `group: "<slug>"` (unchanged), and the other 156 (symbol, atomic-number, proton-count
  questions) via a new `element: "<Name>"` field added by regex-extracting the element from each
  question's prompt/answer. Validated with Node: all 214 resolve to real grid cells, no bad
  correct/options data, no question double-tagged with both fields.
- `js/game.js`: correct answers still show a small tappable canvas inline in the feedback panel
  (`renderPeriodicTableFor`); **wrong answers now auto-pop a bigger centered overlay**
  (`showPeriodicTablePopup`, mirrors the existing `levelup-overlay` pattern — dark backdrop, tap
  anywhere to dismiss) right when the explanation appears, so the reinforcement lands specifically
  on the mistakes, per Clinton's "unconscious visual repetition" idea.
- **Not yet play-tested live in a browser** — no browser automation available this session, everything
  above is validated via Node (syntax, data integrity, cell-resolution), not an actual click-through.
  Worth a real run-through next session, particularly: does the popup size/timing feel right, and
  does drawing at native image resolution (1378×965) onto canvas look sharp at popup size (~700px).
- **Fix (same day):** Clinton reported the wrong-answer popup wasn't appearing automatically. The
  auto-popup call was already wired in, but `renderPeriodicTableFor`/`showPeriodicTablePopup` drew
  immediately rather than waiting for `full-table.png` (900KB) to finish loading — if a question was
  answered wrong before that first load completed, the draw silently no-opped and nothing showed.
  Both functions now `await window.PurseElements.loadBase()` before drawing, with a staleness guard
  (`if (question !== current) return`) in case the question moved on while waiting. Still needs a
  live check that the popup now reliably appears on every wrong answer, including the very first
  question of a fresh page load.

## What this is
A kids' quiz game, single HTML page (`index.html`) + vanilla JS, no build step, no server needed —
just open `index.html` in a browser. Answer chemistry questions, earn XP, level up, hatch dragons,
build a 50-creature collection. Progress saves to `localStorage` per subject.

## What's done
- **Chemistry (Periodic Table) subject** — `js/subjects/chemistry.js` — ~200 questions (symbols,
  atomic numbers, proton counts, element categories). Every question has an explanation shown on
  both correct and incorrect answers. Wrong answers cost nothing (no score loss, by design).
- **Dragon mascot** — `js/dragon.js` — idles by default; on a correct answer, small chance of a
  colour-shift (same family) or a full morph into a different dragon shape.
- **XP / leveling** — `js/game.js` — 10 XP per correct answer, 30 XP per level, persisted to
  `localStorage` under `purse-save-chemistry-v2`.
- **Egg-hatch sequence** — 5-step fire/egg animation, one step per level-up; once the sequence
  completes, a dragon hatches from a weighted pool of 50 creatures (10 families × 5 rarity tiers —
  first-in-family common, last-in-family rare).
- **Collection modal** — grid of all 50 dragons by family, locked/unlocked state, tap to view.
- All asset folders (`assets/dragons`, `assets/hatchlings`, `assets/hatch-sequence`) are populated
  and correctly wired to the code. No TODO/FIXME/placeholder stubs found anywhere in the JS/CSS.

## What's NOT done / open question
- **Only one subject exists** (Chemistry). The code is structured to support more
  (`js/subjects/*.js`, each just needs `title`, `topic`, `questions[]`, then a `<script>` tag added
  in `index.html`) — but no second subject file has been written yet.
- Unconfirmed whether more subjects were ever planned, or whether Chemistry-only was the intended
  scope for a v1. **Ask Clinton in the morning** which it is before adding anything.
- `DragonPix/` and `PIX/` folders are raw source art (ChatGPT-generated images, stock zips,
  extracted sprites) used to produce the cropped `assets/` files — not referenced by the running
  app. Safe to ignore/archive, not part of the live game.

## To resume
Say **"pick up the Purse project"** (or "Dragon Academy") and point back to this file — it has
the full state. Next natural step, if scope is confirmed: draft a second subject file following
the `chemistry.js` pattern.
