import prisma from '@/lib/prisma'
// 批量查询喜欢记录
export default async function handler(
  req: {
    method: string
    body: {
      user_id: number
      song_ids: number[]
    }
  },
  res: any
) {
  if (req.method === 'POST') {
    try {
      const { user_id, song_ids } = req.body

      if (!user_id || !song_ids) {
        return res.status(400).json({ msg: '缺少必要参数', code: 400 })
      }

      const lovedSongs = await prisma.user_likes_songs.findMany({
        where: {
          user_id: +user_id,
          song_id: { in: song_ids.map((id) => +id) },
        },
        select: {
          song_id: true,
        },
        orderBy:{
          liked_at: 'desc'
        }
      })

      // 创建已喜欢歌曲ID集合
      const lovedSongIds = new Set(lovedSongs.map((s) => s.song_id))

      // 生成对应结果数组
      const result = song_ids.map((id) => lovedSongIds.has(id))

      res.status(200).json({
        code: 200,
        values: result, // 返回布尔数组
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ msg: '服务器错误', code: 500 })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
