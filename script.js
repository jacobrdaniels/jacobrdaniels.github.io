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
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Opens in a new tab";
    a.setAttribute("aria-label", label + " (opens in a new tab)");
    const indicator = document.createElement("span");
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
