# CLAUDE.md

Salih Açıkgöz'ün kişisel sitesi (CV + portfolyo): https://salihacikgoz.com
Statik HTML/CSS/JS, framework yok. Genel bilgi ve dosya listesi için `README.md`.

Son güncelleme: 2026-09-29 (son commit: SEO — og etiketleri, JSON-LD, robots, sitemap).

## Çalışma şekli

- Kullanıcıyla Türkçe konuş.
- Değişiklikten sonra sayfayı `open -a Safari index.html` ile aç; kullanıcı kontrol edip
  "pushla" deyince commit + push yap. Push'tan sonra `gh run watch` ile FTP yayınını
  bekle, sonra `curl https://salihacikgoz.com/...` ile canlıda doğrula ve sonucu bildir.
- Commit mesajları: `feat:` / `fix:` / `docs:` + Türkçe açıklama.
- Bu ortamda headless tarayıcıyla ekran görüntüsü alınamıyor (Chrome yok, Brave headless
  çalışmıyor). Görsel sonuçtan emin olmak için kullanıcıdan ekran görüntüsü iste.
  Mobil kontrol için kullanıcıya Safari > Duyarlı Tasarım Modu (Opt+Cmd+R) öner.
- Görsel kırpma için `sips` kullan (Pillow yüklü değil); kırptıktan sonra Read ile bak.

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
9. Araçlar & Teknolojiler: 3 grup — Reklam & Analitik, Tasarım & Kreatif, Web & Yazılım.
10. İletişim

Bölüm zeminleri sırayla düz / `alt` değişir; bölüm eklerken sıralamayı koru.

## Kişisel bilgiler (kaynak: kullanıcı + LinkedIn PDF)

- Güncel iş: **BrotherHustle**. LinkedIn'de hâlâ eski adı "İşim Dijital" yazıyor —
  siteye **İşim Dijital yazma**, BrotherHustle kalacak.
- Eğitim:
  - İstanbul Topkapı Üniversitesi — Yapay Zeka, Tezli Yüksek Lisans (2026 – devam)
  - Anadolu Üniversitesi Açıköğretim — Yapay Zeka Destekli Kodlama, Ön Lisans (2026 – devam)
  - Akdeniz Üniversitesi — İşletme Enformatiği, Lisans (2018 – 2022), 3.70, bölüm birincisi,
    Yüksek Onur Belgesi
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
- Meta CPAS en önemli uzmanlık; Araçlar'da öne çıkarılmış (`tag-featured`).
- Öne çıkan projelerde "CPAS Türkiye" başlığı (cpasturkiye.com değil).
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

## SEO

- Head'de og/twitter etiketleri (görsel `images/og-image.jpg`, 1200×630), canonical ve
  schema.org Person JSON-LD var. İş/eğitim değişince **JSON-LD'yi de güncelle**.
- Site Google Search Console'a eklendi, `sitemap.xml` gönderildi (2026-09-30).
- GA4 kurulu (`G-B23FWT14V4`, head'de gtag). `script.js` e-posta/telefon/LinkedIn tıklamalarını
  `contact_click` olayı (`method` parametresi) olarak gönderir.
- İçerik değişince `sitemap.xml` içindeki `<lastmod>` tarihini güncelle.

## Yapılabilecekler

- Deneyim/projelere somut rakamlar (ROAS, CPL vb.) ve projeleri vaka çalışmasına çevirmek
  (sorun → yapılan → sonuç + görsel). Kullanıcıdan veri gerekiyor.
- Öne çıkan projelere görsel eklemek.
- PDF CV indirme butonu; referans/müşteri yorumları; çalışılan marka logoları.
- İngilizce sürüm (TR/EN geçişi).
- Mobil hero (kullanıcı "şimdilik dursun" dedi, 2026-09-28): fotoğrafı masaüstündeki gibi
  **sağa** alıp 130-140px'e büyütmek; solda unvan + isim, açıklama ve butonlar altta tam
  genişlik. Fotoğrafı tüm girişin (paragraf dahil) yanına koymak önerilmedi: ~350px
  ekranda metne ~195px kalıyor, paragraf 12-14 satıra sıkışıyor.
