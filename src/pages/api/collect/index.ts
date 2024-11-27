import prisma from '@/lib/prisma'
// 单曲收藏至歌单
export default async function handler(
  req: { method: string; body: { songId: any; playListId: any } },
  res: any
) {
  if (req.method === 'POST') {
    try {
      const { songId, playListId } = req.body
      console.log(songId, playListId)
      await prisma.playlist_songs.create({
        data: {
          playlist_id: +playListId,
          song_id: +songId,
        },
      })
      res.status(200).json({ msg: '收藏成功', code: 200 })
    } catch (error) {
      res.status(400).json({ msg: '歌单已存在该歌曲', code: 400 })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
