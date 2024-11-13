'use client'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Table, Typography, Spin, Modal } from 'antd'
import Layout from '../../../components/layout'
import { formatTime } from '../../../lib/formatTime'
import useStore from '../../../store/useStore'
import styles from '../../../components/SingleList.module.css'
const columns = [
  {
    title: '歌曲',
    dataIndex: 'song_title',
    key: 'song_title',
    width: '20%',
  },
  {
    title: '艺人',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    width: '10%',
    render: (text) => formatTime(text),
  },
]

export default function Home({ params }) {
  const {
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
  } = useStore()
  const { id } = params
  const [album, setAlbum] = useState({})
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState([])
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/album?id=${id}`)
        const data = await response.json()
        setAlbum(data)
        setCurSingleList(
          data.songs.map((song) => ({
            ...song,
            name: data.artists.name,
            cover: data.cover,
          }))
        )
      } catch (error) {
        console.error('Error fetching album:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [id])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const [onClicked, setOnClicked] = useState(null)
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  return (
    <Layout curActive="/">
      <div style={{ marginTop: '50px' }}>
        {loading ? ( // 根据加载状态渲染不同的内容
          <Spin size="large" />
        ) : (
          <>
            <Flex align="flex-end" gap={35} style={{ width: '700px' }}>
              <img
                src={album.cover}
                alt=""
                style={{
                  width: '270px',
                  borderRadius: '8px',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.4)',
                }}
              />
              <Flex vertical>
                <Typography.Title
                  level={3}
                  style={{ margin: '0', letterSpacing: '1px' }}
                >
                  {album.album_title}
                </Typography.Title>
                <Typography.Title
                  level={3}
                  style={{
                    margin: '0',
                    letterSpacing: '1px',
                    color: '#f30074',
                  }}
                >
                  {album.artists.name}
                </Typography.Title>
                <Typography.Text
                  type="secondary"
                  style={{
                    position: 'relative',
                    margin: '20px 0',
                    height: '90px',
                    width: '350px',
                    overflow: 'hidden',
                  }}
                >
                  {album.desc.split('\n').map((line, index) => (
                    <p key={index} style={{ margin: '0 0 4 0' }}>
                      {line}
                    </p>
                  ))}
                  {String(album.desc).length > 120 && (
                    <Button
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#fff',
                        border: 'none',
                        padding: '0',
                        paddingLeft: '17px',
                      }}
                      type="link"
                      size="small"
                      onClick={() => setIsModalOpen(true)}
                    >
                      更多
                    </Button>
                  )}
                </Typography.Text>
                <Button
                  type="primary"
                  style={{ width: '25%' }}
                  onClick={() => {
                    setCurrentId(curSingleList[0].id),
                      setSingleList(curSingleList)
                    setShowPlayer(true),
                      setOnClicked(curSingleList[0].id),
                      setIsPlaying(true)
                  }}
                >
                  播放全部
                </Button>
              </Flex>
            </Flex>
            <Table
              rowKey={(record) => record.id}
              dataSource={curSingleList}
              columns={columns}
              style={{ marginTop: '50px', width: '80%' }}
              pagination={false}
              onRow={(record) => ({
                onClick: () => {
                  setCurrentId(record.id), setSingleList(curSingleList)
                  setShowPlayer(true),
                    setOnClicked(record.id),
                    setIsPlaying(true)
                },
              })}
              rowClassName={(record) =>
                `item ${onClicked == record.id ? 'clicked' : ''}`
              }
            />
            <Modal
              title={album.album_title}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
              width={800}
            >
              <Typography.Text type="secondary">
                {album.desc.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </Typography.Text>
            </Modal>
          </>
        )}
      </div>
    </Layout>
  )
}
