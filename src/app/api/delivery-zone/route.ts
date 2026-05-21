import { NextRequest, NextResponse } from 'next/server'

const STORE_ADDRESS = 'Barsbütteler Hof 2c, 22885 Barsbüttel, Germany'

interface Zone {
  maxKm: number
  fee: number
  minOrder: number
}

const ZONES: Zone[] = [
  { maxKm: 4,  fee: 4,  minOrder: 20 },
  { maxKm: 8,  fee: 6,  minOrder: 25 },
  { maxKm: 12, fee: 8,  minOrder: 30 },
  { maxKm: 16, fee: 10, minOrder: 35 },
  { maxKm: 20, fee: 12, minOrder: 40 },
]

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address?.trim()) {
      return NextResponse.json({ error: 'Adresse darf nicht leer sein' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error('[delivery-zone] GOOGLE_MAPS_API_KEY is not set')
      return NextResponse.json({ error: 'Kartenservice nicht konfiguriert' }, { status: 500 })
    }

    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${encodeURIComponent(STORE_ADDRESS)}` +
      `&destinations=${encodeURIComponent(address)}` +
      `&mode=driving` +
      `&language=de` +
      `&key=${apiKey}`

    const gmRes = await fetch(url)
    const gmData = await gmRes.json()

    if (gmData.status !== 'OK') {
      console.error('[delivery-zone] Maps API status:', gmData.status, gmData.error_message)
      return NextResponse.json(
        { error: 'Adresse konnte nicht gefunden werden' },
        { status: 400 }
      )
    }

    const element = gmData.rows?.[0]?.elements?.[0]
    if (!element || element.status !== 'OK') {
      return NextResponse.json(
        { error: 'Adresse konnte nicht gefunden werden' },
        { status: 400 }
      )
    }

    const distanceMeters: number = element.distance.value
    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10

    const zone = ZONES.find((z) => distanceKm <= z.maxKm)

    if (!zone) {
      return NextResponse.json({ outOfRange: true, distanceKm })
    }

    return NextResponse.json({ distanceKm, fee: zone.fee, minOrder: zone.minOrder })
  } catch (error) {
    console.error('[delivery-zone] Error:', error)
    return NextResponse.json({ error: 'Fehler bei der Entfernungsberechnung' }, { status: 500 })
  }
}
