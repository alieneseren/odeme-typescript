# STAJ GÜNLÜĞÜ - 4. GÜN
**Tarih:** 21 Temmuz 2025  
**Öğrenci:** [Öğrenci Adı]  
**Staj Yeri:** [Şirket Adı]  
**Bölüm:** Bilgisayar Mühendisliği  

## GÜNÜN KONUSU: HTML POS SİSTEMİNİN REACT + TYPESCRIPT'E DÖNÜŞTÜRÜLMESİNE BAŞLANMASI

### SABAH SAATLERİ (09:00 - 12:00)

Bugün HTML ile yapmış olduğum POS sistemini React + TypeScript'e dönüştürmeye başladım. Dün tamamladığım odeme.html sayfasını PaymentPage component'ine çevirme işlemine koyuldum. İlk olarak React projesinin temelini kurmaya başladım.

Vite ile TypeScript template'ini kullanarak yeni proje oluşturdum. Ardından gerekli olan React Router ve Bootstrap'i ekledim. HTML'deki odeme.html sayfasına iki bölüm eklemiştim: ürünler ve sepet şeklinde. Şimdi bunları React component'lerine dönüştürmeye başladım.

LocalStorage'dan ürünleri çekip ekranda gösterme işini useState ile çözdüm. Her ürünün kartında ismi, ikonu ve fiyatı gözüküyor. Ürüne tıklayınca sepete ekleniyor, aynı ürüne tekrar tıklarsan miktarı artıyor. Bu mantığı React state'i ile yapmak HTML'den çok daha rahat oldu.

### ÖĞLE SAATLERİ (13:00 - 14:30)

Öğle yemeği sonrasında HTML'deki sepet işlemlerini React'a uyarladım. HTML'de yazmış olduğum sepet yönetimi sistemi çok güzeldi. Sepet işlemleri için şu kodu kullanmıştım:

```javascript
let posCart = []; 
function addToCart(product) { 
    const idx = posCart.findIndex(x => x.name === product.name); 
    if(idx > -1) { 
        posCart[idx].quantity++; 
    } else { 
        posCart.push({ ...product, quantity: 1 }); 
    } 
    renderCart(); 
}
```

Bu mantığı React useState ile yeniden yazdım. Sepette toplam tutar hesaplanması ve kullanıcının hangi ürünlerden kaç tane aldığını görmesi için state management yapısını kurdum. HTML'de renderCart() fonksiyonu ile yaptığım işlemi şimdi React'ın re-rendering mekanizması hallediyor.

### İKİNDİ SAATLERİ (14:30 - 17:00)

İkindi saatlerinde en zor kısım olan Paythor API entegrasyonunu React'a uyarladım. HTML'de ödeme linki oluşturmak için Paythor API'ye pos isteği gönderiyordum:

```javascript
fetch("https://api.paythor.com/payment/create", { 
    method: 'POST', 
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + localStorage.getItem('paythor_token')
    }, 
    body: JSON.stringify({ ... }) 
})
```

Bu fetch kodunu React component'ine taşırken async/await kullandım. TypeScript ile API yanıtları için interface'ler oluşturdum. Token'ı localStorage'dan okuyacak şekilde ayarladım. Müşteri bilgileri ve sepetteki ürünleri API'ye göndermek için React form'larını kullandım.

### AKŞAM SAATLERİ (17:00 - 18:00)

Akşam saatlerinde API'den gelen yanıtları React'ta nasıl göstereceğimi halletmeye çalıştım. HTML'de yazmış olduğum error handling mantığını React state'e uyarladım. Başarılı olursa kullanıcıya ödeme linki gösteriliyor, hata varsa da detaylı mesaj çıkıyor.

Eskiden şöyle yapıyordum:

```javascript
if (data && (data.status === "success" || data.status === true) && data.data && data.data.payment_link) { 
    document.getElementById('sonuc').innerHTML = 'Ödeme linki oluşturuldu: ...'; 
} else { 
    let hata = (data && (data.message || data.error)) ? (data.message || data.error) : "Bilinmeyen hata oluştu"; 
    document.getElementById('sonuc').innerHTML = '<div class="alert alert-danger">Hata: ' + hata + '</div>'; 
}
```

React'ta bunu setState ile yapıyorum artık. TypeScript sayesinde API yanıtlarının type'ını da kontrol edebiliyorum. Sağ üstteki çıkış butonunu da React Router'ın navigate fonksiyonu ile hallettim.

### GÜNÜN DEĞERLENDİRMESİ

HTML ile yaptığım POS sistemini React'a dönüştürme işine bugün başladım. En zorlandığım kısım HTML'deki basit JavaScript kodlarını React'ın component yapısına uyarlamaktı. 

HTML'de document.getElementById() ile yapılan DOM manipülasyonlarını React state ile değiştirmek gerekti. Sepet işlemleri için yazmış olduğum addToCart() fonksiyonu mantık olarak aynı kaldı ama şimdi React useState hook'u ile çalışıyor.

Paythor API entegrasyonu kısmında HTML'deki fetch kodunu React'a taşırken async/await pattern'ı kullandım. TypeScript sayesinde API yanıtları için interface tanımlayabiliyorum, bu da kod kalitesini artırıyor.

En büyük avantaj React Router ile sayfa geçişlerinin çok daha smooth olması. HTML'de sayfa yenilemeleri varken şimdi single page application deneyimi var.

**Öğrenilen Teknolojiler:**
- React useState hook'u
- TypeScript interface tanımlamaları
- React component yapısı
- React Router navigation
- HTML'den React'a migration teknikleri

**Karşılaşılan Zorluklar:**
- DOM manipulation'dan React state'e geçiş
- HTML event handling'den React event handling'e uyarlama
- API response'ları için TypeScript type'ları yazma

Bu dönüşüm süreci oldukça öğretici. HTML ile çalışan bir sistemi modern web teknolojilerine taşımak güzel bir deneyim oldu. Yarın login ve register sayfalarını da React'a çevirmeyi planlıyorum.
