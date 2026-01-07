import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('');
  const [deadline, setDeadline] = useState('');
  
  // AI Sonuçları
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Hata mesajları için state

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Bağlantı hatası:", err);
    }
  };

  const handleAdd = async () => {
    if (!title) return;
    
    const payload = {
        title,
        priority: 'medium',
        // Geçici ID (Backend kısıtlamasını kaldırdığımız için sorun olmaz)
        user_id: 'e2a6d7f4-8a1c-4b3e-9f1d-5c6a7b8e9f0a', 
    };

    if (hours) payload.estimated_hours = hours;
    if (deadline) payload.deadline = deadline;

    try {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setTitle('');
            setHours('');
            setDeadline('');
            loadTasks();
            setError(null);
        } else {
            const err = await res.json();
            setError("Kayıt başarısız: " + err.error);
        }
    } catch (err) {
        setError("Sunucuya ulaşılamadı.");
    }
  };

  const runAIAnalysis = async () => {
    setLoading(true);
    setAiAnalysis(null);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/analyze-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      });
      
      if (!res.ok) throw new Error("AI Analizi başarısız oldu.");
      
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      setError("Yapay zeka şu an yanıt veremiyor. Lütfen terminali kontrol edin.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        
        {/* HEADER */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            🚀 Akıllı Görev Asistanı
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Yapay zeka destekli öncelik ve risk analizi sistemi.
          </p>
        </header>
        
        {/* HATA KUTUSU */}
        {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </div>
        )}

        {/* ANA FORM KARTI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 transition-shadow hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Görev Başlığı</label>
              <input 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Örn: Final projesi raporunu yaz..." 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Saat (Tahmini)</label>
              <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                  value={hours} 
                  onChange={e => setHours(e.target.value)} 
                  placeholder="2" 
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teslim Tarihi</label>
              <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
              />
            </div>
            <div className="md:col-span-1">
              <button 
                  onClick={handleAdd} 
                  className="w-full h-[50px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition flex items-center justify-center shadow-lg shadow-indigo-200"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* AI ANALİZ BUTONU */}
        <div className="mb-8">
            <button 
                onClick={runAIAnalysis} 
                disabled={loading || tasks.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-3 transition-all transform active:scale-95
                    ${loading || tasks.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-indigo-200'}
                `}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Yapay Zeka Analiz Ediyor...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Risk Analizi ve Planlama Yap
                    </>
                )}
            </button>

            {/* AI SONUÇLARI */}
            {aiAnalysis && (
                <div className="mt-6 bg-white border border-violet-100 rounded-2xl p-6 shadow-xl shadow-violet-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🤖</span> Gemini Analiz Raporu
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <span className="block text-sm font-bold text-red-600 uppercase tracking-wide mb-2">⚠️ Riskli Görevler</span>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis.risky_tasks?.length > 0 ? (
                                    aiAnalysis.risky_tasks.map(id => {
                                        const t = tasks.find(x => x.id === id);
                                        return (
                                            <span key={id} className="bg-white text-red-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-red-100 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                {t ? t.title : "Bilinmeyen Görev"}
                                            </span>
                                        )
                                    })
                                ) : (
                                    <span className="text-gray-500 text-sm italic">Riskli görev bulunamadı, harika!</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                            <span className="block text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">💡 Akıllı Öneriler</span>
                            <ul className="space-y-2">
                                {aiAnalysis.suggestions?.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* GÖREV LİSTESİ */}
        <div className="grid gap-3">
          {tasks.map(task => (
            <div key={task.id} className="group bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-all flex justify-between items-center hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <h3 className={`font-semibold text-slate-800 text-lg ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
                </div>
                <div className="text-sm text-slate-500 flex gap-4 ml-5">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                        {task.estimated_hours ? `${task.estimated_hours} Saat` : '--'}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('tr-TR') : 'Tarih Yok'}
                    </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${task.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 
                  task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                  'bg-green-50 text-green-600 border border-green-100'
                }`}>
                {task.priority}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400">Henüz hiç görev yok. Yukarıdan bir tane ekle!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;