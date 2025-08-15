import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice'
import Container from '../components/Container'

const schema = z.object({
  email: z.string().email('请输入有效邮箱'),
  password: z.string().min(6, '至少 6 位'),
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const dispatch = useDispatch()
  const loading = useSelector((s) => s.auth.loading)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values) => {
    try {
      await dispatch(login({ email: values.email, password: values.password })).unwrap()
      navigate(from, { replace: true })
    } catch (err) {
      alert(err || '登录失败')
    }
  }

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold">登录</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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