# Express CRUD Users with JSON Storage & Simple Auth

REST API sederhana untuk manajemen data pengguna dengan autentikasi menggunakan **header statis** dan penyimpanan data di file JSON. Proyek ini cocok untuk belajar dasar Express.js, middleware, autentikasi sederhana, dan operasi CRUD dengan file system.

## 🚀 Fitur

- Register & Login (tanpa enkripsi password – untuk pembelajaran)
- Autentikasi dengan header `Authentication: hello`
- CRUD lengkap untuk users (GET, POST, PATCH, DELETE)
- Penyimpanan persistent di file JSON (data tidak hilang saat server restart)
- Menggunakan **ES Modules** (`import/export`)
- Struktur proyek rapi: models, controllers, routes, middleware, lib
- Async/Await untuk operasi I/O
- Error handling yang baik

## 📦 Teknologi

- Node.js (ES Modules)
- Express.js
- File System (fs/promises) – native Node.js
- JSON sebagai database

## 📁 Struktur Proyek
project/
├── data/
│ └── users.json # File penyimpanan data (auto-generated)
├── lib/
│ └── storage.js # Utility baca/tulis JSON
├── models/
│ └── users.model.js # Model untuk operasi CRUD
├── controllers/
│ ├── auth.controller.js # Auth logic (register, login)
│ └── users.controller.js # User CRUD logic
├── routers/
│ ├── auth.router.js # Route auth
│ └── users.router.js # Route users (protected)
├── index.js # Entry point
├── .env # file env
├── package.json
└── README.md

## Instalasi dan Jalankan Backend
1. clone github
2. Buka terminal dan masuk ke directory
3. buat file .env seperti sample
4. install dependency
5. run program backend
```bash
npm install
npm run dev
```