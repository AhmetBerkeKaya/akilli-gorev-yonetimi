// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Supabase ve Gemini Bağlantıları
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- MEVCUT CRUD İŞLEMLERİ (Aynen Kalıyor) ---

// 1. Görevleri Getir
app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 2. Görev Ekle
app.post('/tasks', async (req, res) => {
    const { title, priority, estimated_hours, deadline, user_id } = req.body;
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, priority, estimated_hours, deadline, user_id, status: 'pending' }])
        .select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 3. Görev Sil
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Silindi' });
});

// --- YENİ: AI ANALİZ ENDPOINT'İ (Projenin Kalbi) ---
app.post('/analyze-tasks', async (req, res) => {
    try {
        const tasks = req.body.tasks;

        // KONTROL: API Key
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key eksik." });
        }

        // Model Tanımı (Senin çalışan versiyonun kalsın)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --- GELİŞMİŞ PROMPT MÜHENDİSLİĞİ ---
        const prompt = `
        Sen Deneyimli bir Proje Yöneticisi ve Agile Koçusun.
        Şu anki tarih: ${new Date().toLocaleDateString()}
        
        Aşağıdaki görev listesini analiz et:
        ${JSON.stringify(tasks)}

        Görevleri şu kriterlere göre eleştir:
        1. Teslim tarihi geçmiş mi? (Acil Risk)
        2. Teslim tarihine 2 günden az kalmış ve tahmini süresi yüksek mi? (Yüksek Risk)
        3. Mantıksızlık var mı? (Örn: 1 saatlik işe 1 ay süre verilmiş mi?)

        Çıktıyı SADECE şu JSON formatında ver (Markdown kullanma):
        {
            "risky_tasks": [Riskli görevlerin ID'leri (Number array)],
            "suggestions": [
                "Buraya görev ADINI geçirerek spesifik tavsiyeler yaz.",
                "Örnek: 'X görevi için sadece 2 saat kalmış ama tahmini süre 5 saat, bu yetişmez!' gibi net ve sert uyarılar ver.",
                "Eğer her şey yolundaysa 'Harika gidiyorsun, bir kahve molası ver' de."
            ],
            "reordered_ids": [Öncelik sırasına göre optimize edilmiş ID listesi]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Temizlik
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        console.log("Akıllı AI Cevabı:", text); 

        res.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Hatası:", error);
        res.status(500).json({ error: "Analiz yapılamadı." });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server çalışıyor: http://localhost:${process.env.PORT || 3000}`);
});

module.exports = app;