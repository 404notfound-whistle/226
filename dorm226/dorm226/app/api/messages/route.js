import { getAll, add, remove } from '@/lib/kv'

export async function GET() {
  const list = await getAll('messages')
  list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  return Response.json(list)
}

export async function POST(request) {
  const data = await request.json()
  const item = await add('messages', data)
  return Response.json(item)
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  await remove('messages', id)
  return Response.json({ success: true })
}
