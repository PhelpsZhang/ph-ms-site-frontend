import { useEffect, useMemo, useState } from 'react'
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
        const { data: resp } = await api.get(`/blog/${id}`)
        const blogDetail = resp?.data
        setPost(blogDetail)
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const readTime = useMemo(() => {
    const text = post?.content || ''
    const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const en = (text.replace(/[\u4e00-\u9fa5]/g, '').trim().split(/\s+/).filter(Boolean)).length
    const mins = Math.max(1, Math.round(cn / 400 + en / 200))
    return `${mins} 分钟阅读`
  }, [post?.content])

  const dateStr = post ? (post.createDate || (post.updateTime ? post.updateTime.slice(0, 10) : '')) : ''

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-6">
        <Link to="/blog" className="text-blue-600 hover:underline">← 返回博客</Link>
        {post?.viewCount != null && (
          <span className="text-sm text-gray-500" title="浏览量">
            {post.viewCount.toLocaleString()} 次阅读
          </span>
        )}
      </div>

      {loading && <Spinner />}
      {error && <p className="text-red-600 mt-3">{error}</p>}

      {post && (
        <article className="max-w-3xl mx-auto">
          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title || '未命名标题'}</h1>

          {/* 元信息 */}
          <div className="mt-2 text-sm text-gray-500 flex flex-wrap items-center gap-2">
            {post.categoryName && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{post.categoryName}</span>
            )}
            {dateStr && (<><span>·</span><time>{formatDate?.(dateStr) || dateStr}</time></>)}
            <span>·</span><span>{readTime}</span>
            {post.authorName && (<><span>·</span><span>{post.authorName}</span></>)}
          </div>

          {/* 封面图（可选） */}
          {post.coverImageUrl && (
            <div className="mt-6">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-auto rounded-2xl object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* 正文 */}
          <div className="prose prose-slate max-w-none mt-8">
            {/* 方案 A：纯文本，保留换行 */}
            <pre className="whitespace-pre-wrap font-sans text-gray-800 text-base leading-7">
{post.content || '（正文空空如也～）'}
            </pre>

            {/* 方案 B（如 content 已是“安全 HTML”，将上面的 <pre> 注释掉，打开下面这一段） */}
            {false && (
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>

          {/* 标签 & 分享 */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(post.tags?.length ? post.tags : []).length > 0 ? (
                post.tags.map(t => (
                  <span key={t.id || t} className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                    #{t.name || t}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">暂无标签</span>
              )}
            </div>
            <button
              className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:opacity-90 text-sm"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
            >
              复制链接
            </button>
          </div>

          {/* 作者卡片（可选） */}
          <section className="mt-10 p-5 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                {(post.authorName || '匿名作者').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{post.authorName || '匿名作者'}</div>
                <div className="text-sm text-gray-500">感谢阅读！如果喜欢这篇文章，欢迎分享给朋友～</div>
              </div>
            </div>
          </section>
        </article>
      )}
    </Container>
  )
}
