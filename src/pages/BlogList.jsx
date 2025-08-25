import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import Container from '../components/Container'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils/formatDate'
import { current } from '@reduxjs/toolkit'

export default function BlogList() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')

  const [searchParams] = useSearchParams()
  const location = useLocation()
  

  const queryDTO = useMemo(() => {
    // 优先从navigate state取
    if (location.state?.queryDTO) {
      return location.state.queryDTO
    }

    // 否则从url? q= xx 解析
    const q = searchParams.get("q")
    const categoryId = searchParams.get("categoryId")

    return {
      current: 1,
      size: 10,
      filter: {
        keyword: q || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined
      }
    }
  }, [location.state, searchParams])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post('/blog/page', queryDTO)
        const records = data?.data?.records ?? data?.data?.records?.items ?? []
        setPosts(Array.isArray(records) ? records : records?.items || [])
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally { setLoading(false) }
    })()
  }, [queryDTO])  // 每次queryDTO变化都重发请求

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold">博客</h1>
      {loading && <Spinner />}
      {error && <p className="text-red-600 mt-3">{error}</p>}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {posts.map((p) => (
          <article
            key={p.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
          >
            {/* 封面图 */}
            {p.coverImageUrl && (
              <Link to={`/blog/${p.id}`}>
                <img
                  src={p.coverImageUrl}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </Link>
            )}

            {/* 内容区域 */}
            <div className="mt-4 flex-1 flex flex-col">
              {/* 标题 */}
              <h2 className="text-xl font-semibold line-clamp-2">
                <Link
                  to={`/blog/${p.id}`}
                  className="hover:underline"
                >
                  {p.title}
                </Link>
              </h2>

              {/* 作者 + 日期 */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>{p.authorName}</span>
                <span>•</span>
                <time>{formatDate(p.createDate)}</time>
              </div>

              {/* 摘要 */}
              <p className="mt-2 text-gray-700 line-clamp-3">{p.summary}</p>

              {/* 标签 */}
              {p.tags?.map((tag) => {
                const id = typeof tag === "string" ? tag : tag.id
                const name = typeof tag === "string" ? tag : tag.name
                return (
                  <span key={id} className="px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-600">
                    #{name}
                  </span>
                )
              })}

              {/* 底部：浏览数 + 按钮 */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{p.viewCount ?? 0}</span>
                </div>
                <Link
                  to={`/blog/${p.id}`}
                  className="btn btn-ghost btn-sm"
                >
                  阅读全文 →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && posts.length === 0 && !error && (
        <p className="text-gray-600 mt-6">暂无文章。</p>
      )}
    </Container>
  )
}