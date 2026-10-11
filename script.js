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
document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href*="linkedin.com"], .social-links a').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag !== "function") return;
    const href = link.getAttribute("href");
    const method = href.startsWith("mailto:") ? "email" : href.startsWith("tel:") ? "phone"
      : href.includes("instagram.com") ? "instagram" : href.includes("x.com") ? "x" : href.includes("medium.com") ? "medium" : "linkedin";
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

// Rakam şeridi: ekrana gelince 0'dan sayarak artar (metin HTML'de son haliyle durur)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  const countUp = (el) => {
    const [, prefix, num, suffix] = el.textContent.match(/^(\D*)(\d+)(\D*)$/) || [];
    if (!num) return;
    const target = Number(num);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".stat-value").forEach((el) => statObserver.observe(el));
}
