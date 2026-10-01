// Keep the footer current without requiring a build step.
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
