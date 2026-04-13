'use client';

import { useState, useEffect } from 'react';

type Category = 'faq' | 'script' | 'process';
interface KnowledgeItem { id: string; category: Category; question: string; answer: string; }

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [importText, setImportText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: 'faq' as Category, question: '', answer: '' });

  useEffect(() => {
    const stored = localStorage.getItem('elise_kb');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (next: KnowledgeItem[]) => {
    setItems(next);
    localStorage.setItem('elise_kb', JSON.stringify(next));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === 'admin123') { setAuth(true); setError(''); }
    else setError('密碼錯誤');
  };

  const handleAdd = () => {
    if (!form.question || !form.answer) return;
    const item: KnowledgeItem = { id: Date.now().toString(), ...form };
    save([...items, item]);
    setForm({ category: 'faq', question: '', answer: '' });
  };

  const handleDelete = (id: string) => save(items.filter(i => i.id !== id));

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setForm({ category: item.category, question: item.question, answer: item.answer });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    save(items.map(i => i.id === editingId ? { ...i, ...form } : i));
    setEditingId(null);
    setForm({ category: 'faq', question: '', answer: '' });
  };

  const handleImportCSV = () => {
    try {
      const lines = importText.trim().split('\n');
      const newItems: KnowledgeItem[] = lines.map((line, idx) => {
        const parts = line.split(',');
        const question = parts[0]?.trim().replace(/^"|"$/g, '') || '';
        const answer = parts.slice(1).join(',').trim().replace(/^"|"$/g, '') || '';
        return { id: 'import_' + Date.now() + '_' + idx, category: 'faq' as Category, question, answer };
      }).filter(i => i.question && i.answer);
      if (newItems.length === 0) { alert('無效格式，請使用：問題,答案'); return; }
      save([...items, ...newItems]);
      setImportText('');
      alert(`已匯入 ${newItems.length} 筆`);
    } catch { alert('CSV 解析失敗'); }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">E</div>
            <h1 className="text-2xl font-bold text-gray-900">EliseAI 管理後台</h1>
            <p className="text-gray-500 text-sm mt-1">FAQ 知識庫管理</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">登入</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">E</div>
          <div>
            <h1 className="font-bold text-gray-900">FAQ 管理後台</h1>
            <p className="text-xs text-gray-500">{items.length} 筆知識庫</p>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('elise_kb'); setItems([]); }}
          className="text-sm text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded">重置</button>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* CSV Import */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-gray-900 mb-2">CSV 匯入</h2>
          <p className="text-sm text-gray-500 mb-3">格式：問題,答案（每行一組）</p>
          <textarea value={importText} onChange={e => setImportText(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm font-mono mb-3" rows={4}
            placeholder="請假怎麼請,請至人事系統填寫假單&#10;訂單查詢,請至訂單系統查詢" />
          <button onClick={handleImportCSV}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
            匯入 CSV
          </button>
        </div>

        {/* Add new */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-gray-900 mb-4">{editingId ? '編輯項目' : '新增 FAQ'}</h2>
          <div className="flex gap-2 mb-3">
            {(['faq', 'script', 'process'] as Category[]).map(cat => (
              <button key={cat} onClick={() => setForm({...form, category: cat})}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${form.category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {cat === 'faq' ? 'FAQ' : cat === 'script' ? '話術' : '流程'}
              </button>
            ))}
          </div>
          <input value={form.question} onChange={e => setForm({...form, question: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="問題" />
          <textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 mb-3" rows={3} placeholder="答案" />
          <div className="flex gap-2">
            {editingId ? (
              <>
                <button onClick={handleSaveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">儲存</button>
                <button onClick={() => { setEditingId(null); setForm({category:'faq',question:'',answer:''}); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg">取消</button>
              </>
            ) : (
              <button onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">新增</button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b"><h2 className="font-bold text-gray-900">知識庫列表</h2></div>
          <div className="divide-y">
            {items.map(item => (
              <div key={item.id} className="p-4">
                {editingId === item.id ? null : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.category === 'faq' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'script' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{item.category === 'faq' ? 'FAQ' : item.category === 'script' ? '話術' : '流程'}</span>
                      <p className="font-semibold text-sm mt-1">{item.question}</p>
                      <p className="text-gray-500 text-sm mt-1">{item.answer}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-3 py-1 border border-blue-200 rounded">編輯</button>
                      <button onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-1 border border-red-200 rounded">刪除</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && <div className="p-8 text-center text-gray-400">尚無知識庫項目</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
