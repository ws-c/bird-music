'use client'
import { useEffect, useState } from 'react'
import useStore from '../../../store/useStore'
import { formatTime } from '../../../utils/formatTime'
import { useRouter } from 'next/navigation'
import { Spin, Flex, Typography, Button, Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import flattenObject from '../../../utils/flattenObject'

const columns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: '1%',
    render: (_: any, __: any, index: number) =>
      (index + 1).toString().padStart(2, '0'),
  },
  {
    title: '歌名',
    dataIndex: 'song_title',
    key: 'song_title',
    width: '20%',
  },
  {
    title: '艺人',
    dataIndex: 'name',
    key: 'name',
    width: '15%',
  },
  {
    title: '专辑',
    dataIndex: 'album_title',
    key: 'name',
    width: '15%',
  },

  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    width: '5%',
    render: (text: number) => formatTime(text),
  },
]

const PlayList = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const {
    name,
    setCurrentId,
    setShowPlayer,
    currentId,
    setIsPlaying,
    setSingleList,
  } = useStore()
  const router = useRouter()

  const [playList, setPlayList] = useState({})
  const [loading, setLoading] = useState(true)
  const [curSingleList, setCurSingleList] = useState([])
  const [onClicked, setOnClicked] = useState(null)

  useEffect(() => {
    fetchPlayList()
    fetchData()
  }, [])
  const fetchPlayList = () => {
    setLoading(true)
    fetch(`/api/playlist/get/${id}?author=${name}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayList(data)
      })
      .catch((error) => console.error('Failed to fetch playlist:', error))
      .finally(() => setLoading(false))
  }
  const fetchData = async () => {
    const res = await fetch(`/api/playlist_content?id=${id}`)
    const data = await res.json()
    const newData = data.map((item: any) => flattenObject(item))
    setCurSingleList(newData)
  }
  useEffect(() => {
    setOnClicked(currentId)
  }, [currentId])
  return (
    <div style={{ marginTop: '30px' }}>
      {loading ? ( // 根据加载状态渲染不同的内容
        <Spin size="large" />
      ) : (
        <>
          <Flex align="flex-end" gap={35} style={{ width: '800px' }}>
            <div
              style={{
                overflow: 'hidden',
                height: '250px',
                borderRadius: '8px',
                boxShadow:
                  '0 10px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={playList.img}
                alt=""
                style={{
                  height: '250px',
                  borderRadius: '8px',
                }}
                className="cover-animation"
              />
            </div>
            <Flex vertical style={{ position: 'relative' }}>
              <Typography.Title
                level={2}
                style={{ margin: '0', letterSpacing: '1px' }}
              >
                {playList.name}
              </Typography.Title>
              <Typography.Text
                type="secondary"
                style={{
                  position: 'relative',
                  margin: '12px 0 24px 0',
                  height: '60px',
                  width: '500px',
                  overflow: 'hidden',
                }}
              >
                {playList.desc ? (
                  playList.desc.split('\n').map((line, index) => (
                    <p key={index} style={{ margin: '0 0 12px 0' }}>
                      {line}
                    </p>
                  ))
                ) : (
                  <></>
                )}
                <Flex gap={16}>
                  <span>{playList.author}</span>
                  <span>
                    标签：
                    {playList.tags.map((item, index) => (
                      <React.Fragment key={item}>
                        {index !== 0 && ' / '}
                        <a>{item}</a>
                      </React.Fragment>
                    ))}
                  </span>
                  <span>
                    创建于
                    {new dayjs(playList.createTime).format('YYYY-MM-DD')}
                  </span>
                </Flex>
              </Typography.Text>

              <Flex gap={8}>
                <Button
                  type="primary"
                  style={{ width: '100px' }}
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
                <Button disabled={name === playList.author}>收藏歌单</Button>
              </Flex>
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
                setShowPlayer(true), setOnClicked(record.id), setIsPlaying(true)
              },
            })}
            rowClassName={(record) =>
              `table-item ${onClicked == record.id ? 'clicked' : ''}`
            }
          />
        </>
      )}
    </div>
  )
}

export default PlayList
