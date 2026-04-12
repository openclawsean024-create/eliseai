import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || 'Taipei'

  try {
    // Use wttr.in - free, no API key required
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Weather service unavailable' }, { status: 200 })
    }

    const data = await res.json()
    const current = data.current_condition?.[0]

    if (!current) {
      return NextResponse.json({ error: 'No data' }, { status: 200 })
    }

    const tempC = current.temp_C || 'N/A'
    const humidity = current.humidity || 'N/A'
    const wind = current.windspeedKmph || 'N/A'
    const weatherDesc = current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || '未知'
    const feelsLike = current.FeelsLikeC || 'N/A'

    // Try to get a simple forecast
    const forecast = data.weather?.[0]
      ? `📅 今天：${data.weather[0].mintempC}°C ~ ${data.weather[0].maxtempC}°C`
      : ''

    return NextResponse.json({
      description: `${weatherDesc}，體感溫度 ${feelsLike}°C`,
      temperature: `${tempC}°C`,
      humidity: humidity,
      wind: `${wind} km/h`,
      forecast,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 200 })
  }
}
