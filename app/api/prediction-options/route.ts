import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'lib', 'data', 'prediction-options.json')

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to read prediction options data file', err)
    return []
  }
}

function writeData(data: any[]) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
    return true
  } catch (err) {
    console.error('Failed to write prediction options file', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const pair = url.searchParams.get('pair')
  const isActive = url.searchParams.get('isActive')

  const all = readData()
  let filtered = all
  if (pair) {
    filtered = filtered.filter((o: any) => !(o.pair) || o.pair?.toUpperCase() === pair.toUpperCase())
  }
  if (isActive !== null) {
    const val = isActive === 'true'
    filtered = filtered.filter((o: any) => o.isActive === val)
  }

  // Always sort by sortOrder then seconds
  filtered.sort((a: any, b: any) => a.sortOrder - b.sortOrder || a.seconds - b.seconds)

  return NextResponse.json(filtered)
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { seconds, returnRate, capitalMin, capitalMax, currency, pair, isActive = true, sortOrder = 0 } = body

    if (!seconds || typeof seconds !== 'number' || seconds <= 0) {
      return NextResponse.json({ error: 'Invalid seconds' }, { status: 400 })
    }
    if (!returnRate || typeof returnRate !== 'number' || returnRate <= 0) {
      return NextResponse.json({ error: 'Invalid returnRate' }, { status: 400 })
    }
    if (typeof capitalMin !== 'number' || typeof capitalMax !== 'number' || capitalMin < 0 || capitalMax < capitalMin) {
      return NextResponse.json({ error: 'Invalid capital range' }, { status: 400 })
    }

    const all = readData()
    const id = `${seconds}-${Date.now()}`
    const now = new Date().toISOString()
    const item = { id, seconds, returnRate, capitalMin, capitalMax, currency: currency || 'USDT', pair: pair || null, isActive, sortOrder, createdAt: now, updatedAt: now }
    all.push(item)
    writeData(all)

    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 })
  }
}
