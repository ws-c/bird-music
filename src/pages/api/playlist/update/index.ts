import prisma from '@/lib/prisma'

// 修改歌单
export default async function handler(
  req: {
    method: string
    body: {
      id: any
      name: any
      author: any
      desc: any
      tags: any
      isPrivate: any
      img?: any
    }
  },
  res: any
) {
  if (req.method === 'POST') {
    try {
      // 解析请求体
      const { name, author, desc, tags, isPrivate, img, id } = req.body

      // 使用 Prisma 创建新的 Playlist 数据
      await prisma.playlist.update({
        where: {
          id: id,
        },
        data: {
          name,
          author,
          desc,
          tags,
          isPrivate,
          img,
        },
      })

      // 返回成功响应
      res.status(200).json({ msg: '更新成功', code: 200 })
    } catch (error) {
      console.error('更新播放列表失败:', error)
      res.status(500).json({ error: '更新歌单失败，请稍后重试' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
