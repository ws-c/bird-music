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
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        ></link>
        <title>Bird Music</title>
      </head>
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#f30074',
              colorBgContainer: 'transparent',
            },
            components: {
              Menu: {
                subMenuItemBg: 'transparent',
              },
              Table: {
                headerBg: 'transparent',
                borderColor: 'transparent',
              },
            },
          }}
        >
          <AntdRegistry>
            {children}
            {isClient && showPlayer && (
              <Footer
                style={{
                  padding: '0',
                  borderTop: '1px solid #e8e8e8',
                  background: '#fafafa',
                  position: 'fixed',
                  bottom: '0',
                  width: '100%',
                  zIndex: 1000,
                }}
              >
                <Player />
              </Footer>
            )}
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}
