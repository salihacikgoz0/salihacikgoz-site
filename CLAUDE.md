# CLAUDE.md

Salih Açıkgöz'ün kişisel sitesi (CV + portfolyo): https://salihacikgoz.com
Statik HTML/CSS/JS, framework yok. Genel bilgi ve dosya listesi için `README.md`.

Son güncelleme: 2026-09-30 (GA4, CV PDF, sade Araçlar etiketleri + Yapay Zeka grubu,
deploy sırası düzeltmesi, marka adları ve yüksek onur belgesi kaldırıldı).

## Çalışma şekli

- Kullanıcıyla Türkçe konuş.
- Değişiklikten sonra sayfayı `open -a Safari index.html` ile aç; kullanıcı kontrol edip
  "pushla" deyince commit + push yap. Push'tan sonra `gh run watch` ile FTP yayınını
  bekle, sonra `curl https://salihacikgoz.com/...` ile canlıda doğrula ve sonucu bildir.
- Commit mesajları: `feat:` / `fix:` / `docs:` + Türkçe açıklama.
- Proje iki bilgisayarda çalışılıyor:
  - **Mac:** sayfayı `open -a Safari index.html` ile aç. Headless ekran görüntüsü alınamıyor
    (Chrome yok, Brave headless çalışmıyor); kullanıcıdan ekran görüntüsü iste, mobil için
    Safari > Duyarlı Tasarım Modu (Opt+Cmd+R) öner. Görsel kırpma için `sips` kullan.
  - **Windows:** sayfayı `start index.html` ile aç. Chrome headless çalışıyor:
    `chrome.exe --headless=new --hide-scrollbars --window-size=1280,760 --screenshot=<png> file:///...`
    (dar genişlikte headless mobil görüntü güvenilir değil, taşma varmış gibi görünür).
    Kırpma için Python + Pillow var. `gh` kurulu: `/c/Program Files/GitHub CLI/gh.exe`.

## Sayfa yapısı (index.html, sırayla)

1. Header: `logo-mark.png` (SA amblemi) + isim; menü: Hakkımda, Yetkinlikler, Deneyim,
   Eğitim, Projeler, Araçlar, İletişim.
2. Hero: unvan, isim, açıklama, butonlar, iletişim satırı + profil fotoğrafı.
3. Rakam şeridi (`.stats`): 100+ Firmaya Reklam Çalışması · 22+ Sektörde Reklam Deneyimi ·
   %76 Reklam Başarı Oranı (kullanıcının verdiği rakamlar; "reklam çalışması" olarak geçmeli).
4. Profesyonel Özet
5. Temel Yetkinlikler (6 kart)
6. İş Deneyimi: BrotherHustle (Ara 2024 – Halen), Deniz Egece Enstitü (Eyl 2022 – Eyl 2024).
7. Eğitim: zaman çizelgesi (Topkapı YL → Anadolu AÖF ön lisans → Akdeniz lisans), altında
   ayrı "Sertifikalar" ve "Diller" blokları (`.info-cols`).
8. Öne Çıkan Projeler: Hazume, CPAS Türkiye, E-Ticaret Marka Danışmanlıkları,
   Web & Mobil Geliştirme (Deep Cafe, FBSM).
9. Araçlar & Teknolojiler: 4 grup — Reklam & Analitik, Yapay Zeka (metin, görsel, video,
   müzik, kodlama), Tasarım & Kreatif, Web & Yazılım. AI araçları kullanıcının seçtikleri; ChatGPT,
   Cursor, Copilot kullanmıyor, ekleme.
10. İletişim (4 kart + altında sade "Özgeçmiş (PDF) ↓" bağlantısı)

Bölüm zeminleri sırayla düz / `alt` değişir; bölüm eklerken sıralamayı koru.

## CV (PDF)

- Kaynak `cv/kaynak.html` (tek sayfa A4, açık tema, ATS dostu, fotoğrafsız). `cv/` deploy'a gitmez.
- Sitede bilgi değişince CV'yi de güncelle ve PDF'i yeniden üret; **tek sayfa kalmalı**
  (`/Count 1` ile kontrol et, taşarsa madde metinlerini kısalt):
  `"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer
  --print-to-pdf="<repo>\salih-acikgoz-cv.pdf" "file:///<repo>/cv/kaynak.html"`
- İndirmeler GA4'e `cv_download` olayı olarak gider.
- Kullanıcı CV'yi hero'da **istemedi** ve iddialı kart/buton sevmedi ("çok arayıştaymışım
  gibi"); sadece iletişimde sade, küçük bir bağlantı olarak kalmalı.

## Kişisel bilgiler (kaynak: kullanıcı + LinkedIn PDF)

- Güncel iş: **BrotherHustle**. LinkedIn'de hâlâ eski adı "İşim Dijital" yazıyor —
  siteye **İşim Dijital yazma**, BrotherHustle kalacak.
- Eğitim:
  - İstanbul Topkapı Üniversitesi — Yapay Zeka, Tezli Yüksek Lisans (2026 – devam)
  - Anadolu Üniversitesi Açıköğretim — Yapay Zeka Destekli Kodlama, Ön Lisans (2026 – devam)
  - Akdeniz Üniversitesi — İşletme Enformatiği, Lisans (2018 – 2022), 3.70, bölüm birincisi
    (Yüksek Onur Belgesi de var ama kullanıcı sitede/CV'de **istemedi**)
- Sertifika: Makine Öğrenmesi Operasyonları 101. Diller: Türkçe (ana dil), İngilizce
  (profesyonel çalışma).
- Deniz Egece: LinkedIn özetinde "Yönetim Bilişim Sistemi Uzmanı" da geçiyor; sitede
  "Dijital Pazarlama Uzmanı" kullanılıyor.

## Tasarım kararları (kullanıcının tercihleri)

- Koyu tema (`--bg: #0b0f14`), vurgu `--accent: #4f9dff`; logo degradesi
  mavi → mor (`#2f7bff` → `#6a2cff`), rakamlar da bu degradeyle.
- Profil fotoğrafı (`profile.jpg`, 608×760, bel hizası kadraj):
  - Masaüstü: hero'da sağda 320px dikey kart, 16px köşe, alt kısmı zemine karışır.
  - Mobil: kartvizit düzeni — solda 120px foto (14px köşe), sağında unvan + isim.
  - Kullanıcı **fazla zoom'lu kadrajı sevmedi**; mobilde de masaüstüyle aynı foto.
  - Tam daire foto ve fotoğraf üstünde rozet/yazı **istenmiyor**.
- Farklı türde bilgileri (okul / sertifika / dil) aynı kart ızgarasına **koyma**;
  kullanıcı bunu sevmedi, ayrı bloklar istiyor.
- Meta CPAS en önemli uzmanlık ama Araçlar'da **ayrıca işaretlenmiyor** (kullanıcı istemedi);
  tüm etiketler aynı, sade/koyu. Dolgulu mavi etiket "seçili buton/filtre" gibi duruyordu.
- "Araçlar & Teknolojiler" başlığı kalsın (alternatifler önerildi, kullanıcı değiştirmedi).
- Öne çıkan projelerde "CPAS Türkiye" başlığı (cpasturkiye.com değil).
- E-Ticaret Marka Danışmanlıkları'nda müşteri marka adı (asfamoda, Kozagen vb.) **yazma**.
- Hazume kullanıcının kendi projesi: ev hanımlarının evde yaptığı yemekleri satabildiği
  sipariş platformu. Reklam/pazarlama projesi gibi anlatma; rakip marka adı (Yemeksepeti
  vb.) geçirme. "Kendi girişimim" gibi ifadeler de istenmiyor.

## Dikkat

- `images/salihacikgoz.JPG` (orijinal foto) ve `Profile.pdf` (LinkedIn dışa aktarımı)
  `.gitignore`'da; sadece ilk bilgisayarda var, repoya/sunucuya gitmemeli.
- `*.md` dosyaları deploy'da hariç tutulur (sunucuda herkese açık olmasın).
- Site Cloudflare arkasında; CSS/JS/görseller 7 gün önbellekleniyor. `index.html`'deki her
  yerel dosya adresi `?v=dev` ile bitmeli (ör. `images/yeni.png?v=dev`). Deploy sırasında
  `?v=dev` commit kodu ile değiştirilir, böylece her yayında önbellek atlanır.
- Deploy önce diğer dosyaları, `index.html`'i **en son** yükler (ayrı adım, curl ile). Yayın
  sırasında yeni `?v=` adresli CSS/PDF'e istek atma: yarım dosya Cloudflare'de 7 gün kalır
  (2026-09-30'da oldu). Canlı kontrolü `index.html` yeni `?v=` kodunu gösterdikten sonra yap.

## SEO

- Head'de og/twitter etiketleri (görsel `images/og-image.jpg`, 1200×630), canonical ve
  schema.org Person JSON-LD var. İş/eğitim değişince **JSON-LD'yi de güncelle**.
- Site Google Search Console'a eklendi, `sitemap.xml` gönderildi (2026-09-30).
- GA4 kurulu (`G-B23FWT14V4`, head'de gtag). `script.js` e-posta/telefon/LinkedIn tıklamalarını
  `contact_click` olayı (`method` parametresi) olarak gönderir.
- İçerik değişince `sitemap.xml` içindeki `<lastmod>` tarihini güncelle.

## Kaldığımız yer (2026-09-30)

Son oturumda yapılanlar hepsi yayında (son commit `1b9f9f3`). Açık kalanlar:
- **Kullanıcıya sor:** Google dizine ekleme tamamlandı mı? (`site:salihacikgoz.com`; hafızada
  hatırlatma notu da var.)
- **Kullanıcı yapacak (GA4):** `contact_click`'i önemli etkinlik olarak işaretlemek ve `method`
  için "İletişim yöntemi" özel boyutu oluşturmak (Yönetici > Etkinlikler / Özel tanımlar).
- **Windows'ta `gh` girişi yapılmadı:** `"/c/Program Files/GitHub CLI/gh.exe" auth login --web`
  (kullanıcı `!` ile çalıştırmalı). O zamana kadar yayını canlı siteyi yoklayarak doğrula.
- Mobil görünüm son değişikliklerden sonra gerçek cihazda kontrol edilmedi (Araçlar'daki yeni
  Yapay Zeka grubu, iletişimdeki CV bağlantısı); fırsat olunca kullanıcıdan ekran görüntüsü iste.

## Yapılabilecekler

- Deneyim/projelere somut rakamlar (ROAS, CPL vb.) ve projeleri vaka çalışmasına çevirmek
  (sorun → yapılan → sonuç + görsel). Kullanıcıdan veri gerekiyor.
- Öne çıkan projelere görsel eklemek.
- Referans/müşteri yorumları; çalışılan marka logoları (kullanıcı projede marka adı istemedi,
  logolar için önce sor).
- İngilizce sürüm (TR/EN geçişi).
- Mobil hero (kullanıcı "şimdilik dursun" dedi, 2026-09-28): fotoğrafı masaüstündeki gibi
  **sağa** alıp 130-140px'e büyütmek; solda unvan + isim, açıklama ve butonlar altta tam
  genişlik. Fotoğrafı tüm girişin (paragraf dahil) yanına koymak önerilmedi: ~350px
  ekranda metne ~195px kalıyor, paragraf 12-14 satıra sıkışıyor.
