export default function handler(res: {
  setHeader: (arg0: string, arg1: string) => void
  status: (arg0: number) => {
    (): any
    new (): any
    json: { (arg0: { message: string }): any; new (): any }
  }
}) {
  // 删除 Cookie 的方法：设置 Max-Age=0 或者过期时间为过去
  res.setHeader(
    'Set-Cookie',
    'token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'
  )

  // 返回响应
  return res.status(200).json({ message: 'Logged out successfully' })
}
