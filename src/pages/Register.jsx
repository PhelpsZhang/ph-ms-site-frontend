import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register as doRegister } from '../store/authSlice'
import Container from '../components/Container'

const schema = z.object({
  username: z.string().min(2, '至少 2 个字符'),
  email: z.string().email('请输入有效邮箱'),
  password: z.string().min(6, '至少 6 位'),
})

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loading = useSelector((s) => s.auth.loading)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (v) => {
    try {
      await dispatch(doRegister(v)).unwrap()
      alert('注册成功！请登录。')
      navigate('/login')
    } catch (err) {
      alert(err || '注册失败')
    }
  }

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold">注册</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">昵称</label>
            <input className="input" placeholder="你的昵称" {...register('username')} />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text.sm mb-1">邮箱</label>
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