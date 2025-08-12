export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}