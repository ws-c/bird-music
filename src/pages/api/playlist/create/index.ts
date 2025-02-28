import prisma from '@/lib/prisma'

// 创建歌单
export default async function handler(
  req: {
    method: string
    body: any
  },
  res: any
) {
  if (req.method === 'POST') {
    try {
      // 解析请求体
      const { name, author, desc, tags, isPrivate, img, user_id } = req.body

      // 查询当前用户已创建的歌单数量
      const playlistCount = await prisma.playlist.count({
        where: { author }, // 根据作者查询
      })

      if (playlistCount >= 5) {
        // 超过5个歌单限制，返回错误响应
        return res.status(400).json({ msg: '最多只能创建5个歌单', code: 400 })
      }

      // 使用 Prisma 创建新的 Playlist 数据
      await prisma.playlist.create({
        data: {
          name,
          author,
          createTime: new Date(),
          desc,
          tags,
          isPrivate,
          img,
          user_id,
        },
      })

      // 返回成功响应
      res.status(200).json({ msg: '创建成功', code: 200 })
    } catch (error) {
      console.error('创建播放列表失败:', error)
      res.status(500).json({ error: '创建歌单失败，请稍后重试' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
