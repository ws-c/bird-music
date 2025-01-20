'use client'
import React, { useEffect, useState } from 'react'
import { Flex, Spin, Typography } from 'antd'
import Layout from '@/components/layout'
import SingleList from './components/SingleList'
import ArtistList from './components/ArtistList'
import AlbumList from './components/AlbumList'

export type SingleList_ = {
  album_title: string
  albums_id: number
  artists_id: number
  cover?: string
  duration: number
  file_path: string
  id: number
  name?: string
  song_title?: string
  [property: string]: any
}
export type ArtistList_ = {
  id?: number
  image_url?: string
  name?: string
  [property: string]: any
}
export type AlbumList_ = {
  album_title?: string
  artists: Artists
  cover?: string
  id?: number
  release_date?: string
  [property: string]: any
}
export type Artists = {
  name: string
  [property: string]: any
}

export default function Home({
  params,
}: {
  params: {
    id: string
  }
}) {
  const [loading, setLoading] = useState(true)
  const [singleList, setSingleList] = useState<SingleList_[]>([])
  const [artistList, setArtistList] = useState<ArtistList_[]>([])
  const [albumList, setAlbumList] = useState<AlbumList_[]>([])

  useEffect(() => {
    // 使用 Promise.all 使请求并行
    const fetchData = async () => {
      try {
        const [singleRes, artistRes, albumRes] = await Promise.all([
          fetch(`/api/search/singleList?keyword=${params.id}`).then((res) =>
            res.json()
          ),
          fetch(`/api/search/artistList?keyword=${params.id}`).then((res) =>
            res.json()
          ),
          fetch(`/api/search/albumList?keyword=${params.id}`).then((res) =>
            res.json()
          ),
        ])

        setSingleList(singleRes)
        setArtistList(artistRes)
        setAlbumList(albumRes)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])
  return (
    <Layout curActive="">
      <div className="pt-4">
        {loading ? (
          <Spin size="large" />
        ) : (
          <Flex gap={8} vertical>
            {artistList.length > 0 && (
              <>
                <h2 className="pb-2 pt-4 text-xl font-bold">艺人</h2>
                <ArtistList artists={artistList}></ArtistList>
              </>
            )}
            {albumList.length > 0 && (
              <>
                <h2 className="pb-2 pt-4 text-xl font-bold">专辑</h2>
                <AlbumList albumList={albumList}></AlbumList>
              </>
            )}
            {singleList.length > 0 && (
              <>
                <h2 className="pb-2 pt-4 text-xl font-bold">单曲</h2>
                <SingleList curSingleList={singleList}></SingleList>
              </>
            )}

            {!artistList.length && !singleList.length && !albumList.length && (
              <div>没有相关结果</div>
            )}
          </Flex>
        )}
      </div>
    </Layout>
  )
}
