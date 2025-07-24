# STAJ GÜNLÜĞÜ - 6. GÜN
**Tarih:** 23 Temmuz 2025  
**Öğrenci:** [Öğrenci Adı]  
**Staj Yeri:** [Şirket Adı]  
**Bölüm:** Bilgisayar Mühendisliği  

## GÜNÜN KONUSU: ÜRÜN YÖNETİMİ SAYFASININ REACT'A DÖNÜŞTÜRÜLMESİ VE PROJENİN TAMAMLANMASI

### SABAH SAATLERİ (09:00 - 12:30)

Bugün son kalan kısım olan urunler.html sayfasını React'a çevirme işimiyle başladım. Bu sayfa ürün yönetimi için kullanılıyordu ve CRUD (Create, Read, Update, Delete) işlemlerinin hepsi vardı. HTML'deki JavaScript fonksiyonlarını React componentine taşımaya başladım.

İlk olarak ProductsPage.tsx dosyasını oluşturdum. HTML'de localStorage'da tuttuğum ürünleri React state'e aktarmak için custom hook yazdım. Bu hook hem localStorage'dan veri okuyabiliyor hem de değişiklikleri otomatik olarak localStorage'a kaydediyor.

HTML'deki ürün ekleme formunu React'ta modal component olarak yaptım. Eskiden document.getElementById() ile form verilerini okuyordum, şimdi controlled components kullanıyorum. TypeScript sayesinde her ürün için interface tanımladım.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

interface PaymentData {
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}
```

HTML versiyonumda localStorage'da tutulan ürünleri React state'e aktarmak için bir custom hook yazdım:

```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### ÖĞLE SAATLERİ (13:00 - 14:30)

Öğle arası sonrası HTML'deki ürün ekleme, düzenleme ve silme fonksiyonlarını React'a çevirme işlemine devam ettim. En zorlandığım kısım ürün düzenleme modal'ını yapmaktı. HTML'de basit popup'lar kullanıyordum, React'ta state management ile hallettim.

Ürün silme işlemini React'ta yaparken window.confirm() kullandım, HTML'dekiyle aynı. Ama state güncelleme işlemini filter() metodu ile yaptım. Bu sayede ürün listesi otomatik olarak güncelleniyor.

LocalStorage'a veri yazma işlemini custom hook ile otomatikleştirdim. HTML'de manuel olarak JSON.stringify() yapıp localStorage.setItem() çağırıyordum, şimdi bu işlemi hook hallediyor.

### İKİNDİ SAATLERİ (14:30 - 17:30)

İkindi saatlerinde dün yapmış olduğum PaymentPage component'inin son rötuşlarını yaptım. HTML'deki sepet işlemlerinin React versiyonunu test ettim. Dün yazmış olduğum addToCart() fonksiyonu React'ta da aynı mantıkla çalışıyor.

POS sistemi artık tamamen React'a dönüştürülmüş oldu. HTML'de ayrı sayfalar halinde olan login, register, ödeme ve ürün yönetimi şimdi tek bir SPA içinde React Router ile yönetiliyor.

En büyük avantaj sayfa geçişlerinde hiç yenileme olmaması. HTML versiyonunda her tıklamada sayfa yenileniyordu, şimdi çok daha hızlı ve akıcı bir deneyim var. TypeScript sayesinde de kod kalitesi çok daha iyi oldu.

### AKŞAM SAATLERİ (17:30 - 18:30)

Günün son kısmını projenin genel testini yapmaya ayırdım. Tüm sayfalar artık React componentleri halinde çalışıyor. Login yapıp OTP doğrulaması, ürün ekleme, sepete ekleme, ödeme linki oluşturma gibi tüm işlevleri test ettim.

HTML versiyonuna kıyasla çok daha hızlı ve kullanıcı dostu bir deneyim ortaya çıktı. TypeScript sayesinde development sırasında çok daha az hata aldım. React'ın component sistemi sayesinde kod tekrarı da azaldı.

Projenin React versiyonu artık tamamen hazır. HTML'den başlayıp modern bir React + TypeScript uygulamasına dönüştürme süreci tamamlandı. Bu migration süreci gerçekten çok şey öğretti.

### GÜNÜN DEĞERLENDİRMESİ VE PROJE TAMAMLANMASI

Bugün itibarıyla HTML tabanlı POS sistemimi tamamen React + TypeScript'e dönüştürme işlemini bitirdim! Üç günlük yoğun çalışmanın sonunda gerçekten modern bir web uygulaması elde ettim.

HTML'den başlayıp React'a geçiş süreci çok öğreticiydi. En zorlandığım kısım HTML'deki DOM manipulation'ları React state yönetimine çevirmekti. document.getElementById() yerine useState kullanmak başta garip gelse de sonra çok daha mantıklı geldi.

TypeScript öğrenmek zorunda kalmak ilk başta zorluk gibi görünse de gerçekten faydalı oldu. API yanıtlarının type'ını tanımlayabilmek, compile time'da hata yakalayabilmek harika özellikler.

Projenin genel durumu:
- LoginPage: ✅ Giriş, OTP, şifre sıfırlama
- RegisterPage: ✅ Kullanıcı ve işyeri kaydı  
- PaymentPage: ✅ POS satış arayüzü, sepet yönetimi
- ProductsPage: ✅ Ürün CRUD işlemleri

**En Büyük Kazanımlar:**
- Single Page Application deneyimi
- Component-based architecture anlayışı
- TypeScript ile type safety
- Modern JavaScript (ES6+) kullanımı
- React hooks sistemi

**HTML'den React'a Geçişte Öğrendiklerim:**
- State management React'ta çok daha organize
- Event handling çok daha temiz
- Component reusability çok faydalı
- Error handling daha sistematik

Bu üç günlük süreç hem teknik hem de problem solving açısından çok verimli geçti. HTML ile başladığım basit POS sistemi artık endüstriyel seviyede bir React uygulaması haline geldi.
