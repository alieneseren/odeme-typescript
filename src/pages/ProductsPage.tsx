import React from 'react';


import { useState, useEffect } from 'react';

type Product = {
  name: string;
  price: number;
  image?: string; // base64 veya url
};

function getProducts(): Product[] {
  return JSON.parse(localStorage.getItem('products') || '[]');
}
function setProducts(arr: Product[]) {
  localStorage.setItem('products', JSON.stringify(arr));
}

import { useNavigate } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProductsState] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Login kontrolü
    let token = localStorage.getItem('paythor_token') || localStorage.getItem('token');
    if (!token || token === '••••••' || token.length < 10) {
      window.location.replace('/login');
      return;
    }
    setProductsState(getProducts());
  }, []);

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) return;
    let updated: Product[];
    if (editIndex !== null) {
      updated = products.map((p, i) => i === editIndex ? { name, price: priceNum, image } : p);
    } else {
      updated = [...products, { name, price: priceNum, image }];
    }
    setProducts(updated);
    setProductsState(updated);
    setName('');
    setPrice('');
    setImage(undefined);
    setEditIndex(null);
  };

  const handleEdit = (i: number) => {
    setName(products[i].name);
    setPrice(products[i].price.toString());
    setImage(products[i].image);
    setEditIndex(i);
  };

  const handleDelete = (i: number) => {
    const updated = products.filter((_, idx) => idx !== i);
    setProducts(updated);
    setProductsState(updated);
    setName('');
    setPrice('');
    setImage(undefined);
    setEditIndex(null);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <div className="bg-white p-4 rounded-4 shadow" style={{ width: 600, minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <a href="/payment" className="btn btn-outline-primary btn-sm">Ödeme Paneli</a>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              localStorage.removeItem('paythor_token');
              localStorage.removeItem('token');
              localStorage.removeItem('email');
              localStorage.removeItem('user');
              localStorage.removeItem('merchant');
              sessionStorage.clear();
              window.location.replace('/login');
            }}
          >
            Çıkış
          </button>
        </div>
        <h2 className="mb-4 text-center">Ürün Yönetim Paneli</h2>
        <form onSubmit={handleAddOrUpdate} className="row g-2 mb-4 align-items-center">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Ürün Adı" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="col-md-3">
            <input type="number" className="form-control" placeholder="Fiyat" value={price} onChange={e => setPrice(e.target.value)} required min={0} step={0.01} />
          </div>
          <div className="col-md-3">
            <input type="file" accept="image/*" className="form-control" onChange={e => {
              const file = e.target.files && e.target.files[0];
              if (!file) return setImage(undefined);
              const reader = new FileReader();
              reader.onload = ev => setImage(ev.target?.result as string);
              reader.readAsDataURL(file);
            }} />
            {image && (
              <div className="mt-1 text-center">
                <img src={image} alt="Ürün görseli" style={{ maxWidth: 48, maxHeight: 48, borderRadius: 6, border: '1px solid #ddd' }} />
              </div>
            )}
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">{editIndex !== null ? 'Güncelle' : 'Ekle'}</button>
          </div>
        </form>
        <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Görsel</th>
            <th>Ürün Adı</th>
            <th>Fiyat (₺)</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={5} className="text-center">Ürün yok</td></tr>
          )}
          {products.map((p, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{p.image ? <img src={p.image} alt="Ürün" style={{ maxWidth: 40, maxHeight: 40, borderRadius: 6, border: '1px solid #ddd' }} /> : <span className="text-muted">Yok</span>}</td>
              <td>{p.name}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>
                <button type="button" className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(i)}>Düzenle</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(i)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
