import flattenObject from '../../../../utils/flattenObject'
import prisma from '../../../../lib/prisma'

export default async function handler(req: { method: string }, res: any) {
  if (req.method === 'GET') {
    try {
      const songs = await prisma.songs.findMany({
        distinct: ['albums_id'],
        orderBy: {
          albums: {
            release_date: 'desc', // 按专辑发布日期降序排序
          },
        },
        take: 9, // 只获取最新的9条记录
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
      res.status(500).json({ error: 'Failed to fetch songs' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
