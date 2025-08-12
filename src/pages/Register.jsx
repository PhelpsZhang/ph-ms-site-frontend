import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'
import Container from '../components/Container'

const schema = z.object({
  name: z.string().min(2, '至少 2 个字符'),
  email: z.string().email('请输入有效邮箱'),
  password: z.string().min(6, '至少 6 位'),
})

export default function Register() {
  const navigate = useNavigate()
  const { register: doRegister, loading } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (v) => {
    const res = await doRegister(v)
    if (res.ok) {
      alert('注册成功！请登录。')
      navigate('/login')
    } else alert(res.error || '注册失败')
  }

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold">注册</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">昵称</label>
            <input className="input" placeholder="你的昵称" {...register('name')} />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">邮箱</label>
            <input className="input" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">密码</label>
            <input type="password" className="input" placeholder="••••••" {...register('password')} />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? '提交中…' : '注册'}
          </button>
          <p className="text-sm text-gray-600">
            已有账号？<Link to="/login" className="underline">去登录</Link>
          </p>
        </form>
      </div>
    </Container>
  )
}