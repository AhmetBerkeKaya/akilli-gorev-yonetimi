// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. Tüm Görevleri Getir (GET)
app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 2. Yeni Görev Ekle (POST)
app.post('/tasks', async (req, res) => {
    const { title, priority, estimated_hours, user_id } = req.body;
    // Not: Gerçek uygulamada user_id auth token'dan alınmalı, şimdilik body'den alıyoruz.

    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, priority, estimated_hours, user_id, status: 'pending' }])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 3. Görev Güncelle (PUT - Tamamlandı vs.)
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 4. Görev Sil (DELETE)
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Görev silindi' });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server çalışıyor: http://localhost:${process.env.PORT || 3000}`);
});