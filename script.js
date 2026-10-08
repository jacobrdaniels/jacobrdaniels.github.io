"use strict";

// Encoding and click-to-reveal deter basic harvesting, not determined bots.
const PROFILE = {
  emailEncoded: "amFjb2JyaWxleWRhbmllbHNAZ21haWwuY29t",
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
// Do not create an address or mailto link in the DOM before user interaction.
for (const button of document.querySelectorAll("[data-email-reveal]")) {
  button.hidden = false;
  button.addEventListener("click", () => {
    const address = atob(PROFILE.emailEncoded);
    const link = document.createElement("a");
    link.href = "mailto:" + address;
    link.textContent = address;
    button.closest("[data-email-value]").replaceChildren(link);
    link.focus({ preventScroll: true });
  }, { once: true });
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
