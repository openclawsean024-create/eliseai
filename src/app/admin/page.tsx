'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const CATEGORIES = ['請假流程', '加班制度', 'IT 問題', '財務報銷', '設備申請', '行政資源', '人事行政', '薪資福利', '考勤制度', '其他']

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ question: '', answer: '', category: '其他' })
  const [addForm, setAddForm] = useState({ question: '', answer: '', category: '其他' })
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eliseai_faqs')
      if (saved) {
        setFaqs(JSON.parse(saved))
      }
    } catch {}
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  const saveFaqs = (newFaqs: FAQ[]) => {
    setFaqs(newFaqs)
    localStorage.setItem('eliseai_faqs', JSON.stringify(newFaqs))
    showToast('✅ 已儲存')
  }

  const startEdit = (faq: FAQ) => {
    setEditId(faq.id)
    setEditForm({ question: faq.question, answer: faq.answer, category: faq.category })
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditForm({ question: '', answer: '', category: '其他' })
  }

  const saveEdit = () => {
    if (!editForm.question.trim() || !editForm.answer.trim()) return
    const updated = faqs.map(f => f.id === editId ? { ...f, ...editForm } : f)
    saveFaqs(updated)
    setEditId(null)
  }

  const deleteFaq = (id: string) => {
    if (!confirm('確定刪除？')) return
    const updated = faqs.filter(f => f.id !== id)
    saveFaqs(updated)
  }

  const addFaq = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.question.trim() || !addForm.answer.trim()) return
    const newFaq: FAQ = { id: generateId(), ...addForm }
    saveFaqs([newFaq, ...faqs])
    setAddForm({ question: '', answer: '', category: '其他' })
    setShowAdd(false)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">EliseAI</h1>
              <p className="text-xs text-gray-400">管理後台</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← 返回首頁</Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">管理後台</h2>
                <p className="text-sm text-gray-400 mt-1">請輸入管理密碼</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="輸入密碼..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                  {authError && <p className="text-red-500 text-xs mt-1.5">密碼錯誤，請再試一次</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  登入
                </button>
              </form>
              <p className="text-center text-xs text-gray-300 mt-4">預設密碼：admin123</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">E</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">EliseAI</h1>
            <p className="text-xs text-gray-400">FAQ 管理後台</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="text-sm text-gray-400 hover:text-gray-600">← 對話頁</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">首頁</Link>
          <button
            onClick={() => { setAuthenticated(false); setPassword('') }}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            登出
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">FAQ 知識庫管理</h2>
            <p className="text-sm text-gray-400 mt-0.5">共 {faqs.length} 筆資料</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            {showAdd ? '取消新增' : '+ 新增 FAQ'}
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">新增 FAQ</h3>
            <form onSubmit={addFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">分類</label>
                <select
                  value={addForm.category}
                  onChange={e => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">問題</label>
                <input
                  type="text"
                  value={addForm.question}
                  onChange={e => setAddForm(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="例如：請假怎麼請"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">回答</label>
                <textarea
                  value={addForm.answer}
                  onChange={e => setAddForm(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="輸入回答內容..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                  確認新增
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2">
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {faqs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">尚無 FAQ 資料</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {faqs.map((faq) => (
                <li key={faq.id} className="p-5 hover:bg-gray-50 transition-colors">
                  {editId === faq.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">分類</label>
                          <select
                            value={editForm.category}
                            onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-400 mb-1">問題</label>
                          <input
                            type="text"
                            value={editForm.question}
                            onChange={e => setEditForm(prev => ({ ...prev, question: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">回答</label>
                        <textarea
                          value={editForm.answer}
                          onChange={e => setEditForm(prev => ({ ...prev, answer: e.target.value }))}
                          rows={4}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg">儲存</button>
                        <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 text-xs px-3 py-1.5">取消</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{faq.category}</span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm mb-1">{faq.question}</p>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(faq)}
                          className="text-gray-300 hover:text-blue-500 text-xs px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="text-gray-300 hover:text-red-500 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
