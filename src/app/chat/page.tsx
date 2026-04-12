'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'ai' | 'tool'
  content: string
  timestamp: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface Task {
  id: string
  content: string
  createdAt: number
  done: boolean
}

// Default 10 FAQs
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

// Tool patterns
const TOOL_PATTERNS = [
  { pattern: /天氣|氣溫|下雨|溫度|weather/i, tool: 'weather' },
  { pattern: /匯率|兌換|外幣|currency|美金|歐元|日幣/i, tool: 'currency' },
  { pattern: /倒數|countdown|計時/i, tool: 'countdown' },
  { pattern: /記錄任務|新任務|新增任務/i, tool: 'task_add' },
  { pattern: /我的任務|工作列表|待辦/i, tool: 'task_list' },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function findFAQ(query: string, faqs: FAQ[]): FAQ | null {
  const q = query.toLowerCase()
  for (const faq of faqs) {
    const keywords = faq.question.toLowerCase()
    // Simple keyword match - check if key words from query appear in question
    const queryWords = q.split(/\s+/).filter(w => w.length > 1)
    const matchCount = queryWords.filter(w => keywords.includes(w)).length
    if (matchCount >= Math.ceil(queryWords.length * 0.4)) return faq
  }
  return null
}

function processCommand(content: string, faqs: FAQ[]): { response: string | null; tool: string | null; isCommand: boolean } {
  const trimmed = content.trim()

  // FAQ match
  const faq = findFAQ(trimmed, faqs)
  if (faq) {
    return { response: `📖 【${faq.category}】\n\n**${faq.question}**\n\n${faq.answer}`, tool: null, isCommand: false }
  }

  // Tool patterns
  for (const { pattern, tool } of TOOL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { response: null, tool, isCommand: true }
    }
  }

  // Default: no match
  return {
    response: `您好！我是 EliseAI，可以幫您處理以下事務：\n\n💬 **對話諮詢** - 輸入任何問題，我會嘗試為您解答\n📖 **FAQ 查詢** - 例如：「請假怎麼請」、「加班怎麼申請」\n📝 **記錄任務** - 輸入「記錄任務：[內容]」\n📋 **我的任務** - 輸入「我的任務」查看所有任務\n🌤️ **天氣查詢** - 輸入「天氣 台北」\n💱 **匯率查詢** - 輸入「匯率」或「100 美金是多少台幣」\n⏱️ **倒數計時** - 輸入「倒數 10 分鐘」\n\n請選擇您需要的服務！`,
    tool: null,
    isCommand: false
  }
}

// Countdown component shown in chat
function CountdownDisplay({ targetTime, label }: { targetTime: number; label: string }) {
  const [remaining, setRemaining] = useState<number>(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const update = () => {
      const diff = targetTime - Date.now()
      if (diff <= 0) { setDone(true); setRemaining(0); return }
      setRemaining(diff)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  if (done) return <div className="text-green-600 font-medium">✅ {label} — 時間到！</div>

  const totalSec = Math.floor(remaining / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return (
    <div className="font-mono text-sm">
      ⏱️ {label}<br/>
      <span className="text-2xl font-bold text-blue-600">{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS)
  const [tasks, setTasks] = useState<Task[]>([])
  const [countdowns, setCountdowns] = useState<{ id: string; targetTime: number; label: string }[]>([])
  const [showTasks, setShowTasks] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eliseai_faqs')
      if (saved) setFaqs(JSON.parse(saved))
    } catch {}
    try {
      const savedTasks = localStorage.getItem('eliseai_tasks')
      if (savedTasks) setTasks(JSON.parse(savedTasks))
    } catch {}
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = useCallback((role: Message['role'], content: string) => {
    setMessages(prev => [...prev, { id: generateId(), role, content, timestamp: Date.now() }])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: generateId(), role: 'user', content: text, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Check task add command
    const taskMatch = text.match(/^記錄任務[：:]\s*(.+)/)
    if (taskMatch) {
      const taskContent = taskMatch[1].trim()
      const newTask: Task = { id: generateId(), content: taskContent, createdAt: Date.now(), done: false }
      const updatedTasks = [newTask, ...tasks]
      setTasks(updatedTasks)
      localStorage.setItem('eliseai_tasks', JSON.stringify(updatedTasks))
      setIsTyping(false)
      addMessage('ai', `✅ 已記錄任務：「${taskContent}」\n\n您可以隨時輸入「我的任務」查看所有工作清單。`)
      return
    }

    // Check task list command
    if (/^我的任務/.test(text)) {
      setIsTyping(false)
      setShowTasks(true)
      if (tasks.length === 0) {
        addMessage('ai', '📋 目前沒有記錄任何任務。\n\n輸入「記錄任務：[內容]」來新增工作任務。')
      } else {
        const taskList = tasks.map(t =>
          `${t.done ? '✅' : '⬜'} ${t.content}`
        ).join('\n')
        addMessage('ai', `📋 **我的任務**（共 ${tasks.length} 項）：\n\n${taskList}\n\n💡 點擊任務可直接標記完成。`)
      }
      return
    }

    // Check countdown command
    const countdownMatch = text.match(/倒數[(\s)（]?(\d+)\s*(分鐘|分|秒|小時|小時)?[)\s]?/)
    if (countdownMatch) {
      setIsTyping(false)
      let amount = parseInt(countdownMatch[1])
      const unit = countdownMatch[2] || '分鐘'
      if (unit === '秒') amount *= 1000
      else if (unit === '分鐘' || unit === '分') amount *= 60 * 1000
      else if (unit === '小時' || unit === '小時') amount *= 3600 * 1000
      const targetTime = Date.now() + amount
      const id = generateId()
      const label = `倒數計時：${countdownMatch[1]}${unit}`
      setCountdowns(prev => [...prev, { id, targetTime, label }])
      addMessage('tool', `⏱️ 已啟動 ${label}，計時中...`)
      return
    }

    // Process query
    const { response, tool, isCommand } = processCommand(text, faqs)

    if (!isCommand && response) {
      setIsTyping(false)
      addMessage('ai', response)
      return
    }

    // Tool commands
    if (tool === 'weather') {
      setIsTyping(false)
      const cityMatch = text.match(/天氣\s*(\S+)/)
      const city = cityMatch ? cityMatch[1] : 'Taipei'
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        const data = await res.json()
        if (data.error) {
          addMessage('tool', `🌤️ 查詢「${city}」天氣：\n\n⚠️ 無法取得天氣資料，請稍後再試。`)
        } else {
          addMessage('tool', `🌤️ 「${city}」天氣（wttr.in）\n\n${data.description}\n溫度：${data.temperature}\n${data.humidity ? '濕度：' + data.humidity + '%' : ''}\n${data.wind ? '風速：' + data.wind : ''}\n\n${data.forecast || ''}`)
        }
      } catch {
        addMessage('tool', '⚠️ 天氣服務暫時無法使用，請稍後再試。')
      }
      return
    }

    if (tool === 'currency') {
      setIsTyping(false)
      try {
        const res = await fetch('/api/currency')
        const data = await res.json()
        if (data.error) {
          addMessage('tool', `💱 匯率資料：\n\n⚠️ 無法取得匯率資料，請稍後再試。`)
        } else {
          addMessage('tool', `💱 **即時匯率**（exchangerate-api.com）\n\n💵 USD → TWD：${data.USDTWD}\n💶 EUR → TWD：${data.EURTWD}\n💴 JPY → TWD：${data.JPYTWD}\n\n🔄 1 TWD = ${(1/data.USDTWD).toFixed(4)} USD`)
        }
      } catch {
        addMessage('tool', '⚠️ 匯率服務暫時無法使用，請稍後再試。')
      }
      return
    }

    // Default response for unrecognized commands
    setIsTyping(false)
    addMessage('ai', response ?? `您好！我是 EliseAI，輸入您想詢問的問題，我會盡力為您解答！`)
  }

  const toggleTaskDone = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(updated)
    localStorage.setItem('eliseai_tasks', JSON.stringify(updated))
  }

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    localStorage.setItem('eliseai_tasks', JSON.stringify(updated))
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">EliseAI</h1>
              <p className="text-xs text-gray-400">營運對話</p>
            </div>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTasks(!showTasks)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${showTasks ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-500 hover:text-gray-700'}`}
          >
            📋 我的任務
          </button>
          <a href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            管理
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            首頁
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Tasks sidebar */}
        {showTasks && (
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm">📋 工作任務</h2>
              <span className="text-xs text-gray-400">{tasks.filter(t=>!t.done).length} 項待完成</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-400">
                  <p>尚無任務</p>
                  <p className="mt-1 text-xs">輸入「記錄任務：[內容]」新增</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {tasks.map(task => (
                    <li key={task.id} className="flex items-start gap-2 px-4 py-3 hover:bg-gray-50 transition-colors group">
                      <button
                        onClick={() => toggleTaskDone(task.id)}
                        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}
                      >
                        {task.done && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                      </button>
                      <span className={`flex-1 text-sm leading-snug ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.content}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs shrink-0 mt-0.5"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">開始與 EliseAI 對話</h2>
                <p className="text-gray-400 text-sm mb-6">輸入任何問題，我會為您即時解答</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                  {['請假怎麼請', '天氣 台北', '我的任務', '匯率'].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus() }}
                      className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1.5">
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="chat-bubble-user">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                )}
                {msg.role === 'ai' && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-ai">
                      <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
                    </div>
                  </div>
                )}
                {msg.role === 'tool' && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-tool">
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm">{msg.content}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Active countdowns */}
            {countdowns.filter(c => Date.now() < c.targetTime).map(cd => (
              <div key={cd.id} className="flex justify-start">
                <div className="chat-bubble-tool">
                  <CountdownDisplay targetTime={cd.targetTime} label={cd.label} />
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="chat-bubble-ai flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="輸入訊息...（Enter 發送）"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0"
              >
                發送
              </button>
            </form>
            <p className="text-xs text-gray-300 mt-2 text-center">EliseAI 會盡力協助，但請以官方公告為準</p>
          </div>
        </div>
      </div>
    </div>
  )
}
