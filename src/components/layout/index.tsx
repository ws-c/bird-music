'use client'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useRouter } from 'next/navigation'
import Icons from '../Icons'
import Title from 'antd/es/typography/Title'
import Head from '../Head'
import CreatePlaylist from './CreatePlayList'
import useStore from '../../store/useStore'

const layoutStyle = {
  minHeight: '100vh',
}

const headerStyle = {
  background: '#f9f9f9',
  position: 'sticky' as React.CSSProperties['position'],
  top: 0,
  zIndex: 1000,
}

const contentStyle = {
  padding: '0 60px',
  background: '#f9f9f9',
  paddingBottom: '100px',
  overflow: 'auto',
  flex: 1, // 使 Content 区域占满剩余的空间
  maxHeight: 'calc(100vh - 64px)', // 计算剩余空间，去掉 header 的高度
}

const siderStyle = {
  background: '#f2f3f5',
  minHeight: '100vh',
  position: 'fixed' as React.CSSProperties['position'],
  left: '0',
  zIndex: 999,
}
interface IProps {
  children: React.ReactNode
  curActive: string
}

const CommonLayout: React.FC<IProps> = ({ children, curActive = '/' }) => {
  const { name, myPlayList, setMyPlayList } = useStore()
  const router = useRouter()

  useEffect(() => {
    getMyPlayList()
  }, [])
  const getMyPlayList = async () => {
    const res = await fetch(`/api/playlist/get?author=${name}`)
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
        <Flex style={{ position: 'relative' }}>
          创建的歌单
          <Button
            size="small"
            type="text"
            style={{
              position: 'absolute',
              right: '-50px',
              top: '7px',
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

  const onClick = (item: MenuInfo) => {
    router.push(`/${item.key}`)
  }
  const [open, setOpen] = useState(false)
  const showModal = () => {
    setOpen(true)
  }
  return (
    <Layout style={layoutStyle}>
      <Sider width={240} style={siderStyle}>
        <Flex
          style={{
            alignItems: 'baseline',
            marginLeft: '32px',
            height: '64px',
            marginBottom: '16px',
          }}
        >
          <Icons
            type="icon-a-1f99c"
            size={24}
            style={{
              marginRight: '8px',
            }}
          />
          <Title level={3} style={{ marginBottom: 0, lineHeight: '24px' }}>
            Bird Music
          </Title>
        </Flex>
        <Menu
          style={{
            border: 'none',
            background: '#f2f3f5',
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
      <Layout
        style={{
          marginLeft: '240px',
          minHeight: '100vh',
        }}
      >
        <Header style={headerStyle}>
          <Head></Head>
        </Header>

        <Content style={contentStyle}>{children}</Content>
      </Layout>
      <CreatePlaylist
        open={open}
        setOpen={setOpen}
        name={name}
        getMyPlayList={getMyPlayList}
      ></CreatePlaylist>
    </Layout>
  )
}
export default CommonLayout
