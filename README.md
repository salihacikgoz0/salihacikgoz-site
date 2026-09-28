# Salih Açıkgöz — Kişisel Site (CV + Portfolyo)

Dijital Pazarlama & E-Ticaret Pazaryeri Uzmanı Salih Açıkgöz'ün kişisel web sitesi.
Framework ya da build adımı olmayan, tek sayfalık statik bir site.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `index.html` | Tüm sayfa içeriği (hero, özet, yetkinlikler, deneyim, projeler, araçlar, iletişim) |
| `style.css` | Tüm stiller; renkler `:root` değişkenlerinde, mobil kurallar `@media (max-width: 780px)` altında |
| `script.js` | Mobil menü aç/kapa |
| `images/` | `logo.png` (orijinal logo), `logo-mark.png` (header amblemi), `favicon.png`, `profile.jpg` (profil fotoğrafı) |
| `.github/workflows/deploy.yml` | `main`'e her push'ta Natro'ya FTP ile otomatik yayın |

## Yerelde bakmak

`index.html` dosyasını tarayıcıda açmak yeterli. Mobil görünüm için Safari'de
**Geliştir > Duyarlı Tasarım Modu** (Opt + Cmd + R).

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

Not: Orijinal kişisel fotoğraf (`images/salihacikgoz.JPG`) bilerek repoya konmadı;
sadece ilk bilgisayarda durur. Sitede kırpılmış `images/profile.jpg` kullanılır.
