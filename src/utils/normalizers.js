// 统一把后端响应规范成 { token, user }
export const normalizeAuthResponse = (d = {}) => {
  const payload = d?.data ?? d
  return {
    token: payload?.token ?? null,
    user: payload?.user ?? payload?.userInfo ?? null,
  }
}

// /auth/me 可能是 { user } / { userInfo } / 直接是用户对象
export const normalizeMeResponse = (data) => {
  if (data && (data.user || data.userInfo)) return normalizeAuthResponse(data)
  return normalizeAuthResponse({ user: data })
}
