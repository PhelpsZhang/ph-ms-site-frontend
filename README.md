# Personal Site (React + Vite)

## 依赖
- React 18
- React Router v6
- Axios
- Redux Toolkit（认证与全局状态）
- Tailwind CSS（快速样式）
- React Hook Form + Zod（表单校验）

## 接入现有后端
- 在 `.env` 设置 `VITE_API_BASE_URL` 指向你的后端，如 `http://localhost:8080/api`
- 接口约定（可按你的真实接口调整）：
  - `POST /auth/register` -> `{ token?: string, user?: {...} }`
  - `POST /auth/login` -> `{ token: string, user?: {...} }`
  - `GET /auth/me` -> `user`
  - `GET /blog/posts` -> `[{ id, title, summary, publishedAt }, ...]`
  - `GET /blog/posts/:id` -> `{ id, title, content, publishedAt }`
  - `PUT /users/me` -> 返回更新后的用户字段，如 `{ name }`

## 自定义与扩展
- 新增页面：在 `src/pages` 新建组件，并在 `App.jsx` 的 `<Routes>` 中添加路由。
- 样式：使用 Tailwind 原子类或在 `index.css` 中按需抽象复用类。
- 状态：统一使用 Redux Toolkit 管理全局状态，也可按模块拆分多个 slice。
- UI：本示例保持极简，你可以引入 shadcn/ui 或 Headless UI 进一步美化（需 Tailwind 环境）。