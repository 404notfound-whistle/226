import { getAll, add, remove } from '@/lib/kv'

export async function GET() {
  const list = await getAll('dinners')
  list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
  return Response.json(list)
}

export async function POST(request) {
  const data = await request.json()
  const item = await add('dinners', data)
  return Response.json(item)
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  await remove('dinners', id)
  return Response.json({ success: true })
}
