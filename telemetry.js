"use strict";
(() => {
  if (!["jrdaniels.net", "www.jrdaniels.net"].includes(location.hostname)) return;
  const endpoint = "https://stats.jrdaniels.net/collect";
  let sent = 0;
  function cleanUrl(value) {
    try {
      const url = new URL(value, location.href);
      if (["mailto:", "tel:"].includes(url.protocol)) return url.protocol;
      if (!["https:", "http:"].includes(url.protocol)) return "";
      return (url.origin + url.pathname).slice(0, 768);
    } catch { return ""; }
  }
  function track(kind, link) {
    if (sent >= 100) return;
    sent++;
    let timezone = "";
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}
    const target = link ? cleanUrl(link.href) : "";
    const event = {
      kind, page: cleanUrl(location.href), target,
      referrer: document.referrer ? cleanUrl(document.referrer) : "",
      time: new Date().toISOString(), language: navigator.language,
      timezone, viewportWidth: innerWidth, viewportHeight: innerHeight,
      screenWidth: screen.width, screenHeight: screen.height, pixelRatio: devicePixelRatio,
      linkText: link && !["mailto:", "tel:"].includes(target) ? (link.textContent || link.getAttribute("aria-label") || "").trim().slice(0, 120) : "",
    };
    // A simple CORS request survives navigation; no cookies, local storage, or visitor ID.
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(event), credentials: "omit", keepalive: true }).catch(() => {});
  }
  function start() {
    track("pageview");
    const clicked = event => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link || link.hasAttribute("data-back-to-top") || !cleanUrl(link.href)) return;
      track("click", link);
    };
    document.addEventListener("click", clicked);
    document.addEventListener("auxclick", clicked);
  }
  // Avoid recording a prerendered page before it is actually viewed.
  if (document.prerendering) document.addEventListener("prerenderingchange", start, { once: true });
  else start();
})();
