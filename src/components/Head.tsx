'use client'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Flex } from 'antd'
import { LeftOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import styles from './Header.module.css'
import Input from 'antd/es/input/Input'
import { useRouter } from 'next/navigation'
import useStore from '../store/useStore'

export default function Header() {
  const { name } = useStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const route = useRouter()
  const logout = async () => {
    localStorage.clear()
    const res = await fetch('/api/logout', { method: 'POST' })
    route.push('/auth')
    console.log('Logout:', res.ok)
  }

  // 用户下拉菜单
  const items = [
    {
      key: '1',
      label: <span>设置</span>,
    },
    {
      key: '2',
      label: <span onClick={logout}>退出</span>,
    },
  ]
  return (
    <Flex className={styles.header}>
      <Flex align="center" gap={8}>
        <Button
          icon={<LeftOutlined size={12} />}
          onClick={() => route.back()}
        ></Button>
        <Input
          style={{ width: '300px', height: '32px' }}
          size="small"
          placeholder="搜索"
          prefix={<SearchOutlined />}
        />
      </Flex>
      <div className={styles.right}>
        <span>{isClient && name}</span>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar icon={<UserOutlined />} className={styles.avatar} />
        </Dropdown>
      </div>
    </Flex>
  )
}
