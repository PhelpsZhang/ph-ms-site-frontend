import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import Container from '../components/Container'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils/formatDate'

export default function BlogPost() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/blog/posts/${id}`)
        setPost(data)
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally { setLoading(false) }
    })()
  }, [id])

  return (
    <Container className="py-10">
      <Link to="/blog" className="text-blue-600 underline">← 返回博客</Link>
      {loading && <Spinner />}
      {error && <p className="text-red-600 mt-3">{error}</p>}
      {post && (
        <article className="prose max-w-none">
          <h1>{post.title}</h1>
          <p className="!mt-0 text-sm text-gray-500">{formatDate(post.publishedAt)}</p>
          <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
        </article>
      )}
    </Container>
  )
}