'use client'
import React, { useEffect, useState } from 'react'
import { Flex, Spin, Typography } from 'antd'
import Layout from '../../../components/layout'
import SingleList from './components/SingleList'
import ArtistList from './components/ArtistList'
import AlbumList from './components/AlbumList'

export default function Home({
  params,
}: {
  params: {
    id: string
  }
}) {
  const [loading, setLoading] = useState(true)
  const [singleList, setSingleList] = useState([])
  const [artistList, setArtistList] = useState([])
  const [albumList, setAlbumList] = useState([])

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
        console.log('art',artistRes)
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
      <div>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Flex gap={8} vertical>
            {artistList.length > 0 && (
              <>
                <Typography.Title level={4}>艺人</Typography.Title>
                <ArtistList artists={artistList}></ArtistList>
              </>
            )}

            {singleList.length > 0 && (
              <>
                <Typography.Title level={4}>单曲</Typography.Title>
                <SingleList curSingleList={singleList}></SingleList>
              </>
            )}

            {albumList.length > 0 && (
              <>
                <Typography.Title level={4}>专辑</Typography.Title>
                <AlbumList albumList={albumList}></AlbumList>
              </>
            )}
            {!artistList.length &&
              !singleList.length &&
              !albumList.length && <div>没有相关结果</div>
            }
          </Flex>
        )}
      </div>
    </Layout>
  )
}
