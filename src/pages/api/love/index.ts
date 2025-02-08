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
      console.log(existingLove)
      if (existingLove) {
        // 如果已存在，删除该记录，表示取消喜欢
        await prisma.user_likes_songs.delete({
          where: {
            user_id_song_id: {
              user_id: +user_id,
              song_id: +song_id,
            },
          },
        })
        res.status(200).json({ msg: '已取消喜欢', code: 200, value: false })
      } else {
        // 如果不存在，添加喜欢记录
        await prisma.user_likes_songs.create({
          data: {
            user_id: +user_id,
            song_id: +song_id,
            liked_at: new Date(), // 设置当前时间作为喜欢时间
          },
        })
        res.status(200).json({ msg: '添加喜欢成功', code: 200, value: true })
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
