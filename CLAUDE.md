# CLAUDE.md

Salih Açıkgöz'ün kişisel sitesi (CV + portfolyo): https://salihacikgoz.com
Statik HTML/CSS/JS, framework yok. Genel bilgi ve dosya listesi için `README.md`.

Son güncelleme: 2026-10-17 (büyük görsel/hareket yenilemesi: ikonlar, bento, proje kapakları, cam
rakamlar, yüzen menü, açılış koreografisi, dev SA amblemli altbilgi; ayrıntılar "Hareketler ve
görsel dil (2026-10-17)" maddesinde).
Önceki: 2026-10-11 (sosyal medya ikonları, hareketler, firma/okul logoları, Markalar, WebP).

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
   Markalar, Eğitim, Projeler, Araçlar, Yazılar, İletişim. Kaydırınca (>40px) yüzen cam hapa
   dönüşür (`.nav.scrolled`), ilerleme çubuğu (`.scroll-progress`) hapın altında; o an bakılan
   bölümün menü bağlantısı degrade alt çizgiyle işaretli (`a.active`, sadece masaüstü).
2. Hero: unvan, isim, açıklama, butonlar, iletişim satırı + profil fotoğrafı.
3. Rakam şeridi (`.stats`): 100+ Firmaya Reklam Çalışması · 22+ Sektörde Reklam Deneyimi ·
   %76 Reklam Başarı Oranı (kullanıcının verdiği rakamlar; "reklam çalışması" olarak geçmeli).
4. Profesyonel Özet (`.summary`): 5 önemli ifade `.hl` (beyaz, kalın). Kaydırdıkça kelime kelime
   aydınlanır (`.sw.on`), bir kez yanan sönmez.
5. Temel Yetkinlikler (6 kart, **bento**: `.bento`, geniş kartlar `.wide` sırayla 1, 4, 5; satırlar
   geniş+dar / dar+geniş / geniş+dar; geniş kartlarda sağ altta soluk büyük ikon `.card-art`; mobilde
   tek sütun). Her kartta degradeli kutuda çizgi ikon (`.card-icon`, satır içi SVG).
6. İş Deneyimi: BrotherHustle (Ara 2024 – Halen), Deniz Egece Enstitü (Eyl 2022 – Eyl 2024).
   İş Deneyimi ve Eğitim zaman çizelgesinde nokta yerine kurum logosu (`.timeline-logo`, 44px beyaz kutu,
   mobilde 36px; `images/kurumlar/`): BrotherHustle ve Deniz Egece kendi sitelerinden, üniversiteler
   Vikipedi/Commons'tan; Topkapı ve Anadolu'nun sadece amblemi kesildi (2026-10-11, kullanıcı beğendi).
6b. Çalıştığım Markalar (`#brands`, `alt`, 2026-10-11): 20 Trendyol mağazası logosu, sabit ızgara
   (`.brands-grid`, masaüstü 10×2, mobil 5×4), baştan renkli, hover'da kalkar; tıklayınca Trendyol
   mağazası açılır, GA4'e `brand_click` (`brand`). Liste cpasturkiye.com'daki "Reklamlarını CPAS
   Türkiye'nin yönettiği mağazalardan bazıları"ndan; logolar `images/markalar/<slug>.webp` (160px).
   Sıra: Trendyol takipçi sayısı (çoktan aza; API `apigw.trendyol.com/discovery-sellerstore-gateway-service/api/follow/?sellerId=<id>`,
   sadece trendyol.com sayfasından fetch edilebilir), **istisna: Diversey her zaman 2. sırada**
   (büyük marka, kullanıcı istedi). Kayan şerit (marquee) denendi, kullanıcı sevmedi; gri/kısık logolar
   da istenmedi. Toplam takipçi (~4,96M) cümlesi önerildi, eklenmedi.
7. Eğitim: zaman çizelgesi (Topkapı YL → Anadolu AÖF ön lisans → Akdeniz lisans), altında
   ayrı "Sertifikalar" ve "Diller" blokları (`.info-cols`); maddelerde solda degradeli rozet
   (`.info-badge`: sertifikada madalya ikonu, dillerde "TR"/"EN").
8. Öne Çıkan Projeler (`.projects-grid`): Hazume, CPAS Türkiye, E-Ticaret Marka Danışmanlıkları,
   Web & Mobil Geliştirme (Deep Cafe, FBSM). Kartın ikonu üstte degradeli **kapağa** dönüşür
   (ızgara deseni + parlayan ikon; renk `--c`: Hazume turuncu, CPAS mavi, E-ticaret mor, Web turkuaz).
   Kapakta resim/marka adı yok.
9. Araçlar & Teknolojiler: 4 grup — Reklam & Analitik, Yapay Zeka (metin, görsel, video,
   müzik, kodlama), Tasarım & Kreatif, Web & Yazılım. AI araçları kullanıcının seçtikleri; ChatGPT,
   Cursor, Copilot kullanmıyor, ekleme.
10. Yazılar (`#writing`): görselsiz `.card.post-card`, `.posts-list` (tek sütun, dergi listesi):
    büyük başlık, sağda yuvarlak ok (hover'da -45° döner, degradeyle dolar); mobilde ok yerine
    "Yazıyı oku →". Yeni makaleler alt alta eklenir.
11. İletişim (düz zemin; solda ikonlu 4 kart `.contact-card.has-icon` + altında `.contact-extra` satırı: solda küçük sosyal ikonlar
    (`.social-links`: Instagram `salihacikgoz0`, X `SalihAcikgoz0`, Medium `@salihacikgoz`, LinkedIn en sonda — kullanıcı sosyal medyalar başta olsun dedi), sağda sade "Özgeçmiş (PDF) ↓").
    Sosyal hesap eklerken ikon + JSON-LD `sameAs`'e de ekle; tıklamalar `contact_click` (`method`).
12. Dev SA amblemi (`.big-mark`, `images/big-mark.webp`, `main`'in sonunda): `logo.png`'den Pillow ile
    üretilmiş kontur (mavi→mor ince kenar, içi çok soluk). İletişim'e `margin-top: -40px` ile biner,
    alt kısmı altbilgiye sönerek karışır, görününce yükselir. Önce dev "SALİH AÇIKGÖZ" yazısı denendi,
    kullanıcı "bir tık narsist" buldu → amblem; ilk yerleşim çok boşluk yaratmıştı, sıkılaştırıldı.
    Görseli yeniden üretirken WebP'yi `exact=True` ile kaydet (yoksa saydam piksellerin rengi siyaha
    döner, kanalları aynalayınca koyu çizgi çıkıyor).
13. Altbilgi (`.footer-rich`): üstte degrade çizgi; solda logo + isim, ortada telif + altında
    "İstanbul · SS:DD" canlı saat (`#localTime`), sağda yuvarlak "yukarı çık" (`.to-top`).

Bölüm zeminleri sırayla düz / `alt` değişir; bölüm eklerken sıralamayı koru. Markalar eklenince
(2026-10-11) sonrakiler kaydı: Eğitim düz, Projeler `alt`, Araçlar düz, Yazılar `alt`, İletişim düz.

## Yazılar (makaleler)

- Her makale `yazilar/<slug>/index.html` (temiz adres: `/yazilar/<slug>/`). Ortak `style.css` ve
  `script.js` kullanır; yerel adresler `../../` ile başlar ve `?v=dev` ile biter. Görseller
  `images/yazilar/` altında, WebP (~1200px, kalite 82); og görseli JPEG kalır.
- İlk makale: "Şikayetvar'ın Satışlara Etkisi" (Medium'dan taşındı, 10 Nisan 2025). Medium RSS'i
  (`medium.com/feed/@salihacikgoz`) tam metni verir; Medium sayfası doğrudan 403 döner.
- Kullanıcının tercihi: ana sayfada makale kartı **görselsiz** (büyük krem çizimli kart sitenin
  havasını bozdu). Makale içinde çizimler koyu çerçevede, hafif kısık (`brightness .88`) duruyor.
  Tablolar resim değil gerçek HTML tablo. Okuma süresi ("4 dk") kaldırıldı, kullanıcı istemedi — ekleme.
- Yeni makale eklerken: sayfa + ana sayfaya kart + `sitemap.xml` + BlogPosting JSON-LD + og görseli
  (1200×630). Medium'da da yayınlıysa canonical konusunu hatırlat (kullanıcı şimdilik Medium'da
  bırakmayı seçti, aşağıda "Kaldığımız yer"e bak; zorlama).
- Makale sayfalarını yerelde `open` ile açınca Safari üst klasördeki görselleri yüklemez;
  önizleme için `python3 -m http.server 8765` çalıştırıp `http://127.0.0.1:8765/` aç.

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
- Bölüm geçişleri net olsun (kullanıcı "her yer aynı, sıkıcı" dedi, 2026-09-30): `alt` bölümlerde
  köşelerden mavi/mor radial ışık + üst/alt kenarda degrade çizgi (`border-image`); her
  `.section-title` altında logo degradesiyle 44px çizgi. `alt` bölümlerin içeriği düz
  bölümlerle aynı hizada (`calc(var(--max-width) - 48px)`).
- Araçlar grupları `.tool-group` kutularında, her grubun rengi `--c` (RGB) ile: `tg-ads` mavi,
  `tg-ai` mor, `tg-design` pembe, `tg-web` turkuaz. Sol şerit + soldan sönen degrade zemin;
  etiketlerin içi koyu kalır, sadece kenarlık renk alır. Yeni grup eklerken yeni `tg-*` rengi ver.
- Hareketler (2026-10-11, kullanıcı 404'teki havayı istedi, hepsini beğendi): hero'da dolaşan mavi/mor
  ışık + sönen ızgara (`.hero-bg`; ilk sürüm fazla yavaştı, fark edilmedi → 9-11 sn), rakam şeridi
  sırayla aşağıdan belirir ve aynı anda hızlıca (1,2 sn) 0'dan sayar; düşük değerler belirme sırasında
  soluk kalıyor. Uzun süreler (2,5 sn), tam görünmeyi beklemek (mobilde 0+ bekledi) ve saymayı tamamen
  kaldırmak denendi, kullanıcı bu son halde karar kıldı (2026-10-11), güncel işte
  nabız atan yeşil `.live` nokta ("Halen"), bölümler kaydırınca belirir + başlık çizgisi çizilir
  (`.reveal`, script.js bitince sınıfı kaldırır ki kart hover'ı bozulmasın). Hepsi
  `prefers-reduced-motion`'da kapalı. Hareketleri belirgin yap; çok sakin olunca kullanıcı göremiyor.
- **Hareketler ve görsel dil (2026-10-17, kullanıcı "baya canlı olsun" dedi, hepsini beğendi):**
  - Hero açılışı: öğeler bulanıktan netleşerek sırayla gelir, isim harf harf yükselir (`.ch`),
    unvan (eyebrow) bir kez rastgele harflerden çözülür (`scramble`), foto perde gibi aşağıdan açılır
    (`photo-curtain`, `backwards` dolgu; `both` olursa 3D eğilmeyi kilitler). Hero'da 3. ışık pembe.
  - Fareyle (sadece `(hover: hover) and (pointer: fine)`): hero fotoğrafı 3D eğilir + parlama; hero
    butonları mıknatıslı; kartlarda içte imleci izleyen ışık (`.card::before`) ve dönen degrade kenar
    (`.card::after`, `@property --spin`, sadece hover'da döner); marka logoları 3D eğilir.
  - "İletişime Geç" degradeli, ara ara üstünden parlama geçer. Rakamlar cam kartlarda, renkleri akar.
  - Araç etiketleri grup görününce sırayla zıplar (`tag-pop`, `backwards` dolgu), hover'da grubun rengi.
  - Bölüm başlıkları: kelimeler maskeden kayarak çıkar (`.section-title .w`).
  - Zaman çizelgesi çizgisi: firma ekrana girince bir kez mavi→mor çizilir ve **dolu kalır**
    (`.line-pending`).
  - Sayfaya %5 film greni (`body::after`, SVG gürültü).
  - Hepsi `prefers-reduced-motion`'da kapalı. Lighthouse mobil (2026-10-17): Erişilebilirlik,
    En İyi Uygulamalar, SEO 100.
  - **Efekt sayısı doygun:** awwwards 2026 kazananlarında ölçülülük öne çıkıyor; kullanıcıya da
    "bundan sonrası içerikten gelmeli (vaka çalışması)" dendi. Yeni efekt önermeden önce bunu düşün.
- İş Deneyimi'nde **firma üstte** (h3), pozisyon altta — iki işte unvan aynı olduğu için. CV'de de aynı.
- Öne çıkan projelerde "CPAS Türkiye" başlığı (cpasturkiye.com değil).
- E-Ticaret Marka Danışmanlıkları'nda müşteri marka adı (asfamoda, Kozagen vb.) **yazma**.
- Hazume kullanıcının kendi projesi: ev hanımlarının evde yaptığı yemekleri satabildiği
  sipariş platformu. Reklam/pazarlama projesi gibi anlatma; rakip marka adı (Yemeksepeti
  vb.) geçirme. "Kendi girişimim" gibi ifadeler de istenmiyor.

## Dikkat

- **Görsel formatı (2026-10-11):** sayfadaki `<img>` görselleri **WebP** (Pillow: `quality=82, method=6`;
  şeffaf logolar `lossless=True`). JPEG/PNG kalanlar bilerek: og görselleri (`og-image.jpg`,
  `yazilar/*-og.jpg`; bazı uygulamalar WebP önizleme göstermiyor), JSON-LD `image`'daki `profile.jpg`,
  site ikonları (PNG/ICO), `logo-mark.png` ve `logo.png` (kaynak dosyalar). Yeni görsel eklerken WebP yap.
  Site Cloudflare arkasında = zaten CDN; ayrıca CDN kurma (kullanıcı sordu, gerek yok dendi).

- `404.html` bağımsız bir sayfa: stil içinde gömülü, tüm adresler tam (`https://salihacikgoz.com/...`)
  çünkü her derinlikte açılabilir; `?v=dev` kullanmaz. `.htaccess` ile bağlı (`ErrorDocument`).
  `.htaccess` ayrıca `www.` adresini 301 ile `salihacikgoz.com`'a yönlendirir (HTTPS'i Cloudflare yapar).
  `noindex`, GA4'e `page_not_found` olayı gönderir. Kullanıcı "havalı" istedi, beğendi (2026-09-30).
- `images/salihacikgoz.JPG` (orijinal foto) ve `Profile.pdf` (LinkedIn dışa aktarımı)
  `.gitignore`'da; sadece ilk bilgisayarda var, repoya/sunucuya gitmemeli.
- `*.md` dosyaları deploy'da hariç tutulur (sunucuda herkese açık olmasın).
- Site Cloudflare arkasında; CSS/JS/görseller 7 gün önbellekleniyor. `index.html`'deki her
  yerel dosya adresi `?v=dev` ile bitmeli (ör. `images/yeni.png?v=dev`). Deploy sırasında
  `?v=dev` commit kodu ile değiştirilir, böylece her yayında önbellek atlanır.
  **İstisna:** site ikonları (`images/site-icon-48.png`, `images/site-icon-192.png`,
  `images/apple-touch-icon.png`, kökte yedek `favicon.ico`) sabit adreste, `?v=` yok — Google arama
  sonucundaki logo sabit adres ve 48'in katı kare ikon ister. Koyu zemin (#0b0f14) üzerine SA
  amblemi, 48/192 ve `favicon.ico` yuvarlak köşeli (%22, köşe dışı şeffaf; apple-touch-icon kare
  çünkü iOS kendi yuvarlar); `logo.png`'den Pillow ile üretildi (2026-09-30).
  İkonu değiştirince **dosya adını da değiştir** (HTML'deki 3 sayfada: index, 404, makale): Google
  ikonu adrese göre önbellekliyor; 2026-10-10'da eski `favicon.ico`/`icon-192.png` adreslerinde
  Google hâlâ eski (şeffaf zeminli, beyaz harfli) ikonu gösteriyordu, bu yüzden `site-icon-*` adlarına
  geçildi. Cloudflare'de de Purge Cache > Custom Purge ile eski adresleri temizlet.
- Deploy önce diğer dosyaları, `index.html`'i **en son** yükler (ayrı adım, curl ile). Yayın
  sırasında yeni `?v=` adresli CSS/PDF'e istek atma: yarım dosya Cloudflare'de 7 gün kalır
  (2026-09-30'da oldu). Canlı kontrolü `index.html` yeni `?v=` kodunu gösterdikten sonra yap.

## SEO

- Head'de og/twitter etiketleri (görsel `images/og-image.jpg`, 1200×630), canonical ve
  schema.org Person JSON-LD var. İş/eğitim değişince **JSON-LD'yi de güncelle**.
- Site Google Search Console'a eklendi, `sitemap.xml` gönderildi (2026-09-30).
  Google dizininde (`site:salihacikgoz.com` ile çıkıyor, kullanıcı doğruladı 2026-09-30).
  Windows'taki hafızada dizin hatırlatma notu varsa artık gereksiz, silinebilir.
- GA4 kurulu (`G-B23FWT14V4`, head'de gtag). `script.js` e-posta/telefon/LinkedIn tıklamalarını
  `contact_click` olayı (`method` parametresi) olarak gönderir.
- İçerik değişince `sitemap.xml` içindeki `<lastmod>` tarihini güncelle.

## Kaldığımız yer (2026-10-17)

2026-10-17 oturumu (Windows): büyük görsel/hareket yenilemesi yapıldı ve yayınlandı (ayrıntılar
"Hareketler ve görsel dil (2026-10-17)" ve sayfa yapısında). 390px öykünmede ve masaüstünde kontrol
edildi; kullanıcı gerçek telefonda bakmadı → "telefonda yeni hali nasıl?" diye sor.

2026-10-11 oturumunda yapılanlar hepsi yayında (Windows'ta yapıldı, ertesi gün laptopta devam):
İletişim'e sosyal ikonlar (Instagram, X, Medium, LinkedIn), hero'da dolaşan ışık + ızgara, rakam
şeridinde hızlı sayaç, bölümlerin kayarak belirmesi, "Halen"de canlı nokta, deneyimde firma üstte
(CV dahil), zaman çizelgesinde firma/okul logoları, "Çalıştığım Markalar" bölümü (20 Trendyol
mağazası), görseller WebP'ye çevrildi. Ayrıntılar ilgili bölümlerde.
**Oturum başında:** kısa bir "nerede kalmıştık" özeti ver; aşağıdaki hatırlatmalardan uygun
olan 1-2 tanesini sor (hepsini birden değil).
Açık kalanlar:
- **Hatırlat — vaka çalışması (kullanıcı istedi, 2026-09-30):** oturum başında kullanıcıya "vaka
  çalışmasını yapalım mı?" diye sor. Konsept anlatıldı ve beğenildi, "şimdi yapmayalım" dedi.
  Format: sorun → yaptıkların → sonuç (rakamla); marka adı yok ("bir kadın giyim markası" gibi).
  Kullanıcıdan gerekenler: hangi iş (sektör), başlangıç durumu, yapılanlar, 2-3 rakam (ROAS, satış
  artışı, CPL, maliyet düşüşü; yaklaşık da olur). Yeri: Projeler bölümü (kartı genişletmek ya da
  `yazilar/` gibi ayrı sayfa — o zaman kullanıcıya sor).
- **Ara ara hatırlat — Medium canonical (2026-10-11 kararı):** Kullanıcı artıları/eksileri dinledi,
  "şimdilik Medium'da kalsın" dedi; Medium canonical'ı Medium'da bırakıyor. Her oturumda **sorma**;
  ~ayda bir ya da yeni makale eklenirken tek cümleyle hatırlat ("Medium canonical'ı siteye çevirmeyi
  düşündün mü?"). Kullanıcı açıkça "artık hatırlatma" demeden bu maddeyi silme. Yol: yazıda ⋯ >
  Edit story > ⋯ > More settings > Advanced > Customize canonical link. Son hatırlatma: 2026-10-11.
- **Kullanıcı yapacak (Search Console):** makale adresi için "Dizine eklenmesini iste"
  (ana sayfa için 2026-10-10'da yapıldı).
- Kullanıcı yeni makale yazdıkça gönderecek; düzen için "Yazılar (makaleler)" bölümüne bak.
- **Google arama ikonu:** 2026-10-10'da sonuçta hâlâ eski ikon (beyaz dairede kaybolan beyaz "S")
  çıkıyordu; canlı ikonlar doğruydu, Google önbelleği eskiydi. İkonlar `site-icon-*` adlarına taşındı,
  kullanıcı ana sayfa için yeniden dizine ekleme istedi. ~2026-10-24'te kullanıcıya sor; kontrol için
  `https://www.google.com/s2/favicons?domain=salihacikgoz.com&sz=64` koyu zeminli mi bak.
- **Kullanıcı yapacak (GA4):** `contact_click`'i önemli etkinlik olarak işaretlemek ve `method`
  için "İletişim yöntemi" özel boyutu oluşturmak (Yönetici > Etkinlikler / Özel tanımlar).
- **Windows'ta `gh` girişi yapılmadı:** `"/c/Program Files/GitHub CLI/gh.exe" auth login --web`
  (kullanıcı `!` ile çalıştırmalı). O zamana kadar yayını canlı siteyi yoklayarak doğrula.
- Mobil görünüm 2026-09-30'da kullanıcı tarafından telefonda kontrol edildi, sorun yok.
  2026-10-11 değişiklikleri (Markalar 5×4 ızgara, mobil zaman çizelgesi logoları) 390px öykünmede
  kontrol edildi; kullanıcı telefonda tam bakmadı → "telefonda her şey yerinde mi?" diye sor.
- **Chrome DevTools MCP** (Windows'ta çalışıyor): gerçek tarayıcıda ölçüm/ekran görüntüsü için
  `new_page` / `evaluate_script` / `emulate` (mobil: `390x844x3,mobile,touch`). Headless
  `--virtual-time-budget` animasyon zamanlamasında güvenilmez, kullanma.
- E-postayı hiçbir dış servise (User-Agent dahil) gönderme; 2026-10-11'de Vikipedi sorgusunda
  yanlışlıkla gönderildi, kullanıcıya söylendi.
- Headless dar ekran ipucu: sayfayı 390/360px `iframe` içeren bir çerçeve HTML'inde çekince
  (`--allow-file-access-from-files`) mobil görüntü doğru çıkıyor.

## Yapılabilecekler

- **Hatırlat — kenara alınan fikirler (2026-10-11, kullanıcı "sonra dönelim" dedi):** hero'da dönen
  kelime (Meta → Google → TikTok → Yandex; gösterişli, sevmeyebilir), vaka çalışması, İletişim'e sade
  WhatsApp bağlantısı, LinkedIn tavsiyelerinden 2-3 referans. Uygun bir anda "kenara aldıklarımıza
  dönelim mi?" diye sor. (Kartlarda ışık ve ilerleme çubuğu 2026-10-17'de yapıldı.)

- **Hatırlat — markaları kategorize etmek (2026-10-11, kullanıcı ileride yapmak istiyor):**
  "Çalıştığım Markalar" iki katmanlı gruplansın: önce iş türü (CPAS reklamları, site reklamları
  vb.), altında sektör (kadın giyim, ev tekstili, kozmetik vb.). Kullanıcı yeni markalar da
  ekleyecek; hangi markanın hangi gruba girdiğini kullanıcıdan al. Ara ara (birkaç oturumda bir)
  "markaları kategorize etmeye başlayalım mı?" diye sor.
- Vaka çalışması → yukarıda "Kaldığımız yer"de hatırlatma olarak duruyor.
- Öne çıkan projelere gerçek görsel eklemek (şimdilik renkli ikon kapakları var).
- Referans/müşteri yorumları. (Marka logoları yapıldı → "Çalıştığım Markalar". Proje kartlarında
  marka adı yazmama kuralı hâlâ geçerli.)
- İngilizce sürüm (TR/EN geçişi).

## Denenip beğenilmeyenler

- Mobil hero'da fotoğrafı sağa almak (136px, butonlar alt alta tam genişlik): 2026-09-30'da
  denendi, kullanıcı "şu anki hali daha iyi" dedi → mevcut düzen (foto solda 120px) kalıyor,
  tekrar önerme.
- Zemini bir ton açmak (`#131a23`, "site çok mu dark" sorusu üzerine): 2026-10-11'de karşılaştırma
  gösterildi, kullanıcı "böyle kalsın" dedi → `#0b0f14` kalıyor, tekrar önerme.
- Bölüm başlıklarının üstüne sıra numarası (01, 02 …): 2026-09-30'da denendi, "sarmadı".
- 2026-10-17'de denenip kaldırılanlar (tekrar önerme):
  - Sayfa genelinde fareyi takip eden büyük ışık (`cursor-aura`): "çok sevemedim".
  - Zaman çizelgesi çizgisinin kaydırmaya bağlı dolması (`animation-timeline: view()`): gri kalan
    kısım, özellikle alttaki eski firma "tamamlanmamış gibi" duruyordu → bir kez çizilip dolu kalıyor.
  - Özet'te ifadelerin altına fosforlu kalem çizgisi: "dikkat dağıtıyor".
  - Menü bağlantılarında hover'da harf karışması (scramble): "midemi bulandırdı, gözümü yordu".
    (Açılışta unvanın bir kez çözülmesi kaldı.)
  - Sayfa sonunda dev "SALİH AÇIKGÖZ" yazısı: "bir tık narsist" → yerine dev SA amblemi.
  - Altbilgide colophon ("El yapımı · HTML, CSS, JS · framework yok"): "çok sevmedim".
