import prisma from '@/lib/prisma'

// 单曲喜欢
export default async function handler(
  req: { method: string; body: { song_id: any; user_id: any } },
  res: any
) {
  if (req.method === 'POST') {
    try {
      const { song_id, user_id } = req.body

      // 查询是否已经存在对应的喜欢记录
      const existingLove = await prisma.user_likes_songs.findUnique({
        where: {
          user_id_song_id: {
            user_id: +user_id,
            song_id: +song_id,
          },
        },
      })
      if (existingLove) {
        res.status(200).json({ code: 200, value: true })
      } else {
        res.status(200).json({ code: 200, value: false })
      }
    } catch (error) {
      console.error(error)
      res.status(400).json({ msg: '发生错误', code: 400 })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
