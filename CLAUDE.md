# CLAUDE.md

Salih Açıkgöz'ün kişisel sitesi (CV + portfolyo). Statik HTML/CSS/JS, framework yok.
Genel bilgi için `README.md`.

## Çalışma şekli

- Kullanıcıyla Türkçe konuş.
- Değişiklikten sonra sayfayı `open -a Safari index.html` ile aç; kullanıcı kontrol edip
  "pushla" deyince commit + push yap. Push'tan sonra `gh run watch` ile FTP yayınını
  bekle ve sonucu bildir.
- Commit mesajları: `feat:` / `fix:` + Türkçe açıklama.
- Bu ortamda headless tarayıcıyla ekran görüntüsü alınamıyor (Chrome yok, Brave headless
  çalışmıyor). Görsel sonuçtan emin olmak için kullanıcıdan ekran görüntüsü iste.

## Tasarım kararları (kullanıcının tercihleri)

- Koyu tema (`--bg: #0b0f14`), vurgu rengi `--accent: #4f9dff`; logo degradesi
  mavi → mor (`#2f7bff` → `#6a2cff`).
- Header: `logo-mark.png` (SA amblemi) + "Salih Açıkgöz" yazısı.
- Profil fotoğrafı (`profile.jpg`, 608×760, bel hizası kadraj):
  - Masaüstü: hero'da sağda 320px dikey kart, 16px köşe, alt kısmı zemine karışır.
  - Mobil: kartvizit düzeni — solda 120px foto, sağında unvan + isim.
  - Kullanıcı **fazla zoom'lu kadrajı sevmedi**, mobilde de masaüstüyle aynı foto isteniyor.
  - Tam daire foto ve fotoğraf üstünde rozet/yazı **istenmiyor**.
- Meta CPAS en önemli uzmanlık; Araçlar bölümünde öne çıkarılmış.
- Öne çıkan projelerde "CPAS Türkiye" başlığı kullanılır (cpasturkiye.com değil).

## Dikkat

- `images/salihacikgoz.JPG` (orijinal foto) `.gitignore`'da; repoya/sunucuya gitmemeli.
- `*.md` dosyaları deploy'da hariç tutulur (sunucuda herkese açık olmasın).

## Yapılabilecekler

- Öne çıkan projelere görsel eklemek.
- SEO: Open Graph etiketleri (paylaşım önizlemesi için `profile.jpg`/logo).
