import { useMemo, useState } from 'react'
import Container from '../components/Container'

const MOCKS = [
  { id: 1, title: '轻晨', tag: 'life', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800' },
  { id: 2, title: '代码', tag: 'tech', url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800' },
  { id: 3, title: '旅行', tag: 'travel', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800' },
  { id: 4, title: '咖啡', tag: 'life', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' },
]

const TAGS = [
  { key: 'all', label: '全部' },
  { key: 'life', label: '生活' },
  { key: 'tech', label: '技术' },
  { key: 'travel', label: '旅行' },
]

export default function Gallery() {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('all')

  const list = useMemo(() => {
    return MOCKS.filter((x) =>
      (tag === 'all' || x.tag === tag) &&
      (q.trim() === '' || x.title.includes(q.trim()))
    )
  }, [q, tag])

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold">Gallery 示例</h1>
      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <input className="input max-w-xs" placeholder="搜索标题…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2">
          {TAGS.map((t) => (
            <button key={t.key}
              className={`btn ${tag === t.key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTag(t.key)}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {list.map((it) => (
          <figure key={it.id} className="card overflow-hidden">
            <img src={it.url} alt={it.title} className="w-full h-40 object-cover"/>
            <figcaption className="mt-2 text-sm text-gray-700">{it.title}</figcaption>
          </figure>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-gray-600 mt-6">没有匹配的图片</p>
      )}
    </Container>
  )
}