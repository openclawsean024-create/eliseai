import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Using exchangerate-api.com free tier
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Currency service unavailable' }, { status: 200 })
    }

    const data = await res.json()
    const rates = data.rates

    const USDTWD = rates.TWD ? rates.TWD.toFixed(2) : 'N/A'
    const EURTWD = rates.TWD && rates.EUR ? (rates.TWD / rates.EUR * rates.TWD / rates.TWD).toFixed(2) : 'N/A'
    // Simpler calculation
    const eurToUsd = rates.EUR || 1
    const jpyToUsd = rates.JPY || 1
    const twdRate = rates.TWD || 1
    const EURTWD_val = (twdRate / eurToUsd).toFixed(2)
    const JPYTWD_val = (twdRate / jpyToUsd).toFixed(4)

    return NextResponse.json({
      USDTWD,
      EURTWD: EURTWD_val,
      JPYTWD: JPYTWD_val,
      base: 'USD',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch currency' }, { status: 200 })
  }
}
