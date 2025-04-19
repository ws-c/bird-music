import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  // 设置删除 Cookie 的 Header
  res.setHeader(
    'Set-Cookie',
    'token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
  )

  // 返回成功响应
  res.status(200).json({ message: '退出成功' })
}
