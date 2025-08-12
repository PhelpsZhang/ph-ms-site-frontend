import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="text-blue-600">PH</span>-MS-<span className="text-blue-600">Site</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>主页</NavLink>
          <NavLink to="/blog" className={linkClass}>博客</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          {token ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>面板</NavLink>
              <button
                className="btn btn-ghost"
                onClick={() => { logout(); navigate('/'); }}
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