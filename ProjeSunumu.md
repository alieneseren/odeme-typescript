# POS Uygulaması Sunumu

---

## 1. Giriş
 React + TypeScript + Vite ile geliştirildi
 Modern arayüz için Bootstrap kullanıldı
 Paythor API ile tam entegre POS (Satış Noktası) uygulaması
 Ürünler localStorage'da saklanıyor

---

## 2. Giriş, Kayıt ve Şifre Sıfırlama Ekranları
- Kullanıcılar e-posta ve şifre ile giriş yapabilir
- Kayıt sırasında OTP (tek kullanımlık şifre) doğrulama
 Şifremi Unuttum: OTP ile yeni şifre belirleme (2 aşamalı, güvenli akış)
 Şifre sıfırlama ve resetleme işlemleri Paythor API ile tam uyumlu
 Başarılı ve hatalı durumlar için detaylı, Türkçe ve kullanıcı dostu mesajlar
 Giriş sonrası token ve e-posta localStorage'a kaydedilir
 Giriş/kayıt/şifre sıfırlama formları responsive ve ortalanmış

---

## 3. Ürün Yönetim Paneli
 Ürün ekleme, düzenleme ve silme işlemleri
 Her ürün için görsel yükleme ve otomatik emoji/ikon atama
 Tüm ürünler localStorage'da saklanır
 Modern ve sade arayüz
 Ürün paneline çıkış butonu ve erişim kısıtlaması

---

## 4. POS Satış Ekranı
 Ürünler ikonlu ve grid şeklinde listelenir
 Sepete ürün ekleme, miktar güncelleme ve silme
 Müşteri bilgileri (ad, soyad, e-posta, telefon) zorunlu
 Sepet ve ödeme paneli tam ortalanmış ve büyük kutuda
 Ürün görselleri ve ikonlar POS ekranında da gösterilir

---

## 5. Ödeme İşlemi
 Sepetteki ürünler ve müşteri bilgileriyle Paythor API'ye ödeme isteği gönderilir
 API'den dönen ödeme linki tıklanabilir ve taşma yapmayacak şekilde gösterilir
 Sepet ve ödeme sonucu aynı kutuda görüntülenir
 Hatalar ve uyarılar Türkçe ve kullanıcı dostu
 Login olmadan ödeme ekranına erişim engellenir

---

## 6. Güvenlik ve Kullanıcı Deneyimi
 Giriş yapılmadan ödeme ve ürün paneline erişim engellenir
 Çıkış butonu ile tüm oturum bilgileri temizlenir ve login sayfasına yönlendirme
 Debug paneli ile localStorage'daki login/token bilgileri görüntülenebilir
 Tüm formlar ve paneller responsive ve tam ortalanmış
 Hatalı alanlar ve eksik bilgiler için kısa, Türkçe ve açıklayıcı uyarılar

---

## 7. Sonuç
- Modern, hızlı ve kullanıcı dostu POS uygulaması
- Paythor API ile tam uyumlu ödeme ve şifre sıfırlama akışı
- Kolay ürün yönetimi ve güvenli oturum sistemi
- Tüm hata ve uyarılar Türkçe, kullanıcı deneyimi odaklı

---

Teşekkürler!
