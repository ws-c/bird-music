import flattenObject from '@/helpers/flattenObject'
import prisma from '@/lib/prisma'
// 获取探索页面歌单数据

export default async function handler(
  req: { method: string; query: { id: string } },
  res: any
) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      const songs = await prisma.songs.findMany({
        where: {
          tags: {
            path: '$', // 根路径
            array_contains: [Number(id)],
          },
        },
        // distinct: ['albums_id'],
        take: 10,
        include: {
          albums: {
            select: {
              cover: true, // 获取专辑封面
              release_date: true, // 获取专辑发布日期
              album_title: true, // 获取专辑标题
            },
          },
          song_artists: {
            select: {
              artist_id: true, // 获取艺术家ID
              artists: {
                select: {
                  name: true, // 获取艺术家名字
                },
              },
            },
          },
        },
      })

      const newSongs = songs.map((song) => flattenObject(song))
      res.status(200).json(newSongs)
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
