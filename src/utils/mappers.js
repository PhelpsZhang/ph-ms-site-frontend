// 前端出站请求

// 登录：email → usernameOrEmail（如已显式传入 usernameOrEmail 则优先）
export const mapLoginRequest = ({ email, usernameOrEmail, password }) => ({
  usernameOrEmail: usernameOrEmail ?? email ?? '',
  password,
})

// 注册：
export const mapRegisterRequest = (payload = {}) => {
  const { username, email, password } = payload
  return {
    username,
    password, // 可按后端约定删掉
    email: email ?? '',
  }
}
