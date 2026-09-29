document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// GA4: iletişim tıklamalarını ayrı olay olarak ölç
document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href*="linkedin.com"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag !== "function") return;
    const href = link.getAttribute("href");
    const method = href.startsWith("mailto:") ? "email" : href.startsWith("tel:") ? "phone" : "linkedin";
    gtag("event", "contact_click", { method });
  });
});

// GA4: CV indirmelerini ölç
document.querySelectorAll('a[href^="salih-acikgoz-cv.pdf"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag !== "function") return;
    gtag("event", "cv_download");
  });
});
