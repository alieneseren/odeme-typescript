# STAJ GÜNLÜĞÜ - 5. GÜN
**Tarih:** 22 Temmuz 2025  
**Öğrenci:** [Öğrenci Adı]  
**Staj Yeri:** [Şirket Adı]  
**Bölüm:** Bilgisayar Mühendisliği  

## GÜNÜN KONUSU: LOGİN VE REGISTER SAYFALARININ REACT'A DÖNÜŞTÜRÜLMESİ

### SABAH SAATLERİ (09:00 - 12:00)

Bugün dünkü işin devamı olarak login.html ve register.html sayfalarını React'a çevirme işine başladım. İlk iş LoginPage.tsx dosyasını oluşturmak oldu, HTML'deki giriş formunu React'a taşımak hiç kolay değilmiş.

HTML'deki giriş sistemim epey kapsamlıydı - OTP doğrulaması, şifre sıfırlama modal'ları falan vardı. Bunları React'ta useState hook'ları ile yönetmek zorunda kaldım. Modal yapılarını React'ta conditional rendering ile nasıl yapacağımı düşünmek biraz zaman aldı.

Paythor API ile authentication kısmını React'a taşırken HTML'deki fetch kodlarımı async/await pattern'ına çevirdim. localStorage'dan token okuma işlemlerini useEffect hook'u ile halletmeye çalıştım. OTP doğrulama ekranını göstermek için showOtp diye bir state kullandım.

```typescript
const [showForgot, setShowForgot] = useState<boolean>(false);
const [forgotFormData, setForgotFormData] = useState({
  email: '',
  phone: ''
});

// Modal component
{showForgot && (
  <div className="modal-overlay">
    <div className="modal-content">
      {/* Şifre sıfırlama formu */}
    </div>
  </div>
)}
```

OTP doğrulama sistemini implement ederken HTML'deki yaklaşımı React state yönetimine uyarladım. En önemli kısım login başarılı olduktan sonra OTP ekranına geçiş yapmaktı:

```typescript
const [showOtp, setShowOtp] = useState<boolean>(false);
const [otpCode, setOtpCode] = useState<string>('');

// Login başarılı olduğunda
if (loginSuccessful) {
  localStorage.setItem('token', responseToken);
  localStorage.setItem('email', email);
  setShowOtp(true); // OTP ekranını göster
}
```

### ÖĞLE SAATLERİ (13:00 - 14:30)

Öğle yemeği sonrasında şifre sıfırlama özelliğini React'a taşıdım. HTML'deki forgot password modal'ımı React state'leri ile yeniden yazmaya çalıştım. Paythor API'nin /auth/forgot-password endpoint'ini kullanarak OTP gönderme işlemini React'ta halletmek biraz uğraştırdı.

HTML'deki modal yapısını React'ta şöyle çözdüm: showForgot state'i true olduğunda modal açılıyor, false olduğunda kapanıyor. OTP kodu gönderildikten sonra ikinci bir form görünüyor ki yeni şifre belirlenebilsin.

Form validation'larını HTML'den React'a çevirmek baya zorladı beni. HTML'de basit if-else kontrollerim vardı, React'ta bunları daha organize bir şekilde yazmaya uğraştım.

### İKİNDİ SAATLERİ (14:30 - 17:00)

İkindi saatlerini register.html sayfasını React'a çevirmeye ayırdım. HTML'deki register sayfam baya kompleksti çünkü hem kullanıcı kaydı hem de işyeri kaydı vardı. Bu iki farklı formu React'ta tab sistemi ile organize etmek aklıma geldi.

TypeScript interface'lerini yazmak zorunda kaldım. UserRegistration ve BusinessRegistration için ayrı interface'ler oluşturdum. HTML'de basit JavaScript object'lerim vardı, şimdi her şeyin type'ını tanımlamamız gerekiyor.

Register form'unun submit işlemini HTML'den React'a çevirirken form validation kısmında çok zorlandım. HTML'de manuel olarak kontrol ettiğim e-posta formatı, şifre uzunluğu gibi şeyleri React'ta daha düzenli bir şekilde yapmaya uğraştım.

```typescript
const validateUserForm = (): boolean => {
  if (!userForm.email.includes('@')) {
    setError('Geçerli bir e-posta adresi girin');
    return false;
  }
  
  if (userForm.password.length < 6) {
    setError('Şifre en az 6 karakter olmalı');
    return false;
  }
  
  if (userForm.password !== userForm.confirmPassword) {
    setError('Şifreler eşleşmiyor');
    return false;
  }
  
  return true;
};
```

### AKŞAM SAATLERİ (17:00 - 18:00)

Günün son saatini Paythor API'nin /auth/register endpoint'i ile register işlemini test etmeye ayırdım. HTML'deki registerOl() fonksiyonunu React'a çevirme işlemi baya zorladı beni çünkü error handling'i React state'leri ile yapmam gerekiyordu.

React Router'ın navigate fonksiyonu ile sayfa yönlendirmelerini hallettim. HTML'de window.location.href kullanıyordum, React'ta bunun yerine programmatic navigation var.

API yanıtlarını handle etme kısmında TypeScript'in faydalarını gördüm. HTML'de sadece data.status kontrolü yapıyordum, şimdi tüm API response'unun type'ını tanımlayabiliyorum. Bu sayede hangi field'ların mevcut olduğunu compile time'da bilebiliyorum.

### GÜNÜN DEĞERLENDİRMESİ

Bugün login ve register sayfalarını HTML'den React'a çevirme işlemini bitirdim. En zorlandığım kısım HTML'deki modal yapılarını React'ta nasıl yapacağımdı. Conditional rendering ile hallettim ama başta kafam baya karıştı.

TypeScript interface'leri yazmak zorunda kalmak ilk başta can sıkıcıydı ama sonra faydasını gördüm. API yanıtlarının şeklini önceden tanımlayabilmek gerçekten güzel bir özellikmiş.

Form validation işlemlerini React'ta yapmak HTML'dekinden daha organize oldu. useState hook'ları ile form state'ini yönetmek çok daha temiz. HTML'de her input için ayrı ayrı value okuyordum, şimdi controlled components kullanıyorum.

React Router ile sayfa geçişleri çok daha yumuşak. Özellikle login başarılı olduktan sonra payment sayfasına yönlendirme işlemi artık sayfa yenilemesi olmadan yapılıyor.

**Öğrenilen Teknolojiler:**
- React conditional rendering
- TypeScript interface tanımlamaları
- React Router navigation
- Controlled components
- React form handling

**Karşılaşılan Zorluklar:**
- HTML modal'larını React'a çevirme
- Form validation logic'ini React'a uyarlama
- TypeScript type tanımlamalarını öğrenme

Bu migration süreci gerçekten öğreticiydi. HTML ile çalışan authentication sistemini modern React'a taşımak oldukça keyifli oldu. Yarın son kısım olan ürün yönetimi sayfasını çevirmeyi planlıyorum.
