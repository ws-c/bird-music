'use client'
import '../styles/global.css'
import { ConfigProvider } from 'antd'
import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import { Footer } from 'antd/es/layout/layout'
import Player from '../components/Player'
import 'nprogress/nprogress.css'
import '../styles/nprogress.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'

const footerStyle = {
  padding: '0',
  borderTop: '1px solid #e8e8e8',
  background: '#fafafa',
  position: 'fixed',
  bottom: '0',
  width: '100%',
  zIndex: 1000,
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { showPlayer } = useStore()
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <html lang="en">
      <title>Bird Music</title>
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#f30074',
            },
            components: {
              Menu:{
                subMenuItemBg: '#f9f9f9'
              }
            },
          }}
        >
          <AntdRegistry>
            {children}
            {isClient && showPlayer && (
              <Footer style={footerStyle}>
                <Player />
              </Footer>
            )}
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}
