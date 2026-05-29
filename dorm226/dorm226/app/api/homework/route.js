import { getAll, add, update, remove } from '@/lib/kv'

export async function GET() {
  const list = await getAll('homework')
  list.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0))
  return Response.json(list)
}

export async function POST(request) {
  const data = await request.json()
  const item = await add('homework', { ...data, done: false })
  return Response.json(item)
}

export async function PUT(request) {
  const data = await request.json()
  await update('homework', data.id, { done: data.done })
  return Response.json({ success: true })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  await remove('homework', id)
  return Response.json({ success: true })
}
