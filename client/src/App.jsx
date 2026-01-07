import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    estimated_hours: "",
    deadline: "",
    priority: "medium" // Varsayılan öncelik
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Görevler çekilemedi:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.estimated_hours || !newTask.deadline) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          user_id: "e2a6d7f4-8a1c-4b3e-9f1d-5c6a7b8e9f0a" // Sabit ID (Test için)
        }),
      });
      if (res.ok) {
        setNewTask({ title: "", estimated_hours: "", deadline: "", priority: "medium" });
        fetchTasks();
      }
    } catch (error) {
      console.error("Ekleme hatası:", error);
    }
  };

  const analyzeRisks = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch(`${API_URL}/analyze-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analiz hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Öncelik rengini belirleyen yardımcı fonksiyon
  const getPriorityColor = (p) => {
    if (p === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (p) => {
    if (p === 'high') return 'YÜKSEK';
    if (p === 'medium') return 'ORTA';
    return 'DÜŞÜK';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            🚀 Akıllı Görev Asistanı
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Yapay zeka destekli öncelik ve risk analizi sistemi.
          </p>
        </header>

        {/* Görev Ekleme Formu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Görev Başlığı</label>
              <input
                type="text"
                placeholder="Örn: Final projesi raporunu yaz..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saat (Tahmini)</label>
              <input
                type="number"
                placeholder="2"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={newTask.estimated_hours}
                onChange={(e) => setNewTask({ ...newTask, estimated_hours: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Öncelik</label>
               <select
                 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                 value={newTask.priority}
                 onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
               >
                 <option value="low">Düşük</option>
                 <option value="medium">Orta</option>
                 <option value="high">Yüksek</option>
               </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teslim Tarihi</label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>

            <div className="md:col-span-1">
              <button
                onClick={addTask}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center transform active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* AI Analiz Butonu */}
        <button
          onClick={analyzeRisks}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-indigo-500/20 transition-all mb-8 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse">Yapay Zeka Analiz Ediyor...</span>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>Risk Analizi ve Planlama Yap</span>
            </>
          )}
        </button>

        {/* Analiz Sonuçları */}
        {analysis && (
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 mb-8 shadow-sm animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="text-2xl mr-2">🤖</span> Gemini Analiz Raporu
            </h2>
            
            {analysis.risky_tasks && analysis.risky_tasks.length > 0 && (
              <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-5">
                <h3 className="text-red-700 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Riskli Görevler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.risky_tasks.map(id => {
                    const task = tasks.find(t => t.id === id);
                    return task ? (
                      <span key={id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        ⚠️ {task.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <h3 className="text-indigo-800 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                Akıllı Öneriler
              </h3>
              <ul className="space-y-3">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start text-indigo-900 text-sm">
                    <span className="mr-2 mt-1 text-indigo-500">•</span>
                    {sug}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Görev Listesi */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="group bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {task.estimated_hours} Saat
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)} uppercase tracking-wider`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          ))}
          
          {tasks.length === 0 && (
             <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                <p>Henüz görev eklemediniz. Yukarıdan başlayın!</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;