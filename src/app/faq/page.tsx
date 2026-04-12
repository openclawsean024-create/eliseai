'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const DEFAULT_FAQS: FAQ[] = [
  { id: '1', question: '請假怎麼請', answer: '請假的流程如下：\n1. 提前向直屬主管提出申請\n2. 登入人資系統填寫假單\n3. 選擇假別（特休假、病假、事假等）\n4. 填寫請假日期與事由\n5. 提交後等待主管核准\n\n💡 特休假需提前 3 天申請，事假需提前 1 天申請。', category: '請假流程' },
  { id: '2', question: '加班怎麼申請', answer: '加班申請方式：\n1. 提前填寫加班申請單（人資系統）\n2. 說明加班原因與預計時數\n3. 主管核准後即可加班\n4. 加班時數會以補休或加班費計算\n\n💡 平日加班以 1.33 倍計算，假日加班以 2 倍計算。', category: '加班制度' },
  { id: '3', question: 'IT 故障怎麼處理', answer: 'IT 故障處理方式：\n1. 先嘗試重啟設備\n2. 檢查網路線是否鬆脫\n3. 聯繫 IT 部門：ext. 8888 或 it@company.com\n4. 緊急狀況可直接撥打 IT 專線：0912-345-678\n\n💡 請提供：姓名、部門、設備型號、問題描述。', category: 'IT 問題' },
  { id: '4', question: '費用報銷流程', answer: '費用報銷流程：\n1. 發票或收據需清楚載明品項與金額\n2. 登入費用系統填寫報銷單\n3. 附上相關單據圖片\n4. 提交後由主管與財務審核\n5. 審核通過後款項會匯入指定帳戶\n\n💡 請款期限為消費日起 30 天內。', category: '財務報銷' },
  { id: '5', question: '如何申請設備', answer: '設備申請流程：\n1. 填寫設備申請單（主管初審）\n2. IT 部門評估必要性\n3. 採購部門比價後採購\n4. 設備到位後通知領取\n\n💡 一般設備申請約需 5-7 個工作天。', category: '設備申請' },
  { id: '6', question: '會議室預約方式', answer: '會議室預約方式：\n1. 登入公司預約系統\n2. 選擇日期與可用的會議室\n3. 填寫會議主題與參加人數\n4. 系統會發送邀請通知\n\n💡 會議室使用上限為 4 小時/次，如需延長請提前更新預約。', category: '行政資源' },
  { id: '7', question: '新進員工報到流程', answer: '新進員工報到流程：\n1. 攜帶身份證、畢業證書等正本\n2. 至 HR 部門填寫到職資料\n3. 領取員工卡、門禁卡、信箱鑰匙\n4. IT 部門協助開通系統帳號\n5. 參加新人訓練（每週三下午）\n\n💡 報到時間為上班日 9:00-10:00。', category: '人事行政' },
  { id: '8', question: '薪資發放日', answer: '薪資發放日期：\n- 月薪：每月 5 日發放（上個月薪資）\n- 加班費：隨當月薪資發放\n- 獎金：依公司規定時間發放\n\n💡 如遇假日會提前一個工作天發放。', category: '薪資福利' },
  { id: '9', question: '如何申請在職證明', answer: '在職證明申請方式：\n1. 攜帶身份證至 HR 部門\n2. 填寫在職證明申請表\n3. 3 個工作天後領取\n\n💡 申請次數以 3 次/年為限，電子版申請請Email至 hr@company.com。', category: '人事行政' },
  { id: '10', question: '下班忘記打卡怎麼辦', answer: '下班忘記打卡處理方式：\n1. 立即通知直屬主管\n2. 填寫忘記打卡申請單\n3. 主管簽核後送 HR 備查\n\n💡 每個月有 1 次補打卡機會，超過需扣款。', category: '考勤制度' },
]

const CATEGORIES = ['請假流程', '加班制度', 'IT 問題', '財務報銷', '設備申請', '行政資源', '人事行政', '薪資福利', '考勤制度', '其他']

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS)
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eliseai_faqs')
      if (saved) setFaqs(JSON.parse(saved))
    } catch {}
  }, [])

  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = selectedCategory === '全部' || faq.category === selectedCategory
    const matchSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const categories = ['全部', ...CATEGORIES.filter(c => faqs.some(f => f.category === c))]

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">EliseAI</h1>
              <p className="text-xs text-gray-400">FAQ 知識庫</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat" className="text-sm text-gray-400 hover:text-blue-600">開始對話</Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-blue-600">首頁</Link>
            <Link href="/admin" className="text-sm text-gray-400 hover:text-blue-600">管理</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">📖 常見問題</h2>
          <p className="text-gray-500">點擊問題展開答案，或使用搜尋快速找到所需的資訊</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜尋問題或關鍵字..."
            className="w-full max-w-md mx-auto block border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              <p>找不到符合的問題</p>
              <Link href="/chat" className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-xs">
                → 嘗試在對話中詢問 →
              </Link>
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div key={faq.id}>
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium shrink-0">{faq.category}</span>
                      <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                    </div>
                    <span className={`text-gray-400 transition-transform shrink-0 ${expandedId === faq.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>
                {expandedId === faq.id && (
                  <div className="px-6 pb-4 -mt-2">
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ml-12">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            找不到答案？<Link href="/chat" className="text-blue-600 hover:text-blue-700">嘗試與 AI 對話</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
