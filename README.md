
# React + TypeScript POS Uygulaması

Bu proje, Paythor API ile entegre çalışan, kullanıcı girişi, kayıt, ürün yönetimi ve ödeme oluşturma özelliklerine sahip bir POS (Satış Noktası) uygulamasıdır. Modern arayüz için Bootstrap kullanılır. Ürünler localStorage'da saklanır.

## Başlangıç

1. Bağımlılıkları yükleyin:
   ```sh
   npm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```sh
   npm run dev
   ```

## Özellikler
- Kullanıcı girişi ve kayıt (Paythor API)
- OTP ile doğrulama
- Ürün ekleme, silme, güncelleme (localStorage)
- Ödeme oluşturma (Paythor API)
- Bootstrap ile modern arayüz

## API
- https://api.paythor.com/auth/register/
- https://api.paythor.com/auth/signin
- https://api.paythor.com/otp/verify
- https://api.paythor.com/payment/create

## Not
Bu proje örnek amaçlıdır. Gerçek projelerde güvenlik ve hata yönetimi için ek önlemler alınmalıdır.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
