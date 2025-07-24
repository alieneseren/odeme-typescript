import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Product = {
  name: string;
  price: number;
  image?: string; // görsel desteği için
};

type CartItem = Product & { qty: number };

function getProducts(): Product[] {
  return JSON.parse(localStorage.getItem('products') || '[]');
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  // Sayfa açıldığında login kontrolü
  useEffect(() => {
    let token = localStorage.getItem('paythor_token') || localStorage.getItem('token');
    if (!token || token === '••••••' || token.length < 10) {
      window.location.replace('/login');
    }
  }, []);
  const [products] = useState<Product[]>(getProducts());
  const [loading, setLoading] = useState(false);
  type PaymentResult = { link: string; products: string } | null;
  const [result, setResult] = useState<PaymentResult>(null);
  const [error, setError] = useState<string | null>(null);
  // Müşteri bilgileri
  const [payerFirstName, setPayerFirstName] = useState('');
  const [payerLastName, setPayerLastName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerPhone, setPayerPhone] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.name === product.name);
      if (idx > -1) {
        // Sadece 1 artır
        return prev.map((item, i) => i === idx ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (i: number, qty: number) => {
    setCart(prev => prev.map((item, idx) => idx === i ? { ...item, qty } : item));
  };

  const removeFromCart = (i: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== i));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePayment = async () => {
    // Müşteri bilgileri kontrolü
    if (!payerFirstName.trim() || !payerLastName.trim() || !payerEmail.trim() || !payerPhone.trim()) {
      setError('Lütfen müşteri bilgilerini eksiksiz doldurun.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Token kontrolü (HTML örneğindeki gibi)
      let token = localStorage.getItem('paythor_token') || localStorage.getItem('token');
      if (token) token = token.trim();
      if (!token || token === '••••••' || token.length < 10) {
        setError('Oturum bulunamadı. Lütfen önce giriş yapın ve hesabınızın aktif olduğundan emin olun.');
        setLoading(false);
        return;
      }
      // Sepet ürünlerini API formatına çevir
      const cartItems = cart.map((c) => ({
        id: 'PRD-' + Date.now() + Math.floor(Math.random()*1000),
        name: c.name,
        type: 'product',
        price: c.price.toFixed(2),
        quantity: c.qty
      }));
      const amount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price)*item.quantity), 0).toFixed(2);
      // Müşteri adresi örnek (HTML örneğiyle aynı)
      const address = {
        line_1: '123 Main St',
        city: 'Istanbul',
        state: 'Istanbul',
        postal_code: '07050',
        country: 'TR'
      };
      // Ürün bilgisini de result'ta göstermek için ürün listesini hazırla
      const productListText = cart.map(item => `${item.name} x${item.qty}`).join(', ');
      const res = await fetch('https://api.paythor.com/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          payment: {
            amount: amount,
            currency: 'TRY',
            buyer_fee: '0',
            method: 'creditcard',
            merchant_reference: 'ORDER-' + Date.now()
          },
          payer: {
            first_name: payerFirstName,
            last_name: payerLastName,
            email: payerEmail,
            phone: payerPhone,
            address,
            ip: '127.0.0.1'
          },
          order: {
            cart: cartItems,
            shipping: {
              first_name: payerFirstName,
              last_name: payerLastName,
              phone: payerPhone,
              email: payerEmail,
              address
            },
            invoice: {
              id: 'cart_hash_' + Date.now(),
              first_name: payerFirstName,
              last_name: payerLastName,
              price: amount,
              quantity: 1
            }
          }
        })
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        data = { message: 'API beklenmeyen bir yanıt verdi.' };
      }
      if (
        typeof data === 'object' &&
        (data.status === 'success' || data.status === true) &&
        data.data && typeof data.data === 'object' && data.data.payment_link
      ) {
        setResult({
          link: data.data.payment_link,
          products: productListText
        });
        setCart([]);
      } else {
        let hata = (data && typeof data === 'object' && (data.message || data.error)) ? (data.message || data.error) : 'API beklenmeyen bir yanıt verdi.';
        if (data && typeof data === 'object' && data.details) {
          if (Array.isArray(data.details)) {
            hata += '\n' + data.details.join('\n');
          } else {
            hata += '\n' + data.details;
          }
        }
        setError(hata);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Giriş yapan kullanıcıyı ve tokenı localStorage'dan al
  const userEmail = localStorage.getItem('email');
  const paythorToken = localStorage.getItem('paythor_token');
  const debugInfo = {
    email: userEmail,
    paythor_token: paythorToken,
    token: localStorage.getItem('token'),
    paythor_user_email: localStorage.getItem('paythor_user_email'),
  };

  // Ürün görseli: Ürün eklenirken atanmış görsel veya emoji varsa onu kullan
  // (product.image varsa onu göster, yoksa emoji fallback)

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <div className="container my-auto" style={{ maxWidth: 950 }}>
        <div className="bg-white rounded-4 shadow p-3 mb-4 position-relative w-100">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="small text-muted">
              Giriş yapan: {userEmail}
              <details className="mt-1">
                <summary style={{cursor:'pointer',fontSize:12}}>Debug: Login Bilgileri</summary>
                <pre style={{fontSize:11,background:'#f8f9fa',padding:8,borderRadius:6}}>{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            </div>
            <div>
              <a href="/products" className="btn btn-outline-secondary btn-sm me-2">Ürün Paneli</a>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  // Tüm login bilgilerini temizle
                  localStorage.removeItem('paythor_token');
                  localStorage.removeItem('token');
                  localStorage.removeItem('email');
                  localStorage.removeItem('user');
                  localStorage.removeItem('merchant');
                  // İsteğe bağlı: başka loginle ilgili anahtarlar varsa onları da sil
                  sessionStorage.clear();
                  // Yönlendir
                  navigate('/login', { replace: true });
                }}
              >
                Çıkış
              </button>
            </div>
          </div>
          <h2 className="text-center fw-bold mb-3">POS Satış Ekranı</h2>
          <div className="row g-3">
            {/* Ürünler */}
            <div className="col-md-5">
              <div className="fw-semibold mb-2">Ürünler</div>
              <div className="d-flex flex-column gap-2">
                {products.map((p, i) => (
                  <button
                    key={i}
                    className="btn btn-light d-flex align-items-center justify-content-between px-3 py-2 border rounded-3 shadow-sm fs-5 text-start"
                    onClick={() => addToCart(p)}
                  >
                    <span className="me-2" style={{ fontSize: 28 }}>
                      {p.image
                        ? (p.image.startsWith('data:')
                            ? <img src={p.image} alt="Ürün" style={{ maxWidth: 32, maxHeight: 32, borderRadius: 6, border: '1px solid #ddd', verticalAlign: 'middle' }} />
                            : <span>{p.image}</span>)
                        : '📦'}
                    </span>
                    <span className="flex-grow-1">{p.name}</span>
                    <span className="fw-bold text-primary">{p.price.toFixed(2)} TL</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <div className="fw-semibold mb-2">Müşteri Bilgileri</div>
                <div className="row g-2">
                  <div className="col">
                    <input className="form-control form-control-sm" placeholder="Ad" value={payerFirstName} onChange={e => setPayerFirstName(e.target.value)} />
                  </div>
                  <div className="col">
                    <input className="form-control form-control-sm" placeholder="Soyad" value={payerLastName} onChange={e => setPayerLastName(e.target.value)} />
                  </div>
                  <div className="col">
                    <input className="form-control form-control-sm" placeholder="E-posta" value={payerEmail} onChange={e => setPayerEmail(e.target.value)} />
                  </div>
                  <div className="col">
                    <input className="form-control form-control-sm" placeholder="Telefon" value={payerPhone} onChange={e => setPayerPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            {/* Sepet */}
            <div className="col-md-7">
              <div className="bg-light rounded-3 p-4 h-100">
                <div className="fw-semibold mb-3">Sepet</div>
                <div style={{ minHeight: 220 }}>
                  {cart.length === 0 && <div className="text-muted text-center py-4">Sepet boş</div>}
                  {cart.length > 0 && (
                    <div className="list-group mb-3">
                      {cart.map((item, i) => (
                        <div className="list-group-item d-flex align-items-center justify-content-between gap-2 py-3 rounded-3 mb-2 shadow-sm" key={i}>
                          <div className="fw-bold flex-grow-1">{item.name}</div>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={e => updateQty(i, Math.max(1, Number(e.target.value)))}
                            className="form-control form-control-sm text-center mx-2"
                            style={{ width: 60 }}
                          />
                          <div className="text-primary fw-semibold" style={{ minWidth: 70 }}>{(item.price * item.qty).toFixed(2)} TL</div>
                          <button className="btn btn-sm btn-danger px-2 py-1" onClick={() => removeFromCart(i)}>
                            Sil
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-end align-items-center mt-3 mb-2">
                  <span className="fw-bold fs-5 me-3">Toplam: <span className="text-dark">{total.toFixed(2)} TL</span></span>
                </div>
                {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
                {result && typeof result === 'object' && result.link && result.products && (
                  <div className="alert alert-success py-2 text-center" style={{wordBreak:'break-all',overflowWrap:'anywhere'}}>
                    <div style={{fontWeight:'bold',fontSize:14}}>Sepetteki Ürünler:</div>
                    <div style={{fontSize:13,marginBottom:6}}>{result.products}</div>
                    <div>
                      Ödeme linki oluşturuldu: <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{display:'inline-block',maxWidth:'100%',overflowWrap:'anywhere',wordBreak:'break-all'}}>
                        {result.link}
                      </a>
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-primary w-100 fs-5 py-2"
                  disabled={cart.length === 0 || loading}
                  onClick={handlePayment}
                >
                  {loading ? 'Ödeme Yapılıyor...' : 'Ödeme Oluştur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
