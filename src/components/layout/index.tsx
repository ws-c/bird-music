'use client'
import React from 'react'
import { Flex, Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useRouter } from 'next/navigation'
import Icons from '../Icons'
import Title from 'antd/es/typography/Title'
import Head from '../Head'
const layoutStyle = {
  minHeight: '100vh',
}

const headerStyle = {
  background: '#fff',
  padding: '16px 20px',
  borderBottom: '1px solid #e8e8e8',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}

const contentStyle = {
  padding: '0 28px',
  background: '#fff',
  paddingBottom: '100px',
}

const siderStyle = {
  background: '#f9f9f9',
  borderRight: '1px solid #e8e8e8',
  minHeight: '100vh',
  position: 'fixed',
  left: '0',
  zIndex: 999,
}
interface IProps {
  children: React.ReactNode
  curActive: string
}
const CommonLayout: React.FC<IProps> = ({ children, curActive = '/' }) => {
  const router = useRouter()
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
  ]

  const onClick = (item: MenuInfo) => {
    router.push(`/${item.key}`)
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
            background: '#f9f9f9',
            letterSpacing: '2px',
            padding: '0 24px',
          }}
          mode="inline"
          selectedKeys={[curActive]}
          items={items}
          onClick={(item) => onClick(item)}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: '240px',
        }}
      >
        <Header style={headerStyle}>
          <Head></Head>
        </Header>

        <Content style={contentStyle}>{children}</Content>
      </Layout>
    </Layout>
  )
}
export default CommonLayout
