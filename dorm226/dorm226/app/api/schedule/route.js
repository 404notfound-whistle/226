import { getAll, add, remove } from '@/lib/kv'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const person = searchParams.get('person') || 'all'
  
  const key = `schedule_${person}_${date}`
  const list = await getAll(key)
  list.sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  return Response.json(list)
}

export async function POST(request) {
  const data = await request.json()
  const key = `schedule_${data.person || 'all'}_${data.date}`
  const item = await add(key, data)
  return Response.json(item)
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const date = searchParams.get('date')
  const person = searchParams.get('person') || 'all'
  
  const key = `schedule_${person}_${date}`
  await remove(key, id)
  return Response.json({ success: true })
}
