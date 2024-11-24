import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'

const JWT_SECRET = 'Fizz'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body

    try {
      // 根据 username 查找用户（假设 username 是唯一的）
      const user = await prisma.users.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          cover: true,
          password: true,
        },
      })

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // 检查密码是否匹配
      const isMatch = await bcrypt.compare(password, user.password!)
      if (isMatch) {
        // 密码匹配成功，生成 JWT
        const token = jwt.sign({ username: user.id }, JWT_SECRET, {
          expiresIn: '1h',
        })

        // 设置 Cookie
        res.setHeader(
          'Set-Cookie',
          `token=${token}; HttpOnly; Path=/; Max-Age=3600`
        )

        return res.status(200).json({
          message: 'Logged in successfully',
          data: {
            id: user.id,
            username: user.username,
            cover: user.cover,
          },
          code: 200,
        })
      } else {
        // 密码不匹配
        return res.status(401).json({ message: 'Invalid credentials' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
