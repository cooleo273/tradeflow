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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const all = readData()
  const item = all.find((o: any) => o.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const body = await req.json()
    const all = readData()
    const index = all.findIndex((o: any) => o.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const existing = all[index]
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() }
    all[index] = updated
    writeData(all)

    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const body = await req.json()
    const all = readData()
    const index = all.findIndex((o: any) => o.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const existing = all[index]
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() }
    all[index] = updated
    writeData(all)

    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const all = readData()
    const index = all.findIndex((o: any) => o.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    all.splice(index, 1)
    writeData(all)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
