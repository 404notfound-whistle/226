import { kv } from '@vercel/kv'

// 通用 CRUD 操作（基于 Vercel KV，数据以 JSON 存储）

export async function getAll(key) {
  const data = await kv.get(key)
  return data || []
}

export async function add(key, item) {
  const list = await getAll(key)
  item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  item.createdAt = new Date().toISOString()
  list.push(item)
  await kv.set(key, list)
  return item
}

export async function update(key, id, updates) {
  const list = await getAll(key)
  const index = list.findIndex(item => item.id === id)
  if (index !== -1) {
    list[index] = { ...list[index], ...updates }
    await kv.set(key, list)
    return list[index]
  }
  return null
}

export async function remove(key, id) {
  const list = await getAll(key)
  const filtered = list.filter(item => item.id !== id)
  await kv.set(key, filtered)
  return { success: true }
}

export async function getOne(key) {
  const data = await kv.get(key)
  return data || { water: 10, elec: 50 }
}

export async function setOne(key, value) {
  await kv.set(key, value)
  return { success: true }
}
