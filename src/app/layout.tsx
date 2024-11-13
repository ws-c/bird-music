'use client'
import '../styles/global.css'
import { ConfigProvider } from 'antd'
import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import { Footer } from 'antd/es/layout/layout'
import Player from '../components/Player'

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
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f30074',
          },
          components: {},
        }}
      >
        <body>
          {children}
          {isClient && showPlayer && (
            <Footer style={footerStyle}>
              <Player />
            </Footer>
          )}
        </body>
      </ConfigProvider>
    </html>
  )
}
