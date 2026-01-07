// server/server.test.js
const request = require('supertest');
const app = require('./index'); // Backend uygulamamızı çağırıyoruz

describe('Görev Yönetim Sistemi API Testleri', () => {
    
    // Test 1: Görevler listesi başarıyla geliyor mu?
    it('GET /tasks endpointi 200 OK dönmeli ve JSON olmalı', async () => {
        const res = await request(app).get('/tasks');
        
        // 1. Durum kodu 200 mü?
        expect(res.statusCode).toEqual(200);
        
        // 2. Gelen veri bir liste (array) mi?
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Test 2: Olmayan bir sayfaya gidince hata veriyor mu?
    it('Tanımsız rotaya gidince 404 dönmeli', async () => {
        const res = await request(app).get('/olmayan-sayfa-xyz');
        expect(res.statusCode).toEqual(404);
    });
});