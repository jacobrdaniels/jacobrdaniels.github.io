"use strict";

const STYLES = [
  {
    id: "aero",
    name: "Frutiger Aero",
    title: "A brighter<br>kind of world.",
    subtitle: "Technology with a breath of fresh air.",
    era: "Glass / water / light",
    words: "Luminous · optimistic · fluid",
    colors: ["#0877BD", "#77CAEB", "#8BBF36", "#EAF8FF", "#173D59"],
    fonts: "Segoe UI / Trebuchet MS / Consolas",
    body: "Clear skies, cool water, and a little everyday wonder. Glossy surfaces catch the light; soft shapes make technology feel approachable.",
    principle:
      "Let light describe the surface. Use bright sky colors, nature, translucent layers, and rounded controls with a distinct highlight.",
    avoid:
      "Keep the glass legible. Solid reading surfaces and dark text give the atmosphere room to breathe.",
  },
  {
    id: "terminal",
    name: "Unix / BBS",
    title: "A signal in<br>the noise_",
    subtitle: "A small place on a very large network.",
    era: "Phosphor / text / signal",
    words: "Direct · technical · personal",
    colors: ["#B3EF85", "#080F0C", "#18271E", "#DFE8D9", "#EACB78"],
    fonts: "Space Mono / Courier New",
    body: "A cursor blinks. A connection opens. Plain text, visible structure, and a few well-placed symbols turn an empty screen into a place.",
    principle:
      "Build hierarchy with text, indentation, rules, and meaningful color. The interface should feel navigable from a keyboard.",
    avoid:
      "Use phosphor sparingly. Long passages need calm contrast, and the text must remain crisp beneath the atmosphere.",
  },
  {
    id: "mac",
    name: "Classic Macintosh",
    title: "A computer.<br>A companion.",
    subtitle: "Small details. A whole new desktop.",
    era: "Bitmap / paper / desktop",
    words: "Tactile · playful · precise",
    colors: ["#FFFFFF", "#000000", "#AAAAAA", "#DDDDDD", "#555555"],
    fonts: "Silkscreen / Arial / Courier New",
    body: "A window on a patterned desktop. A tiny icon with a big personality. A button that feels like a button. Everything has a place.",
    principle:
      "Work with black, white, and deliberate patterns. Let borders, title bars, bitmap graphics, and inset surfaces explain the interface.",
    avoid:
      "Keep the illusion lightweight. Windows are containers here, so nothing needs dragging to make the page usable.",
  },
  {
    id: "swiss",
    name: "Swiss International",
    title: "Order.<br>With intent.",
    subtitle: "An exercise in clarity and contrast.",
    era: "Type / grid / proportion",
    words: "Systematic · assured · clear",
    colors: ["#E63222", "#F4F2EA", "#171714", "#D4D1C7", "#FFFFFF"],
    fonts: "Arial / Helvetica / Space Mono",
    body: "Scale establishes a rhythm. A line creates a relationship. Space gives each element its purpose. Every part belongs to the whole.",
    principle:
      "Let typography do the work. Use decisive scale changes, flush-left alignment, a visible grid, and a restrained accent.",
    avoid:
      "Do not confuse clarity with emptiness. Dense information can remain beautifully ordered.",
  },
  {
    id: "manual",
    name: "Technical Manual",
    title: "Observe.<br>Make. Repeat.",
    subtitle: "A field guide to everyday mechanisms.",
    era: "Ink / annotation / paper",
    words: "Practical · warm · methodical",
    colors: ["#254C65", "#D06332", "#EDE4D1", "#C4B69A", "#373C39"],
    fonts: "Libre Baskerville / Arial / Space Mono",
    body: "Open the cover. Follow the diagram. Take something apart and understand how it works. There is a quiet pleasure in a useful object.",
    principle:
      "Treat the page as a printed reference. Number sections, annotate diagrams, use warm stock, and reserve color for meaningful emphasis.",
    avoid:
      "Texture should suggest a material without obscuring the smallest label or the finest rule.",
  },
  {
    id: "zine",
    name: "DIY Photocopy",
    title: "Make a little<br>NOISE.",
    subtitle: "Cut. Paste. Copy. Pass it on.",
    era: "Toner / tape / attitude",
    words: "Raw · expressive · handmade",
    colors: ["#DFFF00", "#171717", "#F2EFE5", "#B7B4AA", "#FFFFFF"],
    fonts: "Archivo Black / Arial / Courier New",
    body: "Something found. Something torn. Something worth saying. Rough edges and mismatched pieces come together with an unmistakable voice.",
    principle:
      "Create deliberate friction: oversized type, hard contrast, photocopy grain, tape, cut edges, and one electric spot color.",
    avoid:
      "Let the composition be unruly while the controls remain clear. Keep long text level and give every action a readable label.",
  },
  {
    id: "y2k",
    name: "Y2K Futurism",
    title: "Enter the<br>next dimension.",
    subtitle: "The future, as once imagined.",
    era: "Chrome / orbit / velocity",
    words: "Synthetic · kinetic · metallic",
    colors: ["#5551F0", "#C9DCF0", "#F1F4FF", "#151C43", "#A6F5E1"],
    fonts: "Orbitron / Arial / Consolas",
    body: "Chrome catches an impossible light. An orbit bends around a silver sphere. Everything feels fast, connected, and just beyond the horizon.",
    principle:
      "Combine polished metal, cool light, elliptical forms, technical labels, and angular or capsule-like controls.",
    avoid:
      "Save the stretched type for short headings. Supporting text needs simple letterforms and generous breathing room.",
  },
  {
    id: "nouveau",
    name: "Art Nouveau",
    title: "A natural<br>curiosity.",
    subtitle: "Where every line is allowed to grow.",
    era: "Botanical / ink / ornament",
    words: "Organic · graceful · intricate",
    colors: ["#29483D", "#B18A45", "#F3EBD4", "#819277", "#A86F53"],
    fonts: "Cormorant Garamond / Georgia / Courier New",
    body: "A stem becomes a border. A leaf becomes a flourish. Lines move with the patient rhythm of growing things, bringing a little nature to the page.",
    principle:
      "Use botanical forms, flowing curves, elegant serif type, and a limited palette of paper, green ink, and aged gold.",
    avoid:
      "Place ornament at the edges and around focal points. Reading and interaction need a quiet center.",
  },
];

const icon = (name) => {
  const paths = {
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/>',
    leaf: '<path d="M20 3C8 2 2 8 5 15c7 7 16-1 15-12ZM4 21 16 8"/>',
    computer:
      '<rect x="3" y="3" width="18" height="13" rx="1"/><path d="M8 21h8m-4-5v5M6 7h12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    folder: '<path d="M3 6h7l2 3h9v11H3Zm0 0V4h7l2 2h8v3"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
};

function renderGallery() {
  const previewTitles = [
    "A brighter<br>world.",
    "Stay<br>curious_",
    "Hello,<br>friend.",
    "Order.<br>Intent.",
    "Field<br>notes.",
    "MAKE<br>NOISE.",
    "Future<br>systems.",
    "Natural<br>curiosity.",
  ];
  document.querySelector("#gallery").innerHTML = STYLES.map(
    (s, i) =>
      `<a class="gallery-card" href="specimen.html?style=${s.id}"><div class="preview theme-${s.id}"><div class="preview-chrome"><span>${String(i + 1).padStart(2, "0")} / VISUAL STUDY</span><span aria-hidden="true">${s.id === "mac" ? "▤" : "✳"}</span></div><div class="preview-title">${previewTitles[i]}</div><div class="preview-art">${AtlasArt.scene(s.id)}</div><div class="preview-controls" aria-hidden="true"><span class="preview-button">Explore ${s.id === "terminal" ? "↵" : "↗"}</span><span class="preview-mini-palette">${s.colors
        .slice(0, 3)
        .map((c) => `<i style="background:${c}"></i>`)
        .join(
          "",
        )}</span></div></div><div class="card-caption"><div><span class="card-number">${String(i + 1).padStart(2, "0")}</span><h3>${s.name}</h3></div><span class="card-arrow" aria-hidden="true">↗</span><p>${s.era}</p></div></a>`,
  ).join("");
}

function specimenContent(s, index) {
  const colorNames = {
    aero: ["Water", "Sky", "Grass", "Cloud", "Deep ink"],
    terminal: ["Phosphor", "Night", "Panel", "Text", "Signal"],
    mac: ["Paper", "Ink", "Dither", "Chrome", "Mid-gray"],
    swiss: ["Vermilion", "Paper", "Ink", "Rule", "White"],
    manual: ["Blueprint", "Orange", "Stock", "Board", "Graphite"],
    zine: ["Acid", "Toner", "Paper", "Tissue", "White"],
    y2k: ["Ultraviolet", "Ice", "Pearl", "Midnight", "Mint"],
    nouveau: ["Forest", "Gold", "Ivory", "Sage", "Terracotta"],
  };
  return `<div class="world-wrap">
    <header class="world-masthead"><a class="world-brand" href="#main">${icon(s.id === "nouveau" ? "leaf" : "globe")}<span>${s.id === "terminal" ? "~/public/interface" : s.id === "manual" ? "INSTITUTE OF EVERYDAY THINGS" : s.id === "mac" ? "Finder · Visual Studies" : "THE EVERYDAY OBSERVATORY"}</span></a><nav aria-label="Specimen sections"><a href="#elements">Elements</a><a href="#library">Library</a><a href="#details">Notes</a></nav><span class="edition">Nº ${String(index + 1).padStart(2, "0")} / 08</span></header>
    <section class="hero"><div class="hero-copy"><p class="eyebrow">${s.name} / An interface study</p><h1>${s.title}</h1><p class="hero-subtitle">${s.subtitle}</p><div class="hero-actions"><a class="ui-button primary" href="#elements">Explore the elements ${icon("arrow")}</a><span class="hero-small">${s.words}</span></div></div><figure class="hero-figure"><div class="scene">${AtlasArt.scene(s.id)}</div><figcaption><span>FIG. 01 — NATURE × MACHINE</span><span>Three objects. One visual language.</span></figcaption></figure></section>
    <section class="palette-strip" aria-label="Color palette"><div class="palette-heading"><span class="section-index">01 / COLOR</span><p>Five notes.<br>One atmosphere.</p></div><div class="swatches">${s.colors.map((c, i) => `<button class="swatch" type="button" data-copy="${c}" aria-label="Copy ${c}"><span style="background:${c}" class="swatch-color"></span><span>${c}</span><small>${colorNames[s.id][i]}</small></button>`).join("")}</div><p class="palette-hint">Select a color<br>to copy its value ↗</p></section>
    <div class="elements-heading" id="elements"><h2>The elements</h2><span>Touch, type, select, explore.</span></div>
    <div class="specimen-grid">
      <section class="sample type-sample"><header class="sample-heading"><h3><span class="section-index">02</span> Type & voice</h3><span aria-hidden="true">Aa</span></header><div class="sample-body"><div class="type-display" aria-hidden="true">Aa<span>0123</span></div><h4 class="type-heading">The shape of things.</h4><p class="reading-sample">${s.body}</p><p class="type-detail"><strong>Something bold.</strong> <em>Something expressive.</em><br>And <a href="#details">a thread to follow ↗</a>.</p><div class="font-caption"><span>TYPEFACES</span><p>${s.fonts}</p><code>const curiosity = true;</code></div></div></section>
      <section class="sample action-sample"><header class="sample-heading"><h3><span class="section-index">03</span> Actions & states</h3>${icon("arrow")}</header><div class="sample-body"><p class="micro-label">A decision, big or small</p><div class="button-row"><button type="button" class="ui-button primary" data-open-dialog>Open a dialog ${icon("arrow")}</button><button type="button" class="ui-button secondary" data-toast="A small signal. Message received.">Send a signal</button></div><div class="button-row"><button type="button" class="ui-button" disabled>Unavailable</button><button type="button" class="icon-button" id="favorite" aria-label="Save this study" aria-pressed="false">${icon("star")}</button><span class="favorite-label">Save for later</span></div><div class="state-comparison"><div><span class="state-button">Resting</span><small>DEFAULT</small></div><div><span class="state-button state-hover">Hovered</span><small>HOVER</small></div><div><span class="state-button state-focus">Focused</span><small>KEYBOARD</small></div></div><p class="small-note">Try Tab to travel between controls. Every state has its own place in the visual language.</p></div></section>
      <section class="sample form-sample"><header class="sample-heading"><h3><span class="section-index">04</span> Input & choice</h3><span aria-hidden="true">±</span></header><form class="sample-body" id="sample-form"><div class="form-row"><label>A name for this feeling<input name="feeling" id="feeling" value="A little curiosity" maxlength="64" required autocomplete="off"></label><label>Detail level<select id="detail-level" name="detail"><option>Every little thing</option><option>Just the essentials</option><option>Somewhere between</option></select></label></div><label class="range-label" for="intensity"><span>Color intensity</span><output id="intensity-value" for="intensity">100%</output></label><input type="range" id="intensity" min="0" max="150" value="100" step="5"><div class="choice-row"><label class="check-label"><input id="show-guides" type="checkbox"><span>Show drawing guides</span></label><label class="switch-label"><input id="ambient-motion" type="checkbox" role="switch"><span class="switch-track" aria-hidden="true"></span><span>Gentle motion</span></label></div><fieldset class="radio-group"><legend>Spacing</legend><label><input name="density" type="radio" value="comfortable" checked> Comfortable</label><label><input name="density" type="radio" value="compact"> Compact</label></fieldset><div class="form-submit"><button class="ui-button primary" type="submit">Apply choices ${icon("check")}</button><span id="form-result" class="small-note" role="status">Make it feel a little more like you.</span></div></form></section>
      <section class="sample library-sample" id="library"><header class="sample-heading"><h3><span class="section-index">05</span> A small collection</h3>${icon("folder")}</header><div class="sample-body"><div class="tabs" role="tablist" aria-label="Collection view"><button id="tab-objects" type="button" role="tab" aria-selected="true" aria-controls="panel-objects" tabindex="0">Objects <span>03</span></button><button id="tab-materials" type="button" role="tab" aria-selected="false" aria-controls="panel-materials" tabindex="-1">Materials</button><button id="tab-saved" type="button" role="tab" aria-selected="false" aria-controls="panel-saved" tabindex="-1">Saved</button></div><div role="tabpanel" id="panel-objects" aria-labelledby="tab-objects"><label class="search-field">${icon("search")}<input type="search" id="collection-search" placeholder="Find a little something…" aria-label="Search objects"></label><div class="object-list">${[
        ["globe", "Orbital study", "A world, held in a circle."],
        ["leaf", "Fern fragment", "A small study in growing things."],
        ["computer", "Machine no. 03", "A familiar window to somewhere else."],
      ]
        .map(
          ([ic, n, d], i) =>
            `<button class="object-item" type="button" data-object="${n}" aria-pressed="${i === 0}"><span class="object-icon">${icon(ic)}</span><span><strong>${n}</strong><small>${d}</small></span><span class="object-arrow" aria-hidden="true">↗</span></button>`,
        )
        .join(
          "",
        )}</div><p class="empty-message" id="search-empty" hidden>No objects found. Try “fern” or “orbital”.</p><p class="selection-note" id="selection-note" role="status">Selected: Orbital study</p></div><div role="tabpanel" id="panel-materials" aria-labelledby="tab-materials" hidden><div class="material-grid"><div class="material material-one"><span>Surface</span></div><div class="material material-two"><span>Pattern</span></div><div class="material material-three"><span>Accent</span></div></div><p class="small-note">${s.era}. Three building blocks of this visual world.</p></div><div role="tabpanel" id="panel-saved" aria-labelledby="tab-saved" hidden><div class="empty-state">${icon("star")}<h4 id="saved-heading">A little room for favorites.</h4><p id="saved-copy">Use the star in Actions & states to save this study for this visit.</p></div></div></div></section>
      <section class="sample table-sample"><header class="sample-heading"><h3><span class="section-index">06</span> Order & information</h3><span aria-hidden="true">≡</span></header><div class="sample-body"><div class="table-wrap"><table><caption>Object index / three collected studies</caption><thead><tr><th scope="col">Object</th><th scope="col">Material</th><th scope="col">State</th></tr></thead><tbody><tr><th scope="row">01 / Orbital study</th><td>Glass</td><td><span class="status-pill">Complete</span></td></tr><tr><th scope="row">02 / Fern fragment</th><td>Organic</td><td><span class="status-pill pending">In progress</span></td></tr><tr><th scope="row">03 / Machine no. 03</th><td>Metal</td><td><span class="status-pill muted">Archived</span></td></tr></tbody></table></div><div class="progress-label"><label for="study-progress">Preparing a preview</label><span id="progress-value">64%</span></div><progress id="study-progress" max="100" value="64">64%</progress><button type="button" class="text-button" id="replay-progress">Replay progress ↻</button></div></section>
      <section class="sample feedback-sample"><header class="sample-heading"><h3><span class="section-index">07</span> Signals & feedback</h3>${icon("info")}</header><div class="sample-body"><p class="micro-label">Three message specimens</p><div class="alert success"><span aria-hidden="true">✓</span><div><strong>Everything is in its place.</strong><p>Your changes have been saved.</p></div></div><div class="alert warning"><span aria-hidden="true">!</span><div><strong>A small thing to consider.</strong><p>A newer version is available.</p></div></div><div class="alert error"><span aria-hidden="true">×</span><div><strong>Let’s try that again.</strong><p>This field needs your attention.</p></div></div><label class="error-field">An example of an invalid entry<input value="hello@" type="text" aria-invalid="true" aria-describedby="example-error" readonly><small id="example-error">Please include a complete email address.</small></label></div></section>
      <section class="sample notes-sample" id="details"><header class="sample-heading"><h3><span class="section-index">08</span> The character beneath</h3><span aria-hidden="true">✳</span></header><div class="sample-body"><details open><summary>What makes this style feel like itself?</summary><p>${s.principle}</p></details><details><summary>Where does it need restraint?</summary><p>${s.avoid}</p></details><details><summary>What is shared across all eight?</summary><p>The illustration subjects, UI inventory, and sample information stay the same. Each interpretation changes the composition, visual hierarchy, type, surfaces, and ornament.</p></details><div class="style-signature"><span>${s.words}</span><span aria-hidden="true">${s.id === "terminal" ? "[ EOF ]" : "✳"}</span></div></div></section>
    </div><footer class="world-footer"><span>${s.name} / Specimen ${String(index + 1).padStart(2, "0")}</span><a href="specimen.html?style=${STYLES[(index + 1) % 8].id}">Next world: ${STYLES[(index + 1) % 8].name} ${icon("arrow")}</a></footer>
  </div><dialog id="sample-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"><div class="dialog-heading"><span class="micro-label">A moment of attention</span><button type="button" class="icon-button" data-close-dialog aria-label="Close dialog">${icon("close")}</button></div><div class="dialog-symbol">${icon("globe")}</div><h2 id="dialog-title">A little possibility.</h2><p id="dialog-description">A dialog is a small pause in the conversation. It should feel like it belongs to the same world.</p><div class="button-row"><button type="button" class="ui-button secondary" data-close-dialog>Go back</button><button type="button" class="ui-button primary" id="confirm-dialog">Keep exploring ${icon("arrow")}</button></div></dialog><div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

function renderSpecimen() {
  const requested = new URLSearchParams(location.search).get("style");
  const index = Math.max(
    0,
    STYLES.findIndex((s) => s.id === requested),
  );
  const s = STYLES[index];
  document.title = `${s.name} / Eight`;
  document.querySelector('meta[name="theme-color"]').content = s.colors[1];
  document.body.classList.add(`page-${s.id}`);
  const world = document.querySelector(".world");
  world.classList.add(`theme-${s.id}`);
  document.querySelector("#browser-bar").innerHTML =
    `<a class="back-to-gallery" href="index.html"><span aria-hidden="true">←</span> All eight<span class="bar-wordmark"> / EIGHT</span></a><div class="style-picker"><label for="style-select">${String(index + 1).padStart(2, "0")} / 08</label><select id="style-select" aria-label="Choose a style">${STYLES.map((t) => `<option value="${t.id}" ${t.id === s.id ? "selected" : ""}>${t.name}</option>`).join("")}</select></div><nav class="style-pagination" aria-label="Browse styles"><a href="specimen.html?style=${STYLES[(index + 7) % 8].id}" aria-label="Previous style">←</a><a href="specimen.html?style=${STYLES[(index + 1) % 8].id}" aria-label="Next style">→</a></nav>`;
  world.innerHTML = specimenContent(s, index);
  document.querySelector("#style-select").addEventListener("change", (e) => {
    location.href = `specimen.html?style=${e.target.value}`;
  });
  wireInteractions(world);
  // The specimen is rendered after the browser's initial fragment lookup.
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target)
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "instant" }),
      );
  }
}

function wireInteractions(world) {
  let toastTimer;
  const toast = (message) => {
    const el = document.querySelector("#toast");
    el.textContent = message;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 3400);
  };
  document
    .querySelectorAll("[data-toast]")
    .forEach((el) =>
      el.addEventListener("click", () => toast(el.dataset.toast)),
    );
  document.querySelectorAll("[data-copy]").forEach((el) =>
    el.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(el.dataset.copy);
        toast(`${el.dataset.copy} copied to clipboard.`);
      } catch {
        toast(
          `Color value: ${el.dataset.copy} — select the printed value to copy.`,
        );
      }
    }),
  );
  const dialog = document.querySelector("#sample-dialog");
  document
    .querySelector("[data-open-dialog]")
    .addEventListener("click", () => dialog.showModal());
  document
    .querySelectorAll("[data-close-dialog]")
    .forEach((el) => el.addEventListener("click", () => dialog.close()));
  document.querySelector("#confirm-dialog").addEventListener("click", () => {
    dialog.close();
    toast("A little possibility, confirmed.");
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  document.querySelector("#favorite").addEventListener("click", (e) => {
    const b = e.currentTarget,
      saved = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(saved));
    b.setAttribute(
      "aria-label",
      saved ? "Unsave this study" : "Save this study",
    );
    document.querySelector(".favorite-label").textContent = saved
      ? "Saved for this visit"
      : "Save for later";
    document.querySelector("#saved-heading").textContent = saved
      ? "One little favorite."
      : "A little room for favorites.";
    document.querySelector("#saved-copy").textContent = saved
      ? "This visual study is saved while this page is open."
      : "Use the star in Actions & states to save this study for this visit.";
    toast(
      saved ? "Study saved for this visit." : "Study removed from favorites.",
    );
  });
  document.querySelector("#intensity").addEventListener("input", (e) => {
    document.querySelector("#intensity-value").value = `${e.target.value}%`;
    world.style.setProperty("--scene-saturation", Number(e.target.value) / 100);
  });
  document
    .querySelector("#show-guides")
    .addEventListener("change", (e) =>
      world.classList.toggle("show-guides", e.target.checked),
    );
  document
    .querySelector("#ambient-motion")
    .addEventListener("change", (e) =>
      world.classList.toggle("ambient-motion", e.target.checked),
    );
  document
    .querySelectorAll('[name="density"]')
    .forEach((el) =>
      el.addEventListener("change", (e) =>
        world.classList.toggle("compact-density", e.target.value === "compact"),
      ),
    );
  document.querySelector("#sample-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#feeling").value.trim();
    if (!name) {
      document
        .querySelector("#feeling")
        .setCustomValidity("Give this feeling a name.");
      document.querySelector("#feeling").reportValidity();
      return;
    }
    document.querySelector("#form-result").textContent =
      `Applied: “${name}” · ${document.querySelector("#detail-level").value.toLowerCase()}.`;
    toast("Your choices are applied for this visit.");
  });
  document
    .querySelector("#feeling")
    .addEventListener("input", (e) => e.target.setCustomValidity(""));
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      let n;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") n = (i + tabs.length - 1) % tabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      if (n !== undefined) {
        e.preventDefault();
        selectTab(tabs[n]);
        tabs[n].focus();
      }
    });
  });
  const objects = [...document.querySelectorAll(".object-item")];
  document
    .querySelector("#collection-search")
    .addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      objects.forEach(
        (item) =>
          (item.hidden = !item.textContent.toLowerCase().includes(term)),
      );
      document.querySelector("#search-empty").hidden = objects.some(
        (item) => !item.hidden,
      );
    });
  objects.forEach((item) =>
    item.addEventListener("click", () => {
      objects.forEach((o) =>
        o.setAttribute("aria-pressed", String(o === item)),
      );
      document.querySelector("#selection-note").textContent =
        `Selected: ${item.dataset.object}`;
    }),
  );
  const progress = document.querySelector("#study-progress");
  let progressTimer;
  document.querySelector("#replay-progress").addEventListener("click", () => {
    clearInterval(progressTimer);
    progress.value = 0;
    document.querySelector("#progress-value").textContent = "0%";
    progressTimer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 4);
      progress.textContent = `${progress.value}%`;
      document.querySelector("#progress-value").textContent =
        `${progress.value}%`;
      if (progress.value === 100) {
        clearInterval(progressTimer);
        toast("Preview complete.");
      }
    }, 60);
  });
}

if (document.querySelector("#gallery")) renderGallery();
else if (document.querySelector(".world")) renderSpecimen();
