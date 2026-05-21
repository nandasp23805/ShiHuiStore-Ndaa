# ShiHuiStore Frontend - Production Ready

Website toko jaket online yang dapat diakses secara langsung tanpa backend server.

## 🚀 Live Demo
Deploy di Netlify: https://your-site-name.netlify.app

## 📋 Fitur
- ✅ Katalog produk interaktif
- ✅ Halaman detail produk
- ✅ Keranjang belanja (localStorage)
- ✅ Sistem autentikasi (localStorage)
- ✅ Design responsive dengan Tailwind CSS
- ✅ Build dengan Vite (cepat & optimal)

## 🛠️ Setup Lokal

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173

## 📦 Build & Deploy

```bash
npm run build
```

Push ke GitHub dan Netlify akan otomatis deploy folder `dist/`

## 📁 Struktur Folder
```
frontend/
├── src/
│   ├── components/    # Komponen reusable
│   ├── pages/         # Halaman utama
│   ├── context/       # State management
│   ├── data/          # Data fallback (tanpa API)
│   ├── lib/           # Utility functions
│   └── App.jsx        # Main app
├── public/            # Static assets
├── index.html         # Entry point
├── vite.config.js     # Vite config
└── tailwind.config.js # Tailwind config
```

## 🔧 Teknologi
- React 18
- Vite 5
- Tailwind CSS
- React Router v6
- Lucide Icons

## 📝 License
MIT