'use client'

import { useState, useEffect } from 'react'

const ROOMMATES = [
  { name: '乌日力格', color: '#C23B22', initial: '乌' },
  { name: '刘子露', color: '#2D6A4F', initial: '刘' },
  { name: '阮华秋', color: '#3F3B6B', initial: '阮' },
  { name: '王思语', color: '#B8860B', initial: '王' }
]

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export default function Home() {
  const [page, setPage] = useState('home')
  const [greeting, setGreeting] = useState('')
  const [dateInfo, setDateInfo] = useState('')
  const [alerts, setAlerts] = useState([])
  const [homework, setHomework] = useState([])
  const [dinners, setDinners] = useState([])
  const [resources, setResources] = useState({ water: 10, elec: 50 })

  useEffect(() => {
    initHome()
    const interval = setInterval(updateAlerts, 60000)
    return () => clearInterval(interval)
  }, [])

  const initHome = async () => {
    const h = new Date().getHours()
    let greet = '夜深了，早点休息 🌙'
    if (h >= 6 && h < 9) greet = '早安，新的一天开始了 ☀️'
    else if (h >= 9 && h < 12) greet = '上午好，学习加油 💪'
    else if (h >= 12 && h < 14) greet = '中午好，记得吃饭 🍚'
    else if (h >= 14 && h < 17) greet = '下午好，继续努力 📖'
    else if (h >= 17 && h < 19) greet = '傍晚好，该吃晚饭了 🌆'
    else if (h >= 19 && h < 23) greet = '晚上好，注意休息 🌙'
    setGreeting(greet)

    const now = new Date()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    setDateInfo(`${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`)

    updateAlerts()
    fetchHomework()
    fetchDinners()
    fetchResources()
  }

  const updateAlerts = () => {
    const h = new Date().getHours()
    const m = new Date().getMinutes()
    let newAlerts = []

    if (h === 7 && m >= 50 || h === 8 && m < 10) {
      newAlerts.push({ type: 'food', icon: '🍚', text: '早餐时间到！记得吃早饭哦～', time: '8:00' })
    }
    if (h === 11 && m >= 50 || h === 12 && m < 10) {
      newAlerts.push({ type: 'food', icon: '🍜', text: '午饭时间！一起去食堂吧～', time: '12:00' })
    }
    if (h === 17 && m >= 50 || h === 18 && m < 10) {
      newAlerts.push({ type: 'food', icon: '🍲', text: '晚饭时间到了，别饿着～', time: '18:00' })
    }
    if (h === 21 && m >= 0 && m < 30) {
      newAlerts.push({ type: 'fire', icon: '🔥', text: '抖音续火花时间！别忘了互发消息哦～', time: '21:00' })
    }
    if (h === 23 && m >= 0 || h === 0 && m < 30) {
      newAlerts.push({ type: 'sleep', icon: '🌙', text: '该睡觉啦！熬夜伤身，早睡早起身体好～', time: '23:30' })
    }
    if (resources.elec < 10) {
      newAlerts.push({ type: 'bill', icon: '⚡', text: `电费余额不足！仅剩 ${resources.elec.toFixed(1)} 元，请及时充值～`, time: '紧急' })
    }
    if (resources.water <= 3) {
      newAlerts.push({ type: 'bill', icon: '💧', text: `水票快用完了！仅剩 ${resources.water} 张，记得购买～`, time: '提醒' })
    }

    setAlerts(newAlerts)
  }

  const fetchHomework = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/homework`)
      const data = await res.json()
      setHomework(data.filter(h => !h.done).slice(0, 3))
    } catch (e) {
      console.error('Failed to fetch homework:', e)
    }
  }

  const fetchDinners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dinners`)
      const data = await res.json()
      const upcoming = data.filter(d => new Date(d.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))
      setDinners(upcoming.slice(0, 1))
    } catch (e) {
      console.error('Failed to fetch dinners:', e)
    }
  }

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/resources`)
      const data = await res.json()
      setResources({ water: data.water || 10, elec: data.elec || 50 })
    } catch (e) {
      console.error('Failed to fetch resources:', e)
    }
  }

  const getDaysText = (deadline) => {
    const now = new Date()
    const dl = new Date(deadline)
    const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { text: '已过期', class: 'urgent' }
    if (diffDays === 0) return { text: '今天截止', class: 'urgent' }
    if (diffDays === 1) return { text: '明天截止', class: 'urgent' }
    if (diffDays <= 3) return { text: `${diffDays}天后`, class: 'soon' }
    return { text: `${diffDays}天后`, class: 'normal' }
  }

  const renderHome = () => (
    <>
      <div className="hero">
        <div className="room-num">226</div>
        <div className="room-label">DORMITORY · 蒲河校区</div>
        <div className="greeting">{greeting}</div>
        <div className="date-info">{dateInfo}</div>
      </div>

      <div id="alertBanners">
        {alerts.map((a, i) => (
          <div key={i} className={`alert-banner ${a.type}`}>
            <span className="alert-icon">{a.icon}</span>
            <span className="alert-text">{a.text}</span>
            <span className="alert-time">{a.time}</span>
          </div>
        ))}
      </div>

      <div className="section-title">室友空间</div>
      <div className="grid-4">
        {ROOMMATES.map(r => (
          <div key={r.name} className="roommate-card" onClick={() => setPage(`personal-${r.name}`)}>
            <div className="roommate-avatar" style={{ background: r.color }}>{r.initial}</div>
            <div className="name">{r.name}</div>
            <div className="role">点击查看日程</div>
          </div>
        ))}
      </div>

      <div className="section-title" style={{ marginTop: 24 }}>校园服务</div>
      <a className="quick-link" href="http://jwstudent.lnu.edu.cn/login" target="_top">
        <div className="ql-icon" style={{ background: 'var(--vermilion-soft)' }}>📚</div>
        <div className="ql-info">
          <div className="ql-title">教务系统</div>
          <div className="ql-desc">查成绩、选课、课表查询</div>
        </div>
        <div className="ql-arrow">→</div>
      </a>
      <a className="quick-link" href="http://222.26.125.253/libseat/#/login" target="_top">
        <div className="ql-icon" style={{ background: 'var(--jade-soft)' }}>📖</div>
        <div className="ql-info">
          <div className="ql-title">图书馆座位预约</div>
          <div className="ql-desc">自习室座位预约</div>
        </div>
        <div className="ql-arrow">→</div>
      </a>
      <a className="quick-link" href="http://lib.lnu.edu.cn/" target="_top">
        <div className="ql-icon" style={{ background: 'var(--indigo-soft)' }}>🏛️</div>
        <div className="ql-info">
          <div className="ql-title">图书馆官网</div>
          <div className="ql-desc">馆藏检索、数据库、研讨间预约</div>
        </div>
        <div className="ql-arrow">→</div>
      </a>
      <a className="quick-link" href="https://www.cnki.net/" target="_top">
        <div className="ql-icon" style={{ background: 'var(--gold-soft)' }}>🔬</div>
        <div className="ql-info">
          <div className="ql-title">中国知网</div>
          <div className="ql-desc">学术论文、期刊文献检索</div>
        </div>
        <div className="ql-arrow">→</div>
      </a>

      <div className="section-title" style={{ marginTop: 24 }}>近期作业</div>
      <div id="homeHomework">
        {homework.length === 0 ? (
          <div className="card"><div className="empty-state" style={{ padding: 24 }}><div className="empty-text">暂无待完成作业 🎉</div></div></div>
        ) : (
          homework.map(h => {
            const days = getDaysText(h.deadline)
            return (
              <div key={h._id} className="homework-item normal">
                <div className="homework-info">
                  <div className="hw-name">{h.content}</div>
                  <div className="hw-course">{h.course}</div>
                </div>
                <span className={`tag tag-${days.class}`}>{days.text}</span>
              </div>
            )
          })
        )}
      </div>

      <div className="section-title" style={{ marginTop: 24 }}>聚餐安排</div>
      <div id="homeDinner">
        {dinners.length === 0 ? (
          <div className="card"><div className="empty-state" style={{ padding: 24 }}><div className="empty-text">暂无聚餐安排，去工具箱创建一个吧～</div></div></div>
        ) : (
          dinners.map(d => {
            const diffDays = Math.ceil((new Date(d.date) - new Date()) / (1000 * 60 * 60 * 24))
            return (
              <div key={d._id} className="dinner-party-card">
                <div className="dp-icon">🎉</div>
                <div className="dp-info">
                  <div className="dp-title">{d.title}</div>
                  <div className="dp-detail">{new Date(d.date).getMonth()+1}月{new Date(d.date).getDate()}日 {d.place ? '· ' + d.place : ''}</div>
                </div>
                <div className="dp-countdown">{diffDays === 0 ? '今天！' : diffDays + '天后'}</div>
              </div>
            )
          })
        )}
      </div>
    </>
  )

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <a className="nav-brand" href="#" onClick={() => setPage('home')}>
            <div className="seal">226</div>
            <div>
              <h1>贰贰陆</h1>
              <div className="sub">辽宁大学蒲河校区</div>
            </div>
          </a>
          <div className="nav-tabs">
            <button className={`nav-tab ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>首页</button>
            <button className={`nav-tab ${page === 'schedule' ? 'active' : ''}`} onClick={() => setPage('schedule')}>日程</button>
            <button className={`nav-tab ${page === 'homework' ? 'active' : ''}`} onClick={() => setPage('homework')}>作业</button>
            <button className={`nav-tab ${page === 'messages' ? 'active' : ''}`} onClick={() => setPage('messages')}>留言板</button>
            <button className={`nav-tab ${page === 'food' ? 'active' : ''}`} onClick={() => setPage('food')}>外卖</button>
            <button className={`nav-tab ${page === 'pomodoro' ? 'active' : ''}`} onClick={() => setPage('pomodoro')}>番茄钟</button>
            <button className={`nav-tab ${page === 'tools' ? 'active' : ''}`} onClick={() => setPage('tools')}>工具箱</button>
          </div>
        </div>
      </nav>

      <div className="main">
        {page === 'home' && renderHome()}
        {page === 'schedule' && <SchedulePage />}
        {page === 'homework' && <HomeworkPage />}
        {page === 'messages' && <MessagesPage />}
        {page === 'food' && <FoodPage />}
        {page === 'pomodoro' && <PomodoroPage />}
        {page === 'tools' && <ToolsPage />}
        {page.startsWith('personal-') && <PersonalPage name={page.replace('personal-', '')} />}
      </div>

      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          <button className={`mobile-nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
            <span className="nav-icon">🏠</span><span>首页</span>
          </button>
          <button className={`mobile-nav-item ${page === 'schedule' ? 'active' : ''}`} onClick={() => setPage('schedule')}>
            <span className="nav-icon">📅</span><span>日程</span>
          </button>
          <button className={`mobile-nav-item ${page === 'homework' ? 'active' : ''}`} onClick={() => setPage('homework')}>
            <span className="nav-icon">📋</span><span>作业</span>
          </button>
          <button className={`mobile-nav-item ${page === 'messages' ? 'active' : ''}`} onClick={() => setPage('messages')}>
            <span className="nav-icon">💬</span><span>留言</span>
          </button>
          <button className={`mobile-nav-item ${page === 'food' ? 'active' : ''}`} onClick={() => setPage('food')}>
            <span className="nav-icon">🍜</span><span>外卖</span>
          </button>
          <button className={`mobile-nav-item ${page === 'pomodoro' ? 'active' : ''}`} onClick={() => setPage('pomodoro')}>
            <span className="nav-icon">🍅</span><span>番茄钟</span>
          </button>
          <button className={`mobile-nav-item ${page === 'tools' ? 'active' : ''}`} onClick={() => setPage('tools')}>
            <span className="nav-icon">🧰</span><span>工具</span>
          </button>
        </div>
      </div>
    </>
  )
}

// Schedule Page Component
function SchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [dateOffset, setDateOffset] = useState(0)
  const [form, setForm] = useState({ time: '', person: 'all', title: '', desc: '' })

  const getDateStr = (offset = 0) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }

  const fetchSchedules = async () => {
    const date = getDateStr(dateOffset)
    try {
      const res = await fetch(`${API_BASE}/api/schedule?date=${date}&person=all`)
      const data = await res.json()
      setSchedules(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchSchedules() }, [dateOffset])

  const addSchedule = async () => {
    if (!form.time || !form.title) return
    const date = getDateStr(dateOffset)
    await fetch(`${API_BASE}/api/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, date })
    })
    setForm({ time: '', person: 'all', title: '', desc: '' })
    fetchSchedules()
  }

  const deleteSchedule = async (id) => {
    await fetch(`${API_BASE}/api/schedule?id=${id}`, { method: 'DELETE' })
    fetchSchedules()
  }

  const dateStr = getDateStr(dateOffset)
  const d = new Date(dateStr)
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const label = dateOffset === 0 ? '今天' : dateOffset === -1 ? '昨天' : dateOffset === 1 ? '明天' : `${d.getMonth()+1}月${d.getDate()}日`

  return (
    <>
      <div className="schedule-header">
        <h2>📅 今日日程</h2>
        <div className="schedule-nav">
          <button onClick={() => setDateOffset(dateOffset - 1)}>‹</button>
          <button onClick={() => setDateOffset(0)}>今天</button>
          <button onClick={() => setDateOffset(dateOffset + 1)}>›</button>
        </div>
      </div>
      <div className="schedule-date">{label} · {d.getFullYear()}年{d.getMonth()+1}月{d.getDate()}日 星期{weekDays[d.getDay()]}</div>

      <div className="card">
        <div className="card-title"><span className="icon" style={{ background: 'var(--vermilion-soft)' }}>📝</span>添加日程</div>
        <div className="grid-2">
          <div className="form-group">
            <label>时间</label>
            <input type="time" className="form-input" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <div className="form-group">
            <label>室友</label>
            <select className="form-select" value={form.person} onChange={e => setForm({...form, person: e.target.value})}>
              <option value="all">全体</option>
              {ROOMMATES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>事项</label>
          <input type="text" className="form-input" placeholder="例如：高等数学作业" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>备注（可选）</label>
          <input type="text" className="form-input" placeholder="补充说明..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={addSchedule}>添加日程</button>
      </div>

      {schedules.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-text">暂无公共日程</div></div>
      ) : (
        <div className="schedule-timeline">
          {schedules.map(item => (
            <div key={item._id} className="schedule-item">
              <div className="time">{item.time} · {item.person === 'all' ? '全体' : item.person}</div>
              <div className="title">{item.title}</div>
              {item.desc && <div className="desc">{item.desc}</div>}
              <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }} onClick={() => deleteSchedule(item._id)}>删除</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// Homework Page Component
function HomeworkPage() {
  const [homework, setHomework] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ course: '', deadline: '', content: '' })

  const fetchHomework = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/homework`)
      const data = await res.json()
      setHomework(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchHomework() }, [])

  const addHomework = async () => {
    if (!form.course || !form.deadline || !form.content) return
    await fetch(`${API_BASE}/api/homework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ course: '', deadline: '', content: '' })
    setShowForm(false)
    fetchHomework()
  }

  const toggleHomework = async (id, done) => {
    await fetch(`${API_BASE}/api/homework`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done: !done })
    })
    fetchHomework()
  }

  const deleteHomework = async (id) => {
    await fetch(`${API_BASE}/api/homework?id=${id}`, { method: 'DELETE' })
    fetchHomework()
  }

  return (
    <>
      <div className="schedule-header">
        <h2>📋 作业管理</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ 添加作业</button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-title"><span className="icon" style={{ background: 'var(--gold-soft)' }}>✏️</span>新建作业</div>
          <div className="grid-2">
            <div className="form-group">
              <label>课程名称</label>
              <input type="text" className="form-input" placeholder="例如：高等数学" value={form.course} onChange={e => setForm({...form, course: e.target.value})} />
            </div>
            <div className="form-group">
              <label>截止日期</label>
              <input type="datetime-local" className="form-input" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>作业内容</label>
            <input type="text" className="form-input" placeholder="例如：第三章课后习题" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={addHomework}>保存</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}

      {homework.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-text">暂无作业，点击上方添加</div></div>
      ) : (
        homework.map(item => {
          const now = new Date()
          const dl = new Date(item.deadline)
          const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24))
          let urgency = 'normal'
          let daysText = `${diffDays}天`
          let daysClass = 'normal-text'
          if (diffDays < 0) { urgency = 'urgent'; daysText = '已过期'; daysClass = 'urgent-text' }
          else if (diffDays <= 1) { urgency = 'urgent'; daysText = diffDays === 0 ? '今天' : '明天'; daysClass = 'urgent-text' }
          else if (diffDays <= 3) { urgency = 'soon'; daysClass = 'soon-text' }

          return (
            <div key={item._id} className={`homework-item ${urgency}`}>
              <div className={`homework-check ${item.done ? 'done' : ''}`} onClick={() => toggleHomework(item._id, item.done)}>{item.done ? '✓' : ''}</div>
              <div className="homework-info">
                <div className={`hw-name ${item.done ? 'done-text' : ''}`}>{item.content}</div>
                <div className="hw-course">{item.course}</div>
              </div>
              <div className="homework-deadline">
                <div className={`days ${daysClass}`}>{daysText}</div>
                <div>{dl.getMonth()+1}/{dl.getDate()}</div>
              </div>
              <button className="btn btn-sm btn-secondary" style={{ marginLeft: 8 }} onClick={() => deleteHomework(item._id)}>✕</button>
            </div>
          )
        })
      )}
    </>
  )
}

// Messages Page Component
function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState({ author: ROOMMATES[0].name, content: '' })

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`)
      const data = await res.json()
      setMessages(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const addMessage = async () => {
    if (!form.content.trim()) return
    await fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ ...form, content: '' })
    fetchMessages()
  }

  const deleteMessage = async (id) => {
    await fetch(`${API_BASE}/api/messages?id=${id}`, { method: 'DELETE' })
    fetchMessages()
  }

  return (
    <>
      <div className="schedule-header"><h2>💬 留言板</h2></div>

      <div className="card">
        <div className="form-group">
          <label>你是谁？</label>
          <select className="form-select" value={form.author} onChange={e => setForm({...form, author: e.target.value})}>
            {ROOMMATES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>留言内容</label>
          <textarea className="form-textarea" placeholder="说点什么..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={addMessage}>发表留言</button>
      </div>

      <div className="message-list">
        {messages.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">💬</div><div className="empty-text">还没有留言，来说点什么吧～</div></div>
        ) : (
          messages.map(item => {
            const r = ROOMMATES.find(r => r.name === item.author)
            const d = new Date(item.createdAt)
            const timeStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
            return (
              <div key={item._id} className="message-item">
                <div className="message-header">
                  <div className="message-avatar" style={{ background: r ? r.color : '#999' }}>{r ? r.initial : '?'}</div>
                  <div className="message-meta">
                    <div className="msg-name">{item.author}</div>
                    <div className="msg-time">{timeStr}</div>
                  </div>
                  <button className="btn btn-sm btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => deleteMessage(item._id)}>✕</button>
                </div>
                <div className="message-content">{item.content}</div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

// Food Page Component
function FoodPage() {
  const [foods, setFoods] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author: ROOMMATES[0].name, name: '', desc: '' })

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/food`)
      const data = await res.json()
      setFoods(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchFoods() }, [])

  const addFood = async () => {
    if (!form.name) return
    await fetch(`${API_BASE}/api/food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ author: ROOMMATES[0].name, name: '', desc: '' })
    setShowForm(false)
    fetchFoods()
  }

  const deleteFood = async (id) => {
    await fetch(`${API_BASE}/api/food?id=${id}`, { method: 'DELETE' })
    fetchFoods()
  }

  const emojis = ['🍗', '🍔', '🍕', '🍜', '🍱', '🥘', '🍲', '🥟', '🍛', '🥡', '🍣', '🧋']

  return (
    <>
      <div className="schedule-header">
        <h2>🍜 外卖推荐</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ 推荐外卖</button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-title"><span className="icon" style={{ background: 'var(--gold-soft)' }}>🍽️</span>推荐一道美食</div>
          <div className="grid-2">
            <div className="form-group">
              <label>推荐人</label>
              <select className="form-select" value={form.author} onChange={e => setForm({...form, author: e.target.value})}>
                {ROOMMATES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>店铺/菜品名</label>
              <input type="text" className="form-input" placeholder="例如：黄焖鸡米饭" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>推荐理由</label>
            <input type="text" className="form-input" placeholder="为什么好吃？" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
          </div>
          <div className="btn-group">
            <button className="btn btn-gold" onClick={addFood}>推荐</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </div>
      )}

      {foods.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🍜</div><div className="empty-text">还没有推荐，快推荐一家好吃的吧～</div></div>
      ) : (
        foods.map((item, i) => (
          <div key={item._id} className="food-item">
            <div className="food-emoji">{emojis[i % emojis.length]}</div>
            <div className="food-info">
              <div className="food-name">{item.name}</div>
              {item.desc && <div className="food-desc">{item.desc}</div>}
              <div className="food-recommender">{item.author} 推荐</div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => deleteFood(item._id)}>✕</button>
          </div>
        ))
      )}
    </>
  )
}

// Pomodoro Page Component
function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [totalTime, setTotalTime] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [stats, setStats] = useState({ count: 0, minutes: 0, streak: 0 })
  const [label, setLabel] = useState('专注时间')

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    let interval
    if (running) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false)
            completePomodoro()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [running])

  const fetchStats = async () => {
    // 从localStorage获取，或者可以扩展到后端存储
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem('pomo_' + today)
    if (saved) {
      const data = JSON.parse(saved)
      setStats(data)
    }
  }

  const completePomodoro = () => {
    if (totalTime > 15 * 60) {
      const today = new Date().toISOString().split('T')[0]
      const saved = localStorage.getItem('pomo_' + today)
      const data = saved ? JSON.parse(saved) : { count: 0, minutes: 0 }
      data.count++
      data.minutes += Math.round(totalTime / 60)
      localStorage.setItem('pomo_' + today, JSON.stringify(data))
      setStats(data)
      alert(`🎉 完成一个${totalTime/60}分钟番茄！`)
    } else {
      alert('休息结束，继续加油！💪')
    }
  }

  const setMode = (min) => {
    if (running) return
    setTotalTime(min * 60)
    setTimeLeft(min * 60)
    setLabel(min <= 15 ? '休息时间' : '专注时间')
  }

  const toggle = () => setRunning(!running)
  const reset = () => {
    setRunning(false)
    setTimeLeft(totalTime)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <>
      <div className="schedule-header"><h2>🍅 番茄钟</h2></div>
      <div className="card">
        <div className="pomodoro-display">
          <div className={`pomodoro-circle ${running ? 'running' : ''}`}>
            <div className="time-display">{formatTime(timeLeft)}</div>
            <div className="time-label">{label}</div>
          </div>
          <div className="pomodoro-controls">
            <button className="btn btn-primary" onClick={toggle}>{running ? '暂停' : '开始专注'}</button>
            <button className="btn btn-secondary" onClick={reset}>重置</button>
          </div>
          <div className="btn-group" style={{ justifyContent: 'center', marginTop: 16 }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setMode(25)}>25分钟</button>
            <button className="btn btn-sm btn-secondary" onClick={() => setMode(45)}>45分钟</button>
            <button className="btn btn-sm btn-secondary" onClick={() => setMode(5)}>休息5分钟</button>
            <button className="btn btn-sm btn-secondary" onClick={() => setMode(15)}>休息15分钟</button>
          </div>
          <div className="pomodoro-stats">
            <div className="pomo-stat">
              <div className="stat-val">{stats.count}</div>
              <div className="stat-label">今日完成</div>
            </div>
            <div className="pomo-stat">
              <div className="stat-val">{stats.minutes}</div>
              <div className="stat-label">专注分钟</div>
            </div>
            <div className="pomo-stat">
              <div className="stat-val">{stats.streak}</div>
              <div className="stat-label">连续天数</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Tools Page Component
function ToolsPage() {
  const [resources, setResources] = useState({ water: 10, elec: 50 })
  const [dinners, setDinners] = useState([])
  const [showDinnerForm, setShowDinnerForm] = useState(false)
  const [dinnerForm, setDinnerForm] = useState({ title: '', date: '', place: '', note: '' })

  useEffect(() => {
    fetchResources()
    fetchDinners()
  }, [])

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/resources`)
      const data = await res.json()
      setResources({ water: data.water || 10, elec: data.elec || 50 })
    } catch (e) {
      console.error(e)
    }
  }

  const updateResources = async (updates) => {
    await fetch(`${API_BASE}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...resources, ...updates })
    })
    fetchResources()
  }

  const fetchDinners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dinners`)
      const data = await res.json()
      setDinners(data.filter(d => new Date(d.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)))
    } catch (e) {
      console.error(e)
    }
  }

  const addDinner = async () => {
    if (!dinnerForm.title || !dinnerForm.date) return
    await fetch(`${API_BASE}/api/dinners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dinnerForm)
    })
    setDinnerForm({ title: '', date: '', place: '', note: '' })
    setShowDinnerForm(false)
    fetchDinners()
  }

  const deleteDinner = async (id) => {
    await fetch(`${API_BASE}/api/dinners?id=${id}`, { method: 'DELETE' })
    fetchDinners()
  }

  return (
    <>
      <div className="schedule-header"><h2>🧰 工具箱</h2></div>

      <div className="grid-2">
        <div className="card resource-card">
          <div style={{ fontSize: 32 }}>💧</div>
          <div className="resource-value water">{resources.water}</div>
          <div className="resource-label">水票剩余（张）</div>
          <div className="resource-bar"><div className="fill water" style={{ width: Math.min(resources.water / 20 * 100, 100) + '%' }} /></div>
          <div className="resource-actions">
            <button className="btn btn-sm btn-indigo" onClick={() => updateResources({ water: resources.water + 1 })}>+1</button>
            <button className="btn btn-sm btn-secondary" onClick={() => updateResources({ water: Math.max(0, resources.water - 1) })}>-1</button>
          </div>
        </div>

        <div className="card resource-card">
          <div style={{ fontSize: 32 }}>⚡</div>
          <div className="resource-value elec">{resources.elec.toFixed(1)}</div>
          <div className="resource-label">电费余额（元）</div>
          <div className="resource-bar"><div className="fill elec" style={{ width: Math.min(resources.elec / 100 * 100, 100) + '%' }} /></div>
          <div className="resource-actions">
            <button className="btn btn-sm btn-gold" onClick={() => {
              const val = prompt('设置电费余额：', resources.elec)
              if (val) updateResources({ elec: parseFloat(val) })
            }}>设置余额</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title">
          <span className="icon" style={{ background: 'var(--vermilion-soft)' }}>🎉</span>
          聚餐安排
          <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowDinnerForm(true)}>+ 新建</button>
        </div>

        {showDinnerForm && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label>聚餐主题</label>
              <input type="text" className="form-input" placeholder="例如：期末庆祝" value={dinnerForm.title} onChange={e => setDinnerForm({...dinnerForm, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label>聚餐日期</label>
              <input type="datetime-local" className="form-input" value={dinnerForm.date} onChange={e => setDinnerForm({...dinnerForm, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label>地点</label>
              <input type="text" className="form-input" placeholder="例如：学校北门烧烤" value={dinnerForm.place} onChange={e => setDinnerForm({...dinnerForm, place: e.target.value})} />
            </div>
            <div className="form-group">
              <label>备注</label>
              <input type="text" className="form-input" placeholder="AA制/有人请客等" value={dinnerForm.note} onChange={e => setDinnerForm({...dinnerForm, note: e.target.value})} />
            </div>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={addDinner}>创建</button>
              <button className="btn btn-secondary" onClick={() => setShowDinnerForm(false)}>取消</button>
            </div>
          </div>
        )}

        {dinners.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}><div className="empty-text">暂无聚餐安排</div></div>
        ) : (
          dinners.map(d => {
            const diffDays = Math.ceil((new Date(d.date) - new Date()) / (1000 * 60 * 60 * 24))
            return (
              <div key={d._id} className="dinner-party-card">
                <div className="dp-icon">🎉</div>
                <div className="dp-info">
                  <div className="dp-title">{d.title}</div>
                  <div className="dp-detail">{new Date(d.date).getMonth()+1}月{new Date(d.date).getDate()}日 {d.place ? '· ' + d.place : ''} {d.note ? '· ' + d.note : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="dp-countdown">{diffDays === 0 ? '今天！' : diffDays + '天后'}</div>
                  <button className="btn btn-sm btn-secondary" style={{ marginTop: 4 }} onClick={() => deleteDinner(d._id)}>✕</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="card">
        <div className="card-title"><span className="icon" style={{ background: 'var(--jade-soft)' }}>🔗</span>校园快捷入口</div>
        <a className="quick-link" href="http://jwstudent.lnu.edu.cn/login" target="_top">
          <div className="ql-icon" style={{ background: 'var(--vermilion-soft)' }}>📊</div>
          <div className="ql-info"><div className="ql-title">教务系统</div><div className="ql-desc">查成绩、选课、课表</div></div>
          <div className="ql-arrow">↗</div>
        </a>
        <a className="quick-link" href="http://222.26.125.253/libseat/#/login" target="_top">
          <div className="ql-icon" style={{ background: 'var(--jade-soft)' }}>📖</div>
          <div className="ql-info"><div className="ql-title">图书馆座位预约</div><div className="ql-desc">自习室座位预约</div></div>
          <div className="ql-arrow">↗</div>
        </a>
        <a className="quick-link" href="http://lib.lnu.edu.cn/" target="_top">
          <div className="ql-icon" style={{ background: 'var(--indigo-soft)' }}>🏛️</div>
          <div className="ql-info"><div className="ql-title">图书馆官网</div><div className="ql-desc">馆藏检索、数据库</div></div>
          <div className="ql-arrow">↗</div>
        </a>
        <a className="quick-link" href="https://www.cnki.net/" target="_top">
          <div className="ql-icon" style={{ background: 'var(--gold-soft)' }}>🔬</div>
          <div className="ql-info"><div className="ql-title">中国知网</div><div className="ql-desc">学术论文、期刊文献检索</div></div>
          <div className="ql-arrow">↗</div>
        </a>
        <a className="quick-link" href="https://jwc.lnu.edu.cn/index.htm" target="_top">
          <div className="ql-icon" style={{ background: 'var(--vermilion-soft)' }}>🎓</div>
          <div className="ql-info"><div className="ql-title">教务处官网</div><div className="ql-desc">通知公告、教学管理</div></div>
          <div className="ql-arrow">↗</div>
        </a>
      </div>
    </>
  )
}

// Personal Page Component
function PersonalPage({ name }) {
  const [schedules, setSchedules] = useState([])
  const [form, setForm] = useState({ time: '', type: 'study', title: '', desc: '' })
  const r = ROOMMATES.find(r => r.name === name)

  const getDateStr = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }

  const fetchSchedules = async () => {
    const date = getDateStr()
    try {
      const res = await fetch(`${API_BASE}/api/schedule?date=${date}&person=${name}`)
      const data = await res.json()
      setSchedules(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchSchedules() }, [name])

  const addSchedule = async () => {
    if (!form.time || !form.title) return
    const date = getDateStr()
    await fetch(`${API_BASE}/api/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, date, person: name })
    })
    setForm({ time: '', type: 'study', title: '', desc: '' })
    fetchSchedules()
  }

  const deleteSchedule = async (id) => {
    await fetch(`${API_BASE}/api/schedule?id=${id}`, { method: 'DELETE' })
    fetchSchedules()
  }

  const typeIcons = { study: '📚', activity: '🎯', life: '🏠', other: '📌' }

  return (
    <>
      <div className="personal-header">
        <div className="personal-avatar-lg" style={{ background: r.color }}>{r.initial}</div>
        <div className="personal-info">
          <h2>{r.name} 的日程</h2>
          <p>点击下方添加今日安排</p>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="icon" style={{ background: 'var(--vermilion-soft)' }}>📝</span>添加个人日程</div>
        <div className="grid-2">
          <div className="form-group">
            <label>时间</label>
            <input type="time" className="form-input" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <div className="form-group">
            <label>类型</label>
            <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="study">📚 学习</option>
              <option value="activity">🎯 活动</option>
              <option value="life">🏠 生活</option>
              <option value="other">📌 其他</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>事项</label>
          <input type="text" className="form-input" placeholder="今天要做什么？" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>备注（可选）</label>
          <input type="text" className="form-input" placeholder="补充说明..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={addSchedule}>添加</button>
      </div>

      {schedules.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-text">今天还没有安排，添加一个吧～</div></div>
      ) : (
        <div className="schedule-timeline">
          {schedules.map(item => (
            <div key={item._id} className="schedule-item">
              <div className="time">{typeIcons[item.type] || '📌'} {item.time}</div>
              <div className="title">{item.title}</div>
              {item.desc && <div className="desc">{item.desc}</div>}
              <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }} onClick={() => deleteSchedule(item._id)}>删除</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
