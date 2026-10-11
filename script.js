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
    const { prefix, target, suffix } = el.dataset;
    const duration = 2500;
    const start = performance.now() + 400; // kısa bekleme: göz rakamlara gelsin
    const tick = (now) => {
      const t = Math.max(0, Math.min((now - start) / duration, 1));
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
  }, { threshold: 1 });

  // Sayfa açılınca 0'dan başlasın; son değer data-* içinde saklanır
  document.querySelectorAll(".stat-value").forEach((el) => {
    const [, prefix, num, suffix] = el.textContent.match(/^(\D*)(\d+)(\D*)$/) || [];
    if (!num) return;
    Object.assign(el.dataset, { prefix, target: num, suffix });
    el.textContent = prefix + 0 + suffix;
    statObserver.observe(el);
  });
}

// Bölümler kaydırdıkça hafifçe aşağıdan belirir; ızgaralardaki kartlar sırayla gelir
if (!reduceMotion && "IntersectionObserver" in window) {
  const groups = ".grid, .timeline, .info-cols, .contact-grid";
  const targets = [];
  document.querySelectorAll(".section").forEach((section) => {
    [...section.children].forEach((child) => {
      if (child.matches(groups)) {
        [...child.children].forEach((item, i) => {
          item.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
          targets.push(item);
        });
      } else {
        targets.push(child);
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("in");
      revealObserver.unobserve(el);
      // Bitince sınıfları kaldır: kartların kendi hover geçişleri bozulmasın
      // (başlıkta çizginin bitmesini bekle)
      const last = el.matches(".section-title") ? "::after" : "";
      const done = (e) => {
        if (e.target !== el || e.propertyName !== "transform" || e.pseudoElement !== last) return;
        el.classList.remove("reveal", "in");
        el.style.transitionDelay = "";
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  targets.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}
