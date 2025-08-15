import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, setUser } from '../store/authSlice'
import api from '../lib/api'
import Container from '../components/Container'

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) dispatch(fetchMe())
  }, [user, dispatch])

  useEffect(() => {
    setName(user?.name || '')
  }, [user])

  const onSave = async () => {
    setSaving(true)
    try {
      const { data } = await api.put('/users/me', { name })
      setMessage('已保存')
      dispatch(setUser({ ...(user || {}), ...data }))
    } catch (e) {
      setMessage(e.response?.data?.message || e.message)
    } finally { setSaving(false) }
  }

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold">用户面板</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold">基本信息</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">昵称</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={onSave} disabled={saving}>
              {saving ? '保存中…' : '保存'}
            </button>
            {message && <p className="text-sm text-gray-600">{message}</p>}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold">快速入口</h2>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-700">
            <li>在此扩展你的个人信息、通知、草稿管理等模块。</li>
            <li>把此页面作为受保护区（需要登录）。</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}