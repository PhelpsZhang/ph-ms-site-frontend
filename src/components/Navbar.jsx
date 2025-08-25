import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)
  const user = useSelector((s) => s.auth.user)
  const [query, setQuery] = useState("")

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`

  // 防抖的跳转函数：防止用户短时间内多次点击提交造成重复跳转
  // 采用 leading: true, trailing: false => 第一次立刻执行，之后的快速连点会被忽略
  const debouncedNavigateToBlog = useMemo(
    () =>
      debounce(
        (q) => {
          if (q.trim()) {
            navigate(`/blog?q=${encodeURIComponent(q)}`)
          }
        },
        300,
        { leading: true, trailing: false }
      ),
    [navigate]
  )

  useEffect(() => {
    // 组件卸载时释放 debounce 定时器
    return () => debouncedNavigateToBlog.cancel()
  }, [debouncedNavigateToBlog])

  const handleSearch = (e) => {
    e.preventDefault()
    debouncedNavigateToBlog(query)
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-blue-600">PH</span>-MS-<span className="text-blue-600">Site</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {/* 搜索框（右侧第一个） */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="搜索博客…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700"
            >
              搜索
            </button>
          </form>

          <NavLink to="/" className={linkClass} end>主页</NavLink>
          <NavLink to="/blog" className={linkClass}>博客</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          {token ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>面板</NavLink>
              <button
                className="btn btn-ghost"
                onClick={() => { dispatch(logout()); navigate('/'); }}
              >退出</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>登录</NavLink>
              <NavLink to="/register" className={linkClass}>注册</NavLink>
            </>
          )}
        </nav>

        <div className="md:hidden">
          {/* 简化：移动端可按需加 Drawer，这里先不实现 */}
        </div>
      </div>
    </header>
  )
}