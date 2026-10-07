"use strict";

// Geneva's design pixels are 1/16 em. Snap to physical display pixels while
// keeping browser zoom available; sizes move in steps rather than continuously.
(() => {
  // Clean up old preview/bookmark URLs without reloading or losing anchors.
  const url = new URL(window.location.href);
  if (/^personal-\d+$/.test(url.searchParams.get("v") || "")) {
    url.searchParams.delete("v");
    window.history.replaceState(window.history.state, "",
      url.pathname + url.search + url.hash);
  }

  const root = document.documentElement;
  let frame = 0;
  let resolution;
  const selector = [
    "p", "dt", "dd", ".directory-label", ".directory-divider",
    ".site-footer > *", ".repository-link", ".image-placeholder figcaption",
  ].join(",");

  function align() {
    frame = 0;
    const ratio = window.devicePixelRatio || 1;
    // On an exact tie prefer the smaller step; allow for DPR floating error.
    const pixels = Math.max(1, Math.ceil(2 * ratio - 0.5 - 0.000001));
    const size = `${16 * pixels / ratio}px`;
    root.style.setProperty("--body-size", size);
    root.style.setProperty("--small-size", size);

    const candidates = [...document.querySelectorAll(selector)];
    const targets = candidates.filter(el =>
      !candidates.some(parent => parent !== el && parent.contains(el)) &&
      getComputedStyle(el).fontFamily.includes("Geneva92")
    );
    for (const el of targets) {
      el.classList.add("pixel-aligned");
      el.style.setProperty("--pixel-shift-x", "0px");
      el.style.setProperty("--pixel-shift-y", "0px");
    }

    // Read all positions before writing offsets. Relative positioning keeps
    // text selectable and avoids scaling or compositing the text as an image.
    const offsets = targets.map(el => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        const rect = [...range.getClientRects()].find(r => r.width && r.height);
        if (!rect) continue;
        const x = rect.x + window.scrollX;
        const y = rect.y + window.scrollY;
        return { el, x: Math.round(x * ratio) / ratio - x,
          y: Math.round(y * ratio) / ratio - y };
      }
      return null;
    });
    for (const offset of offsets) {
      if (!offset) continue;
      offset.el.style.setProperty("--pixel-shift-x", `${offset.x}px`);
      offset.el.style.setProperty("--pixel-shift-y", `${offset.y}px`);
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(align);
  }

  function watchResolution() {
    resolution?.removeEventListener("change", watchResolution);
    resolution = matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    resolution.addEventListener("change", watchResolution);
    schedule();
  }

  watchResolution();
  window.addEventListener("resize", schedule);
  document.fonts.ready.then(schedule);
  // Images and reflow can move text without changing the viewport.
  new ResizeObserver(schedule).observe(document.body);
})();
