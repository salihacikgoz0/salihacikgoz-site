# Salih Açıkgöz — Kişisel Site (CV + Portfolyo)

Dijital Pazarlama & E-Ticaret Pazaryeri Uzmanı Salih Açıkgöz'ün kişisel web sitesi.
Framework ya da build adımı olmayan, tek sayfalık statik bir site.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `index.html` | Tüm sayfa içeriği (hero, özet, yetkinlikler, deneyim, eğitim, projeler, araçlar, iletişim); GA4 etiketi head'de |
| `style.css` | Tüm stiller; renkler `:root` değişkenlerinde, mobil kurallar `@media (max-width: 780px)` altında |
| `script.js` | Mobil menü aç/kapa; GA4 olayları (`contact_click`, `cv_download`) |
| `salih-acikgoz-cv.pdf` | İletişim bölümünden indirilen tek sayfalık CV |
| `cv/kaynak.html` | CV'nin kaynağı; PDF buradan Chrome ile üretilir (sunucuya yüklenmez) |
| `images/` | `logo.png` (orijinal logo), `logo-mark.png` (header amblemi), `icon-192.png` + `apple-touch-icon.png` (site ikonu; kökte `favicon.ico`), `profile.jpg` (profil fotoğrafı), `og-image.jpg` (paylaşım önizlemesi, 1200×630) |
| `robots.txt`, `sitemap.xml` | Arama motorları için tarama izni ve site haritası |
| `.github/workflows/deploy.yml` | `main`'e her push'ta Natro'ya FTP ile otomatik yayın (`?v=dev` → commit kodu; `index.html` en son yüklenir) |
| `CLAUDE.md` | Claude Code için proje notları, tasarım kararları ve yapılacaklar |

## Yerelde bakmak

`index.html` dosyasını tarayıcıda açmak yeterli. Mobil görünüm için Safari'de
**Geliştir > Duyarlı Tasarım Modu** (Opt + Cmd + R), Chrome/Edge'de F12 > Ctrl + Shift + M.

## CV'yi güncellemek

Sitede iş, eğitim veya araç bilgisi değişince `cv/kaynak.html`'i de güncelleyip PDF'i yeniden
üretin (Windows, Chrome):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer \
  --print-to-pdf="$(cygpath -w "$PWD")\salih-acikgoz-cv.pdf" "file:///$(cygpath -m "$PWD")/cv/kaynak.html"
```

CV tek sayfa kalmalı; taşarsa madde metinlerini kısaltın.

## Yayınlama

`main` dalına push edildiğinde GitHub Actions siteyi FTP ile Natro'daki `/public_html/`
klasörüne yükler. FTP bilgileri repo ayarlarında **Secrets** olarak durur
(`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`).

```bash
git add .
git commit -m "feat: ..."
git push origin main
gh run watch   # yayının bitmesini izlemek için
```

## Başka bir cihazda devam etmek

```bash
git clone https://github.com/salihacikgoz0/salihacikgoz-site.git
cd salihacikgoz-site
```

Sonra klasörde `claude` çalıştırmak yeterli; `CLAUDE.md` otomatik okunur.

Not: Orijinal kişisel fotoğraf (`images/salihacikgoz.JPG`) ve LinkedIn PDF'i (`Profile.pdf`)
bilerek repoya konmadı; sadece ilk bilgisayarda durur. Sitede kırpılmış görseller kullanılır.
Yeni cihazda fotoğrafla ilgili bir kırpma gerekirse orijinal fotoğrafı klasöre tekrar koyun.

## Önbellek (Cloudflare)

Site Cloudflare arkasında. `index.html` içindeki her yerel dosya adresi `?v=dev` ile
bitmeli (ör. `images/yeni.png?v=dev`); yayında bu otomatik olarak commit koduna çevrilir
ve ziyaretçiler her zaman güncel dosyayı alır.

Yayın önce diğer dosyaları, `index.html`'i en son yükler. Böylece yeni sürüm adresleri, dosyalar
sunucuya tamamen çıkmadan istenmez (aksi halde yarım dosya Cloudflare'de 7 gün kalabilir).

## Ölçüm

- **Google Search Console:** site ekli, `sitemap.xml` gönderildi.
- **Google Analytics (GA4):** `G-B23FWT14V4`. Özel olaylar: `contact_click` (`method`: email /
  phone / linkedin) ve `cv_download`.
