'use client'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useRouter } from 'next/navigation'
import Icons from '@/components/Icons'
import Title from 'antd/es/typography/Title'
import Head from '@/components/Head'
import CreatePlaylist from './CreatePlayList'
import useStore from '@/store/useStore'
import useColorThief from 'use-color-thief'
import { useTheme } from 'next-themes'

interface IProps {
  children: React.ReactNode
  curActive: string
}

const CommonLayout: React.FC<IProps> = ({ children, curActive = '/' }) => {
  const { user, myPlayList, setMyPlayList, colorTheme } = useStore()
  const router = useRouter()
  const [client, setClient] = useState(false)
  useEffect(() => {
    getMyPlayList()
    setClient(true)
  }, [])
  const getMyPlayList = async () => {
    const res = await fetch(`/api/playlist/get?author=${user.username}`)
    const data = await res.json()
    setMyPlayList(data)
  }
  const myPlayList_ = myPlayList.map((item, index) => {
    return {
      label: (
        <Flex
          align="center"
          style={{
            fontSize: '12px',
            color: '#999',
          }}
          gap={8}
        >
          <img
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
            }}
            src={
              item.img
                ? item.img
                : 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
            }
            alt="Image"
          />
          <div
            style={{
              height: '32px',
              width: '127px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '32px',
            }}
          >
            {item.name}
          </div>
        </Flex>
      ),
      key: `playlist/${item.id}`, // 使用 index 确保每个 item 有唯一的 key
    }
  })
  const items = [
    {
      label: '主页',
      key: '/',
      icon: (
        <Icons
          type="icon-home-fill"
          size={20}
          color={curActive === '/' ? '#f30074' : ''}
        ></Icons>
      ),
    },
    {
      label: '电台',
      key: 'radio',
      icon: (
        <Icons
          type="icon-diantaimian"
          size={20}
          color={curActive === 'radio' ? '#f30074' : ''}
        ></Icons>
      ),
    },
    {
      label: (
        <Flex>
          创建的歌单
          <Button
            size="small"
            type="text"
            style={{
              position: 'relative',
              right: '-20px',
              top: '8px',
            }}
            onClick={(e) => {
              e.stopPropagation()
              showModal()
            }}
          >
            <Icons type="icon-add" size={16} />
          </Button>
        </Flex>
      ),
      key: 'create',
      children: myPlayList_,
    },
    {
      label: '收藏的歌单',
      key: 'collect',
    },
  ]

  const onClick = (item: any) => {
    router.push(`/${item.key}`)
  }
  const [open, setOpen] = useState(false)
  const showModal = () => {
    setOpen(true)
  }

  //主题背景颜色
  const { theme, setTheme } = useTheme()
  const { color } = useColorThief(colorTheme, {
    format: 'rgb',
    colorCount: 10,
    quality: 10,
  })
  let style = {}
  let siderStyle = {}
  if (theme === 'dark') {
    style =
      client && window.location.pathname === '/'
        ? { paddingLeft: '240px', minHeight: '100vh', background: '#121212' }
        : {
            paddingLeft: '240px',
            minHeight: '100vh',
            background: `linear-gradient(to bottom, rgba(${color}, 0.3) 0%, #121212 50%)`,
          }
    siderStyle =
      client && window.location.pathname === '/'
        ? {
            background: '#1f1f1f',
            minHeight: '100vh',
            position: 'fixed' as React.CSSProperties['position'],
            left: '0',
          }
        : {
            backgroundColor: '#1f1f1f',
            background: `linear-gradient(to bottom, rgba(${color}, 0.01) 0%, #1f1f1f 25%)`,
            minHeight: '100vh',
            position: 'fixed' as React.CSSProperties['position'],
            left: '0',
          }
  } else {
    style =
      client && window.location.pathname === '/'
        ? { paddingLeft: '240px', minHeight: '100vh', background: '#f9f9f9' }
        : {
            paddingLeft: '240px',
            minHeight: '100vh',
            background: `linear-gradient(to bottom, rgba(${color}, 0.3) 0%, #f9f9f9 50%)`,
          }
    siderStyle =
      client && window.location.pathname === '/'
        ? {
            background: '#f0f3f6',
            minHeight: '100vh',
            position: 'fixed' as React.CSSProperties['position'],
            left: '0',
          }
        : {
            backgroundColor: '#f0f3f6',
            background: `linear-gradient(to bottom, rgba(${color}, 0.01) 0%, #f0f3f6 25%)`,
            minHeight: '100vh',
            position: 'fixed' as React.CSSProperties['position'],
            left: '0',
          }
  }
  return (
    <div className="min-h-screen">
      <Sider width={240} style={siderStyle}>
        <Flex className="mb-4 ml-8 h-16 items-baseline">
          <Icons type="icon-a-1f99c" size={24} className="mr-2" />
          <Title level={3} className="mb-0 pt-[14px]">
            Bird Music
          </Title>
        </Flex>
        <Menu
          style={{
            border: 'none',
            letterSpacing: '2px',
            padding: '0 24px',
          }}
          mode="inline"
          selectedKeys={[curActive]}
          defaultOpenKeys={['create']}
          items={items}
          onClick={(item) => onClick(item)}
        />
      </Sider>
      <div style={{ ...style, maxWidth: 'calc(100vw-240px)' }}>
        <div className="sticky top-0 z-50 h-[70px] p-[10px_60px_0_20px]">
          <Head />
        </div>
        <main className="max-h-[calc(100vh-70px)] max-w-[calc(100vw-240px)] flex-1 overflow-auto p-[0_60px] pb-[120px]">
          {children}
        </main>
      </div>
      <CreatePlaylist
        open={open}
        setOpen={setOpen}
        name={user.username}
        getMyPlayList={getMyPlayList}
      ></CreatePlaylist>
    </div>
  )
}
export default CommonLayout
