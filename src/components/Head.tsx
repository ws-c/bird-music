'use client'
import React from 'react'
import { Avatar, Dropdown, Flex } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import styles from './Header.module.css'
import Input from 'antd/es/input/Input'

export default function Header() {
  // 用户下拉菜单
  const items = [
    {
      key: '1',
      label: <Link href="/settings">设置</Link>,
    },
    {
      key: '2',
      label: <Link href="/logout">退出</Link>,
    },
  ]
  return (
    <Flex className={styles.header}>
      <Flex align="center">
        <Input
          style={{ width: '240px', height: '32px' }}
          size="small"
          placeholder="搜索"
          prefix={<SearchOutlined />}
        />
      </Flex>
      <div className={styles.right}>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar icon={<UserOutlined />} className={styles.avatar} />
        </Dropdown>
      </div>
    </Flex>
  )
}
