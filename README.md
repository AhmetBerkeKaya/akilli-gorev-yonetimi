# 🚀 Akıllı Görev ve Öncelik Yönetim Sistemi (AI-Augmented)

> **Ders:** BİL440 - YZ Destekli Yazılım Geliştirme (Final Projesi)  
> **Öğrenci:** Ahmet Berke Kaya (220601053)  
> **Dönem:** 2025-2026 Güz

Bu proje, klasik görev yönetim sistemlerini **Üretken Yapay Zeka (Generative AI)** yetenekleriyle birleştirerek; kullanıcının görevlerini sadece listelemesini değil, **gecikme risklerini analiz etmesini** ve **akıllı sıralama önerileri** almasını sağlayan bir web uygulamasıdır.

---

## 🌟 Öne Çıkan Özellikler

- **AI Risk Analizi:** Google Gemini 1.5 Flash modeli, görevlerinizi analiz eder ve "Bu yetişmez!" dediği görevleri kırmızı alarm ile bildirir.
- **Akıllı Planlama:** "Hangi işten başlasam?" derdine son. Sistem, deadline ve iş yüküne göre size en mantıklı sırayı önerir.
- **Modern UI:** React ve Tailwind CSS ile geliştirilmiş, mobil uyumlu (Responsive) ve şık arayüz.
- **Güvenli Mimari:** API anahtarları sunucu tarafında (Node.js) saklanır, istemciye ifşa edilmez.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | Hızlı ve modern arayüz tasarımı. |
| **Backend** | Node.js, Express | API Proxy ve AI mantık katmanı. |
| **Veritabanı** | Supabase (PostgreSQL) | İlişkisel veri saklama. |
| **AI Model** | Google Gemini 1.5 Flash | Risk analizi ve karar destek motoru. |
| **Test** | Jest, Supertest | API doğrulama ve uç durum testleri. |

---

## 🤖 Yapay Zeka Entegrasyonu ve Rolleri

Bu proje geliştirilirken **"Human-in-the-Loop"** (İnsan Döngüde) yaklaşımı izlenmiş ve aşağıdaki YZ araçları kullanılmıştır:

1.  **Google Gemini (Backend & Mimar):** * Veritabanı şemasının tasarlanması.
    * Risk analizi algoritmasının kurgulanması ("Agile Koç" promptu ile).
2.  **ChatGPT (Frontend & Test):**
    * UI/UX renk paleti ve kart tasarımı.
    * Jest ile Unit Test senaryolarının (Edge-cases dahil) yazılması.

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Repoyu Klonlayın
```bash
git clone [https://github.com/KULLANICI_ADIN/akilli-gorev-yonetimi.git](https://github.com/KULLANICI_ADIN/akilli-gorev-yonetimi.git)
cd akilli-gorev-yonetimi
```

### 2. Backend Kurulumu
```bash
cd server
npm install
# .env dosyasını oluşturun ve içine şunları ekleyin:
# SUPABASE_URL=...
# SUPABASE_KEY=...
# GEMINI_API_KEY=...
npm start
```

### 3. Frontend Kurulumu
```bash

cd ../client
npm install
npm run dev
```
### 📄 Lisans ve Etik

Bu proje MIT Lisansı ile sunulmuştur. Yapay zeka tarafından üretilen kodlar insan denetiminden geçirilmiştir. Kullanıcı verileri (PII) anonimleştirilerek işlenmektedir.