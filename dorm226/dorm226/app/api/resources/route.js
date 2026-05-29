import { getOne, setOne } from '@/lib/kv'

export async function GET() {
  const data = await getOne('resources')
  return Response.json(data)
}

export async function POST(request) {
  const data = await request.json()
  await setOne('resources', data)
  return Response.json({ success: true })
}
