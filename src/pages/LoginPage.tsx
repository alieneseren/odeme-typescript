import React from 'react';


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  // Paythor API için zorunlu parametreler
  const [programId] = useState(1); // Gerçek değerle değiştirin
  const [appId] = useState(102);  // Gerçek değerle değiştirin
  const [authMethod] = useState('email_password_panel');
  const [storeUrl] = useState('');
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Şifre sıfırlama için
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResult, setForgotResult] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.paythor.com/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_query: {
            auth_method: authMethod,
            email,
            password,
            program_id: programId,
            app_id: appId,
            store_url: storeUrl
          }
        })
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        setApiResponse(null);
        setError('API yanıtı okunamadı.');
        return;
      }
      setApiResponse(data);
      if (!res.ok) {
        setError(
          (data && (data.message || data.detail || JSON.stringify(data))) ||
          'Giriş başarısız. Sunucu yanıtı: ' + res.status
        );
        return;
      }
      const token = data.token || (data.data && data.data.token_string);
      if (!token) {
        setError('API yanıtında token bulunamadı. Detay: ' + JSON.stringify(data));
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('paythor_token', token); // Eski HTML ile uyumlu
      localStorage.setItem('email', email);
      localStorage.setItem('paythor_user_email', email); // Eski HTML ile uyumlu
      setShowOtp(true); // OTP ekranını aç
    } catch (err: any) {
      setError('İstemci hatası: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 400 }}>
        <h2 className="mb-4 text-center">Giriş Yap</h2>
        {/* Şifre Sıfırlama Modalı */}
        {showForgot && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.2)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="bg-white p-4 rounded shadow" style={{width:350}}>
              <h5 className="mb-3">Şifre Sıfırlama (OTP ile yeni şifre belirle)</h5>
              <form onSubmit={async e => {
                e.preventDefault();
                setForgotLoading(true);
                setForgotResult(null);
                try {
                  const res = await fetch('https://api.paythor.com/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      forgotpassword: {
                        email: forgotEmail,
                        phone: forgotPhone
                      }
                    })
                  });
                  const data = await res.json();
                  if (data.status === 'success') {
                    setForgotResult('Başarılı: ' + (data.message || 'OTP kodu e-posta/telefonunuza gönderildi.'));
                  } else if (data.status === 'error' && data.message === 'Both email and phone are required.') {
                    setForgotResult('Hata: E-posta ve telefon birlikte gereklidir.');
                  } else {
                    setForgotResult('Hata: ' + (data.message || 'İşlem başarısız.'));
                  }
                } catch (err: any) {
                  setForgotResult('İstemci hatası: ' + (err.message || String(err)));
                } finally {
                  setForgotLoading(false);
                }
              }}>
                <div className="mb-2">
                  <input type="email" className="form-control" placeholder="E-posta" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="Telefon (opsiyonel)" value={forgotPhone} onChange={e => setForgotPhone(e.target.value)} />
                </div>
                {forgotResult && <div className={forgotResult.startsWith('Başarılı') ? 'alert alert-success py-2' : 'alert alert-danger py-2'}>{forgotResult}</div>}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button type="button" className="btn btn-link" onClick={() => { setShowForgot(false); setForgotResult(null); setForgotEmail(''); setForgotPhone(''); }}>Kapat</button>
                  <button type="submit" className="btn btn-primary" disabled={forgotLoading}>{forgotLoading ? 'Gönderiliyor...' : 'OTP Gönder'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Şifre sıfırlama modalı içinde, OTP gönderildiyse ikinci adım: */}
        {showForgot && forgotResult && forgotResult.startsWith('Başarılı') && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.2)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="bg-white p-4 rounded shadow" style={{width:350}}>
              <h5 className="mb-3">Şifre Sıfırlama (OTP ile yeni şifre belirle)</h5>
              <form onSubmit={async e => {
                e.preventDefault();
                setResetLoading(true);
                setResetResult(null);
                try {
                  const res = await fetch('https://api.paythor.com/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      resetpassword: {
                        email: forgotEmail,
                        phone: forgotPhone,
                        otp_code: resetOtp,
                        new_password: resetPassword
                      }
                    })
                  });
                  const data = await res.json();
                  if (data.status === 'success') {
                    setResetResult('Başarılı: ' + (data.message || 'Şifre başarıyla sıfırlandı.'));
                  } else if (data.status === 'error' && data.message === 'User not found. Please check your email or phone number.') {
                    setResetResult('Hata: Kullanıcı bulunamadı. Lütfen e-posta veya telefonunuzu kontrol edin.');
                  } else {
                    setResetResult('Hata: ' + (data.message || 'İşlem başarısız.'));
                  }
                } catch (err: any) {
                  setResetResult('İstemci hatası: ' + (err.message || String(err)));
                } finally {
                  setResetLoading(false);
                }
              }}>
                <div className="mb-2">
                  <input type="text" className="form-control" placeholder="OTP Kodu" value={resetOtp} onChange={e => setResetOtp(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <input type="password" className="form-control" placeholder="Yeni Şifre" value={resetPassword} onChange={e => setResetPassword(e.target.value)} required />
                </div>
                {resetResult && <div className={resetResult.startsWith('Başarılı') ? 'alert alert-success py-2' : 'alert alert-danger py-2'}>{resetResult}</div>}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button type="button" className="btn btn-link" onClick={() => { setShowForgot(false); setForgotResult(null); setForgotEmail(''); setForgotPhone(''); setShowReset(false); setResetOtp(''); setResetPassword(''); setResetResult(null); }}>Kapat</button>
                  <button type="submit" className="btn btn-primary" disabled={resetLoading}>{resetLoading ? 'Gönderiliyor...' : 'Şifreyi Sıfırla'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {!showOtp ? (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
          <div className="mb-3">
            <label className="form-label">E-posta</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
          <div className="mt-3 text-center">
            <Link to="/register">Hesabınız yok mu? Kayıt Olun</Link>
          </div>
          <div className="mt-2 text-center">
            <button type="button" className="btn btn-link p-0" style={{fontSize:14}} onClick={() => setShowForgot(true)}>
              Şifremi Unuttum
            </button>
          </div>
          {apiResponse && (
            <div className="mt-3">
              <div className="alert alert-secondary" style={{ fontSize: 12, wordBreak: 'break-all' }}>
                <strong>API Yanıtı:</strong>
                <pre className="mb-0">{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            </div>
          )}
        </form>
      ) : (
          <form
            onSubmit={async e => {
            e.preventDefault();
            setOtpLoading(true);
            setOtpError(null);
            try {
              const res = await fetch('https://api.paythor.com/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: email, otp })
              });
              const data = await res.json();
              if (!res.ok || data.status !== 'success') {
                setOtpError(data.message || 'OTP doğrulama başarısız');
                return;
              }
              // OTP doğrulandıktan sonra token tekrar kaydedilsin (eski HTML ile uyumlu)
              const token = localStorage.getItem('token');
              const emailVal = localStorage.getItem('email');
              if (token) {
                localStorage.setItem('paythor_token', token);
              }
              if (emailVal) {
                localStorage.setItem('paythor_user_email', emailVal);
              }
              navigate('/payment');
            } catch (err: any) {
              setOtpError('İstemci hatası: ' + (err.message || String(err)));
            } finally {
              setOtpLoading(false);
            }
          }}
            className="bg-white p-4 rounded shadow-sm"
        >
          <div className="mb-3">
            <label className="form-label">E-posta</label>
            <input type="email" className="form-control" value={email} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">OTP Kodu</label>
            <input type="text" className="form-control" value={otp} onChange={e => setOtp(e.target.value)} required />
          </div>
          {otpError && <div className="alert alert-danger py-2">{otpError}</div>}
          <button type="submit" className="btn btn-success w-100" disabled={otpLoading}>
            {otpLoading ? 'Doğrulanıyor...' : 'OTP Doğrula'}
          </button>
        </form>
      )}
      </div>
    </div>
  );
};

export default LoginPage;
