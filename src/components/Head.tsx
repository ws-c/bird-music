'use client'

import React, { useEffect, useState } from 'react'
import { AutoComplete, Button, Dropdown, Input, MenuProps } from 'antd'
import {
  EditOutlined,
  LeftOutlined,
  LoginOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import HeadSetting from './HeadSetting'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Fetch } from '@/lib/request'
import { useShallow } from 'zustand/react/shallow'
// import { ThemeToggle } from '@/components/layouts/theme-toggle'

type Option = {
  value: string
  label: string
}

export default function Header() {
  const { user, inputValue, setInputValue, setShowSidebar } = useStore(
    useShallow((store) => ({
      user: store.user,
      inputValue: store.inputValue,
      setInputValue: store.setInputValue,
      setShowSidebar: store.setShowSidebar,
    }))
  )
  const [isClient, setIsClient] = useState(false)
  const [open, setOpen] = useState(false) // 控制用户设置抽屉
  const [options, setOptions] = useState<Option[]>([])
  const [type, setType] = useState('') // 1 用户信息 2 修改密码
  useEffect(() => {
    setIsClient(true)
  }, [])

  const route = useRouter()

  const logout = async () => {
    await Fetch('/api/logout')
    localStorage.clear()
    route.push('/auth')
  }

  const items: MenuProps['items'] =
    user.username === '未登录'
      ? [
          {
            key: '1',
            label: <span>登录账号</span>,
            onClick: () => route.push('/auth'),
            icon: <LoginOutlined />,
          },
        ]
      : [
          {
            key: '1',
            label: <span>{user.username}</span>,
            disabled: true,
            icon: <UserOutlined />,
          },
          {
            key: '2',
            label: <hr />,
            type: 'group',
          },
          {
            key: '3',
            label: <span>修改资料</span>,
            onClick: () => {
              setOpen(true)
              setType('1')
            },
            icon: <EditOutlined />,
          },
          {
            key: '4',
            label: <span>设置密码</span>,
            onClick: () => {
              setOpen(true)
              setType('2')
            },
            icon: <SettingOutlined />,
          },
          {
            key: '5',
            label: <span onClick={logout}>退出账号</span>,
            icon: <LogoutOutlined />,
          },
        ]

  const handleSearch = async (value: any) => {
    if (!value) {
      setOptions([])
      return
    }
    const data = await Fetch(`/api/search?q=${value}`, { loading: false })
    setOptions(data)
  }

  const handleSelect = (value: string, option: Option) => {
    if (value) {
      route.push(`/search/${value}`)
    }
    setInputValue(option.label)
  }

  const handleChange = (value: string) => {
    setInputValue(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      route.push(`/search/${inputValue}`)
    }
  }
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <Button
          type="text"
          className="relative top-[4px] h-10 w-10"
          disabled={isClient && window.location.pathname === '/'}
          icon={<LeftOutlined size={12} />}
          onClick={() => route.back()}
        ></Button>
        <div
          className="relative top-[4px] flex h-10 w-10 cursor-pointer items-center justify-center hover:opacity-80 md:hidden"
          onClick={() => setShowSidebar(true)}
        >
          <MenuOutlined size={20} />
        </div>
        <AutoComplete
          allowClear
          style={{ width: '360px' }}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          value={inputValue}
          onChange={handleChange}
        >
          <Input
            variant="filled"
            placeholder="搜索歌曲、专辑、艺人、歌单"
            prefix={<SearchOutlined />}
            style={{ height: '40px' }}
            onKeyDown={handleKeyDown}
          />
        </AutoComplete>
      </div>
      <div className="relative top-1 flex items-center gap-2 pr-24">
        {/* <ThemeToggle /> */}
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.cover}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>
              <UserOutlined />
            </AvatarFallback>
          </Avatar>
        </Dropdown>
      </div>
      <HeadSetting open={open} setOpen={setOpen} type={type} />
    </div>
  )
}
