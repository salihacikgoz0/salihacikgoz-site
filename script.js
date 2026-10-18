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

// GA4: CV indirmelerini ölç (TR ve EN CV; hangisi olduğu `lang` ile)
document.querySelectorAll(".cv-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag !== "function") return;
    gtag("event", "cv_download", { lang: document.documentElement.lang });
  });
});

// Dil geçişi (TR ↔ EN): karşı sayfa tam aynı noktada açılsın. O an bakılan bölüm ve bölümün yüzde kaçında
// olunduğu kaydedilir (metin uzunlukları farklı, piksel tutmaz); GA4'e ölç
document.querySelectorAll(".lang-switch").forEach((link) => {
  link.addEventListener("click", () => {
    const current = [...document.querySelectorAll("main section[id]")]
      .filter((s) => s.getBoundingClientRect().top <= 1).pop();
    const b = link.getBoundingClientRect();
    const jump = { x: b.left + b.width / 2, y: b.top + b.height / 2, t: Date.now() };
    if (current && scrollY > 0) {
      const r = current.getBoundingClientRect();
      Object.assign(jump, { id: current.id, ratio: -r.top / r.height });
    }
    try { sessionStorage.setItem("langJump", JSON.stringify(jump)); } catch (e) {}
    document.documentElement.classList.add("vt-lang"); // eski sayfa: dairesel geçişte arkada küçülür
    if (typeof gtag !== "function") return;
    gtag("event", "lang_switch", { to: link.getAttribute("hreflang") });
  });
});

// Sayı biçimi sayfanın diline göre (TR: 16,4 · EN: 16.4)
const numLocale = document.documentElement.lang === "en" ? "en-US" : "tr-TR";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Dil geçişiyle gelindiyse: kaydırmaya bağlı belirme animasyonları oynamasın (sayfa hazır halde gelsin)
let langJump = null;
try {
  langJump = JSON.parse(sessionStorage.getItem("langJump"));
  sessionStorage.removeItem("langJump");
} catch (e) {}
if (langJump && Date.now() - langJump.t > 10000) langJump = null;
if (langJump && langJump.id && !document.getElementById(langJump.id)) delete langJump.id;
const calm = reduceMotion || !!(langJump && langJump.id);

// Dil geçişi: daire ayarı <head>'deki satır içi script'te (ilk çizimden önce); bitince işaret kaldırılır
if (langJump) {
  const root = document.documentElement;
  const clear = () => root.classList.remove("vt-lang");
  addEventListener("pagereveal", (e) => {
    if (e.viewTransition) e.viewTransition.finished.then(clear, clear);
    else clear();
  }, { once: true });
  setTimeout(clear, 2000);
}
// Geri tuşuyla önbellekten dönülürse eski sayfadaki işaret kalmasın
addEventListener("pageshow", (e) => { if (e.persisted) document.documentElement.classList.remove("vt-lang"); });

// Rakam şeridi: belirirken hızlıca sayarak artar (metin HTML'de son haliyle durur)
if (!calm && "IntersectionObserver" in window) {
  const countUp = (el) => {
    const { prefix, target, suffix } = el.dataset;
    const duration = 1200;
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
  }, { threshold: 0 }); // bir kısmı görünür görünmez başla, 0+ beklemesin

  document.querySelectorAll(".stat-value").forEach((el) => {
    const [, prefix, num, suffix] = el.textContent.match(/^(\D*)(\d+)(\D*)$/) || [];
    if (!num) return;
    Object.assign(el.dataset, { prefix, target: num, suffix });
    el.textContent = prefix + 0 + suffix;
    statObserver.observe(el);
  });
}

// Bölümler kaydırdıkça hafifçe aşağıdan belirir; ızgaralardaki kartlar sırayla gelir
if (!calm && "IntersectionObserver" in window) {
  const groups = ".grid, .timeline, .info-cols, .contact-grid, .brands-grid, .results-figures, .cases";
  const targets = [];
  // Rakam şeridi de bölümler gibi: üç rakam sırayla belirir
  document.querySelectorAll(".stats .stat").forEach((stat, i) => {
    stat.style.transitionDelay = `${i * 120}ms`;
    targets.push(stat);
  });
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

// GA4: marka logolarına tıklamaları ölç
document.querySelectorAll(".brand").forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag !== "function") return;
    gtag("event", "brand_click", { brand: link.textContent.trim() });
  });
});

// Kartlarda fareyi takip eden ışık
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".card, .contact-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// Üstte kaydırma ilerleme çubuğu
const progress = document.querySelector(".scroll-progress");
if (progress) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty("--p", max > 0 ? Math.min(scrollY / max, 1) : 0);
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

// İsim harf harf belirsin (ekran okuyucu için aria-label'da düz metin kalır)
const heroName = document.querySelector(".hero h1");
if (heroName && !calm) {
  const text = heroName.textContent.trim();
  heroName.setAttribute("aria-label", text);
  let i = 0;
  heroName.innerHTML = text.split(" ").map((word) =>
    `<span class="word" aria-hidden="true">${[...word].map((c) => `<span class="ch" style="--i:${i++}">${c}</span>`).join("")}</span>`
  ).join(" ");
}

const finePointer = !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Fotoğraf fareye göre 3D eğilir
const heroPhoto = document.querySelector(".hero-photo");
if (heroPhoto && finePointer) {
  heroPhoto.addEventListener("pointermove", (e) => {
    const r = heroPhoto.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    heroPhoto.classList.add("tilting");
    heroPhoto.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    heroPhoto.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    heroPhoto.style.setProperty("--gx", `${x * 100}%`);
    heroPhoto.style.setProperty("--gy", `${y * 100}%`);
  });
  heroPhoto.addEventListener("pointerleave", () => {
    heroPhoto.classList.remove("tilting");
    heroPhoto.style.setProperty("--rx", "0deg");
    heroPhoto.style.setProperty("--ry", "0deg");
  });
}

// Mıknatıslı butonlar
if (finePointer) {
  document.querySelectorAll(".hero-actions .btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.classList.add("magnet");
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.classList.remove("magnet");
      btn.style.transform = "";
    });
  });
}

// Menüde o an bakılan bölümü işaretle
if ("IntersectionObserver" in window) {
  const navMap = new Map();
  navLinks.querySelectorAll('a[href^="#"]').forEach((a) => {
    const sec = document.querySelector(a.getAttribute("href"));
    if (sec) navMap.set(sec, a);
  });
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.querySelectorAll("a.active").forEach((a) => a.classList.remove("active"));
      navMap.get(entry.target)?.classList.add("active"); // hero'da hiçbiri seçili değil
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navMap.set(document.getElementById("top"), null);
  navMap.forEach((a, sec) => sec && navObserver.observe(sec));
}

// Zaman çizelgesi çizgisi: firma ekrana girince bir kez çizilir
if (!calm && "IntersectionObserver" in window) {
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("line-pending");
      lineObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.add("line-pending");
    lineObserver.observe(item);
  });
}

// Araç etiketleri grup görününce sırayla gelir
if (!calm && "IntersectionObserver" in window) {
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.replace("pending", "pop");
      tagObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".tool-group .tags").forEach((tags) => {
    [...tags.children].forEach((tag, i) => tag.style.setProperty("--i", i));
    tags.classList.add("pending");
    tagObserver.observe(tags);
  });
}

// Marka logoları fareye göre 3D eğilir
if (finePointer) {
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.addEventListener("pointermove", (e) => {
      const r = brand.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      brand.classList.add("tilting");
      brand.style.setProperty("--ry", `${(x - 0.5) * 24}deg`);
      brand.style.setProperty("--rx", `${(0.5 - y) * 24}deg`);
      brand.style.setProperty("--gx", `${x * 100}%`);
      brand.style.setProperty("--gy", `${y * 100}%`);
    });
    brand.addEventListener("pointerleave", () => brand.classList.remove("tilting"));
  });
}

// Menü kaydırınca hapa dönüşür
const navBar = document.querySelector(".nav");
if (navBar) {
  const onScroll = () => navBar.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Özet: kaydırdıkça kelime kelime aydınlanır; bir kez yanan kelime yanık kalır
const summary = document.querySelector(".summary");
if (summary && !calm) {
  const wrapWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const span = document.createElement("span");
          span.className = "sw";
          span.textContent = part;
          frag.append(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      }
    });
  };
  wrapWords(summary);
  const words = [...summary.querySelectorAll(".sw")];
  summary.classList.add("scrolly");
  let lit = 0;
  const updateWords = () => {
    const r = summary.getBoundingClientRect();
    // Paragrafın üstü ekranın %85'indeyken başla, altı %55'e gelince bitsin
    const start = innerHeight * 0.85, end = innerHeight * 0.55;
    const progress = (start - r.top) / (start - end + r.height);
    const target = Math.max(0, Math.min(words.length, Math.ceil(progress * words.length)));
    for (; lit < target; lit++) words[lit].classList.add("on");
    if (lit >= words.length) removeEventListener("scroll", onWordsScroll);
  };
  let wordsTicking = false;
  const onWordsScroll = () => {
    if (wordsTicking) return;
    wordsTicking = true;
    requestAnimationFrame(() => { updateWords(); wordsTicking = false; });
  };
  addEventListener("scroll", onWordsScroll, { passive: true });
  updateWords();
}

// Bölüm başlıklarını kelimelere böl (maskeli kayma için); ekran okuyucu düz metni okur
if (!calm) {
  document.querySelectorAll(".section-title").forEach((title) => {
    const text = title.textContent.trim();
    title.setAttribute("aria-label", text);
    title.textContent = "";
    text.split(/\s+/).forEach((word, i) => {
      const w = document.createElement("span");
      w.className = "w";
      w.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--i", i);
      w.append(inner);
      title.append(w, " ");
    });
  });
}

// Harf karışması: harfler rastgele karakterlerden sırayla çözülür
const scrambleChars = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ#%&*+<>/";
const scramble = (el, duration = 600) => {
  if (el.dataset.scrambling) return;
  const original = el.dataset.text || (el.dataset.text = el.textContent);
  el.dataset.scrambling = "1";
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const fixed = Math.floor(t * original.length);
    el.textContent = [...original].map((c, i) =>
      i < fixed || c === " " ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
    ).join("");
    if (t < 1) requestAnimationFrame(tick);
    else { el.textContent = original; delete el.dataset.scrambling; }
  };
  requestAnimationFrame(tick);
};
if (!calm) {
  const eyebrow = document.querySelector(".hero .eyebrow");
  if (eyebrow) {
    eyebrow.setAttribute("aria-label", eyebrow.textContent);
    setTimeout(() => scramble(eyebrow, 1100), 100);
  }
}

// Dev SA amblemi görününce yükselir
const bigMark = document.querySelector(".big-mark");
if (bigMark && !calm && "IntersectionObserver" in window) {
  bigMark.classList.add("pending");
  const markObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    bigMark.classList.remove("pending");
    markObserver.disconnect();
  }, { threshold: 0.2 });
  markObserver.observe(bigMark);
}

// Altbilgide İstanbul saati
const localTime = document.getElementById("localTime");
if (localTime) {
  const fmt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
  const updateTime = () => { localTime.textContent = fmt.format(new Date()); };
  updateTime();
  setInterval(updateTime, 15000);
}

// Sonuçlar: büyük rakamlar görününce sayar (ondalık ayracı sayfanın diline göre), vaka çubukları soldan dolar
if (!calm && "IntersectionObserver" in window) {
  const fmtNum = (v, d) => v.toLocaleString(numLocale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const rfObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      rfObserver.unobserve(el);
      const { count, prefix = "", suffix = "", decimals = "0" } = el.dataset;
      const target = parseFloat(count), d = parseInt(decimals, 10), final = el.textContent;
      const start = performance.now(), duration = 1400;
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = t < 1 ? prefix + fmtNum(target * eased, d) + suffix : final;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".rf-value[data-count]").forEach((el) => rfObserver.observe(el));

  const cases = document.querySelector(".cases");
  if (cases) {
    cases.classList.add("bar-pending");
    const barObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      cases.classList.remove("bar-pending");
      barObserver.disconnect();
    }, { threshold: 0.3 });
    barObserver.observe(cases);
  }
}

// Logo / yukarı çık: ana sayfadayken (TR ya da EN) yenilemeden başa kay, adres çubuğunda #etiket kalmasın
if (document.getElementById("top")) {
  document.querySelectorAll(".logo, .footer-brand, .to-top").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.classList.remove("open");
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", location.pathname + location.search);
    });
  });
}

// Dil geçişiyle gelindiyse kaldığı noktaya anında kaydır (ilk çizimden önce; geçiş efekti bu hali gösterir)
if (langJump && langJump.id) {
  const section = document.getElementById(langJump.id);
  const top = section.getBoundingClientRect().top + scrollY + langJump.ratio * section.offsetHeight;
  window.scrollTo({ top, behavior: "instant" });
}
