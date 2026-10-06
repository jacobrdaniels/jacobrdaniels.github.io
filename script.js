"use strict";

// Add real details here when ready. Blank values preserve the visible placeholders.
const PROFILE = {
  email: "",
  linkedin: "",
  location: "",
};

for (const el of document.querySelectorAll("[data-year]")) {
  el.textContent = new Date().getFullYear();
}
if (PROFILE.location.trim()) {
  for (const el of document.querySelectorAll("[data-location]")) {
    el.textContent = PROFILE.location;
    el.closest(".location-line").hidden = false;
  }
}
function contactLink(container, href, label, newTab = false) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = label;
  if (newTab) {
    a.className = "icon-link";
    const text = document.createElement("span");
    text.className = "link-label";
    text.textContent = label;
    a.replaceChildren(text);
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Opens in a new tab";
    a.setAttribute("aria-label", label + " (opens in a new tab)");
    const indicator = document.createElement("span");
    indicator.className = "new-tab-indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = " ↗";
    a.append(indicator);
  }
  container.replaceChildren(a);
}
if (PROFILE.email.trim()) {
  for (const el of document.querySelectorAll("[data-email-value]")) {
    contactLink(el, "mailto:" + PROFILE.email, PROFILE.email);
  }
}
if (PROFILE.linkedin.trim()) {
  try {
    const url = new URL(PROFILE.linkedin);
    if (
      url.protocol === "https:" &&
      (url.hostname === "linkedin.com" ||
        url.hostname.endsWith(".linkedin.com"))
    ) {
      for (const a of document.querySelectorAll("[data-linkedin-nav]"))
        a.href = url.href;
      for (const el of document.querySelectorAll("[data-linkedin-value]"))
        contactLink(el, url.href, "LinkedIn profile", true);
    }
  } catch {
    /* Keep placeholders if the profile URL is incomplete. */
  }
}

// Return to the page origin without adding a fragment entry to browser history.
for (const link of document.querySelectorAll("[data-back-to-top]")) {
  link.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
    }
    document.body.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
}
