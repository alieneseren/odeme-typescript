import React from 'react';


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const RegisterPage: React.FC = () => {
  // User fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  // Merchant fields
  const [programId] = useState(1); // zorunlu
  const [merchantName, setMerchantName] = useState('');
  const [merchantCompany, setMerchantCompany] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [merchantWeb, setMerchantWeb] = useState('');
  const [merchantCountry, setMerchantCountry] = useState('tr');
  const [merchantLang, setMerchantLang] = useState('en_US');
  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Zorunlu alan kontrolü
    if (!firstname || !lastname || !userEmail || !userPhone || !userPassword || !merchantName || !merchantCompany || !merchantEmail || !merchantPhone || !merchantCountry) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('https://api.paythor.com/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            firstname,
            lastname,
            email: userEmail,
            phone: userPhone,
            password: userPassword
          },
          merchant: {
            program_id: programId,
            name: merchantName,
            company: merchantCompany,
            email: merchantEmail,
            phone: merchantPhone,
            web: merchantWeb,
            country: merchantCountry,
            lang: merchantLang
          }
        })
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError('API yanıtı okunamadı.');
        setLoading(false);
        return;
      }
      if (!res.ok || (data.status && data.status !== 'success')) {
        let details = '';
        let turkishMailError = '';
        let turkishWebError = '';
        if (data.details && Array.isArray(data.details) && data.details.length > 0) {
          const lowerDetails = data.details.map((d: any) => (typeof d === 'string' ? d.toLowerCase() : ''));
          if (lowerDetails.some((d: string) => d.includes('user.email') && d.includes('taken')) ||
              lowerDetails.some((d: string) => d.includes('merchant.email') && d.includes('taken'))) {
            turkishMailError = 'Bu e-posta adresi ile daha önce kayıt olunmuş. Lütfen farklı bir e-posta adresi girin.';
          }
          if (lowerDetails.some((d: string) => d.includes('merchant.web') && d.includes('taken'))) {
            turkishWebError = 'Bu web adresi ile daha önce kayıt olunmuş. Lütfen farklı bir web adresi girin.';
          }
          details = '\n' + data.details.map((d: any) => (typeof d === 'string' ? d : JSON.stringify(d))).join('\n');
        }
        if (turkishMailError) {
          setError(turkishMailError);
        } else if (turkishWebError) {
          setError(turkishWebError);
        } else {
          setError((data.message || 'Kayıt başarısız.') + details);
        }
        setLoading(false);
        return;
      }
      setSuccess(data.message || 'Kayıt başarılı! Giriş yapabilirsiniz.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Bilinmeyen hata.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 500 }}>
        <h2 className="mb-4 text-center">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm d-flex flex-column align-items-center">
          <h5 className="mb-3 w-100 text-center">Kullanıcı Bilgileri</h5>
          <div className="mb-3 w-100">
            <label className="form-label">Ad <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={firstname} onChange={e => setFirstname(e.target.value)} required />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Soyad <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={lastname} onChange={e => setLastname(e.target.value)} required />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">E-posta <span className="text-danger">*</span></label>
            <input type="email" className="form-control" value={userEmail} onChange={e => setUserEmail(e.target.value)} required />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Telefon <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={userPhone} onChange={e => setUserPhone(e.target.value)} required placeholder="905551234567" />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Şifre <span className="text-danger">*</span></label>
            <input type="password" className="form-control" value={userPassword} onChange={e => setUserPassword(e.target.value)} required />
          </div>
          <hr className="w-100" />
          <h5 className="mb-3 w-100 text-center">Mağaza Bilgileri</h5>
          <div className="mb-3 w-100">
            <label className="form-label">Program ID <span className="text-danger">*</span></label>
            <input type="number" className="form-control" value={programId} disabled readOnly required min={1} />
            <div className="form-text">Program ID varsayılan olarak 1'dir ve değiştirilemez.</div>
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Mağaza Adı <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={merchantName} onChange={e => setMerchantName(e.target.value)} required />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Şirket Adı <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={merchantCompany} onChange={e => setMerchantCompany(e.target.value)} required />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">İletişim E-posta <span className="text-danger">*</span></label>
            <input type="email" className="form-control" value={merchantEmail} onChange={e => setMerchantEmail(e.target.value)} required />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">İletişim Telefon <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={merchantPhone} onChange={e => setMerchantPhone(e.target.value)} required placeholder="905551234567" />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Web Sitesi</label>
            <input type="text" className="form-control" value={merchantWeb} onChange={e => setMerchantWeb(e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Ülke <span className="text-danger">*</span></label>
            <input type="text" className="form-control" value={merchantCountry} onChange={e => setMerchantCountry(e.target.value)} required placeholder="tr" />
          </div>
          <div className="mb-3 w-100">
            <label className="form-label">Dil</label>
            <input type="text" className="form-control" value={merchantLang} onChange={e => setMerchantLang(e.target.value)} placeholder="en_US" />
          </div>
          {error && <div className="alert alert-danger py-2 w-100 text-center">{error}</div>}
          {success && <div className="alert alert-success py-2 w-100 text-center">{success}</div>}
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </button>
          <div className="mt-3 text-center w-100">
            <Link to="/login">Zaten hesabınız var mı? Giriş Yapın</Link>
          </div>
          </form>
      </div>
    </div>
  );
};

export default RegisterPage;
