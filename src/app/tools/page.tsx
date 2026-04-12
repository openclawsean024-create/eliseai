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

export default function ToolsPage() {
  const [weatherCity, setWeatherCity] = useState('Taipei')
  const [weatherData, setWeatherData] = useState<any>(null)
  const [weatherError, setWeatherError] = useState(false)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [currencyData, setCurrencyData] = useState<any>(null)
  const [currencyError, setCurrencyError] = useState(false)
  const [currencyLoading, setCurrencyLoading] = useState(false)

  const fetchWeather = async () => {
    setWeatherLoading(true)
    setWeatherError(false)
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(weatherCity)}`)
      const data = await res.json()
      if (data.error) setWeatherError(true)
      else setWeatherData(data)
    } catch { setWeatherError(true) }
    setWeatherLoading(false)
  }

  const fetchCurrency = async () => {
    setCurrencyLoading(true)
    setCurrencyError(false)
    try {
      const res = await fetch('/api/currency')
      const data = await res.json()
      if (data.error) setCurrencyError(true)
      else setCurrencyData(data)
    } catch { setCurrencyError(true) }
    setCurrencyLoading(false)
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
              <p className="text-xs text-gray-400">快速工具</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/chat" className="text-sm text-gray-400 hover:text-blue-600">對話</Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-blue-600">首頁</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">⚡ 快速工具</h2>
        <p className="text-gray-500 text-sm mb-8">在對話中輸入關鍵字即可快速使用，或直接在此頁面操作</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="text-xl">🌤️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">天氣查詢</h3>
                <p className="text-xs text-gray-400">wttr.in</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={weatherCity}
                onChange={e => setWeatherCity(e.target.value)}
                placeholder="輸入城市名稱"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyDown={e => e.key === 'Enter' && fetchWeather()}
              />
              <button
                onClick={fetchWeather}
                disabled={weatherLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-xl transition-colors"
              >
                {weatherLoading ? '查詢中...' : '查詢'}
              </button>
            </div>
            {weatherData && !weatherError && (
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">{weatherData.description}</p>
                <p>溫度：{weatherData.temperature}</p>
                {weatherData.humidity && <p>濕度：{weatherData.humidity}%</p>}
                {weatherData.wind && <p>風速：{weatherData.wind}</p>}
                {weatherData.forecast && <p className="mt-2 text-gray-500">{weatherData.forecast}</p>}
              </div>
            )}
            {weatherError && <p className="text-red-500 text-sm">無法取得天氣資料</p>}
            <p className="text-xs text-gray-300 mt-3">對話關鍵字：天氣台北 / 天氣 城市名</p>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <span className="text-xl">💱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">匯率查詢</h3>
                <p className="text-xs text-gray-400">exchangerate-api.com</p>
              </div>
            </div>
            <button
              onClick={fetchCurrency}
              disabled={currencyLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-sm px-4 py-2.5 rounded-xl transition-colors mb-4"
            >
              {currencyLoading ? '查詢中...' : '取得最新匯率'}
            </button>
            {currencyData && !currencyError && (
              <div className="text-sm text-gray-700 space-y-1.5">
                <div className="flex justify-between"><span>💵 USD → TWD</span><span className="font-medium">{currencyData.USDTWD}</span></div>
                <div className="flex justify-between"><span>💶 EUR → TWD</span><span className="font-medium">{currencyData.EURTWD}</span></div>
                <div className="flex justify-between"><span>💴 JPY → TWD</span><span className="font-medium">{currencyData.JPYTWD}</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between"><span>🔄 1 TWD → USD</span><span className="font-medium">{(1/currencyData.USDTWD).toFixed(4)}</span></div>
              </div>
            )}
            {currencyError && <p className="text-red-500 text-sm">無法取得匯率資料</p>}
            <p className="text-xs text-gray-300 mt-3">對話關鍵字：匯率 / 100美金是多少台幣</p>
          </div>

          {/* Countdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">倒數計時</h3>
                <p className="text-xs text-gray-400">快速計時工具</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>在對話中輸入以下指令即可使用計時器：</p>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 font-mono text-xs">
                <p>「倒數 10 分鐘」</p>
                <p>「倒數 30 秒」</p>
                <p>「倒數 2 小時」</p>
              </div>
            </div>
          </div>

          {/* Task */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">工作任務</h3>
                <p className="text-xs text-gray-400">localStorage 記錄</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>在對話中輸入以下指令來管理任務：</p>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 font-mono text-xs">
                <p>「記錄任務：完成報告」</p>
                <p>「我的任務」</p>
              </div>
              <Link href="/chat" className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-xs">
                → 前往對話頁面使用 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
