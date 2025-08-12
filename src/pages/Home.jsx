import { Link } from 'react-router-dom'
import Container from '../components/Container'

export default function Home() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Hello! I am <span className="text-blue-600">Philips Z</span>
            </h1>
            <p className="mt-4 text-gray-600">
              这里是我的个人网站：展示项目、记录博客、提供简单的注册/登录，以及一些可扩展的功能模块示例。
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/blog" className="btn btn-primary">查看博客</Link>
              <Link to="/dashboard" className="btn btn-ghost">进入面板</Link>
            </div>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">快速导航</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside text-gray-700">
              <li><Link className="underline" to="/register">注册</Link></li>
              <li><Link className="underline" to="/login">登录</Link></li>
              <li><Link className="underline" to="/blog">博客列表</Link></li>
              <li><Link className="underline" to="/gallery">Gallery 示例</Link></li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}