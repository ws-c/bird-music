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
import { ItemType } from 'antd/es/menu/interface'
interface IProps {
  children: React.ReactNode
  curActive: string
}

const CommonLayout: React.FC<IProps> = ({ children, curActive = '/' }) => {
  const {
    user,
    myPlayList,
    setMyPlayList,
    collectPlayList,
    setCollectPlayList,
    colorTheme,
  } = useStore()
  const router = useRouter()
  const [client, setClient] = useState(false)
  useEffect(() => {
    getMyPlayList()
    getCollectPlayList()
    setClient(true)
  }, [])
  // 创建的歌单
  const getMyPlayList = async () => {
    const res = await fetch(`/api/playlist/get?id=${user.id}`)
    const data = await res.json()
    setMyPlayList(data)
  }
  const myPlayList_ = myPlayList.map((item) => {
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
          <div className="relative">
            <img
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                ...(item.isPrivate === '1'
                  ? { filter: 'brightness(0.9)' }
                  : {}),
              }}
              src={
                item.img
                  ? item.img
                  : 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
              }
              alt="Image"
            />
            <Icons
              type="icon-lock-fill"
              size={20}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={
                item.isPrivate === '1'
                  ? { cursor: 'default' }
                  : { display: 'none' }
              }
            />
          </div>

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
      key: `playlist/${item.id}`,
    }
  })
  // 收藏的歌单
  const getCollectPlayList = async () => {
    const res = await fetch(`/api/playlist/collect/get?id=${user.id}`)
    const data = await res.json()
    setCollectPlayList(data)
  }
  const collectPlayList_ = collectPlayList.map((item) => {
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
      key: `playlist/${item.id}`,
    }
  })
  const items: ItemType[] = [
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
      label: '探索',
      key: 'explore',
      icon: (
        <Icons
          type="icon-zhinanzhenfill"
          size={20}
          color={curActive === 'explore' ? '#f30074' : ''}
        ></Icons>
      ),
    },
    {
      type: 'divider',
    },
    {
      label: '我喜欢的音乐',
      key: `love/${user.id}`,
      icon: (
        <Icons
          type="icon-love_fill"
          size={20}
          color={curActive === 'love' ? '#f30074' : ''}
        ></Icons>
      ),
    },
    {
      label: '最近播放',
      key: 'recent',
      icon: (
        <Icons
          type="icon-zuijin"
          size={20}
          color={curActive === 'recent' ? '#f30074' : ''}
        ></Icons>
      ),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <Flex className="text-xs leading-6">
          创建的歌单 ({myPlayList.length})
          <Button
            size="small"
            type="text"
            style={{
              position: 'relative',
              right: '-8px',
            }}
            onClick={(e) => {
              e.stopPropagation()
              showModal()
            }}
          >
            <Icons type="icon-add" size={14} />
          </Button>
        </Flex>
      ),
      key: 'create',
      children: myPlayList_,
    },
    {
      label: (
        <Flex className="text-xs leading-6">
          收藏的歌单 ({collectPlayList.length})
        </Flex>
      ),
      key: 'collect',
      children: collectPlayList_,
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
  const { theme } = useTheme()
  const { color } = useColorThief(colorTheme, {
    format: 'rgb',
    colorCount: 10,
    quality: 10,
  })
  let style = {}
  let siderStyle = {}
  const isBasePath =
    client &&
    (window.location.pathname === '/' ||
      window.location.pathname === '/explore' ||
      window.location.pathname.startsWith('/search/'))
  if (theme === 'dark') {
    style = isBasePath
      ? { paddingLeft: '240px', minHeight: '100vh', background: '#121212' }
      : {
          paddingLeft: '240px',
          minHeight: '100vh',
          background: `linear-gradient(to bottom, rgba(${color}, 0.3) 0%, #121212 50%)`,
        }
    siderStyle =
      client && isBasePath
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
      client && isBasePath
        ? { paddingLeft: '240px', minHeight: '100vh', background: '#f9f9f9' }
        : {
            paddingLeft: '240px',
            minHeight: '100vh',
            background: `linear-gradient(to bottom, rgba(${color}, 0.3) 0%, #f9f9f9 50%)`,
          }
    siderStyle =
      client && isBasePath
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
    <div className="h-screen">
      <Sider width={240} style={siderStyle}>
        <Flex className="mb-4 ml-8 h-16 items-baseline">
          <Icons
            type="icon-Twitter_icon4948c882-copy"
            size={24}
            className="mr-2"
          />
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
          defaultOpenKeys={['create', 'collect']}
          items={items}
          onClick={(item) => onClick(item)}
        />
      </Sider>
      <div style={{ ...style }}>
        <div className="sticky top-0 z-50 h-[70px] p-[10px_60px_0_20px]">
          <Head />
        </div>
        <main className="max-h-[calc(100vh-70px)] flex-1 overflow-auto p-[0_60px] pb-[120px]">
          {children}
        </main>
      </div>
      <CreatePlaylist
        open={open}
        setOpen={setOpen}
        getMyPlayList={getMyPlayList}
      ></CreatePlaylist>
    </div>
  )
}
export default CommonLayout
