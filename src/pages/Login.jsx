import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'
import Container from '../components/Container'

const schema = z.object({
  identifier: z.string().email('请输入有效邮箱'),
  password: z.string().min(6, '至少 6 位'),
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const { login, loading } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values) => {
    const res = await login(values.identifier, values.password)
    if (res.ok) navigate(from, { replace: true })
    else alert(res.error || '登录失败')
  }

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold">登录</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">邮箱</label>
            <input className="input" placeholder="you@example.com" {...register('identifier')} />
            {errors.identifier && <p className="text-sm text-red-600 mt-1">{errors.identifier.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">密码</label>
            <input type="password" className="input" placeholder="••••••" {...register('password')} />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? '登录中…' : '登录'}
          </button>
          <p className="text-sm text-gray-600">
            还没有账号？<Link to="/register" className="underline">去注册</Link>
          </p>
        </form>
      </div>
    </Container>
  )
}