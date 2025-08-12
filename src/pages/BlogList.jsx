import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import Container from '../components/Container'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils/formatDate'

export default function BlogList() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/blog/posts')
        setPosts(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally { setLoading(false) }
    })()
  }, [])

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold">博客</h1>
      {loading && <Spinner />}
      {error && <p className="text-red-600 mt-3">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {posts.map((p) => (
          <article key={p.id} className="card">
            <h2 className="text-xl font-semibold">
              <Link to={`/blog/${p.id}`} className="hover:underline">{p.title}</Link>
            </h2>
            <p className="text-sm text-gray-500 mt-1">{formatDate(p.publishedAt)}</p>
            <p className="mt-2 text-gray-700 line-clamp-3">{p.summary || p.excerpt}</p>
            <div className="mt-3">
              <Link to={`/blog/${p.id}`} className="btn btn-ghost">阅读全文 →</Link>
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