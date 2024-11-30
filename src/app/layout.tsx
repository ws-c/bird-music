'use client'

import '@/styles/globals.css'
import '@/styles/global.css'
import React, { useEffect, useState } from 'react'
import { ConfigProvider } from 'antd'
import useStore from '@/store/useStore'
import { Footer } from 'antd/es/layout/layout'
import Player from '@/components/Player'
import 'nprogress/nprogress.css'
import '@/styles/nprogress.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ThemeProvider } from '@/components/providers/theme-provider'

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
    <html lang="zh-CN" suppressHydrationWarning>
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
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            {isClient && showPlayer && <Player />}
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}
