'use client'

import React, { useEffect, useState } from 'react'
import { AutoComplete, Button, Dropdown, Input } from 'antd'
import { LeftOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import HeadSetting from './HeadSetting'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
// import { ThemeToggle } from '@/components/layouts/theme-toggle'

type Option = {
  value: string
  label: string
}

export default function Header() {
  const { user, inputValue, setInputValue } = useStore()
  const [isClient, setIsClient] = useState(false)
  const [open, setOpen] = useState(false) // 控制用户设置抽屉
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const route = useRouter()

  const logout = async () => {
    localStorage.clear()
    await fetch('/api/logout', { method: 'POST' })
    route.push('/auth')
  }

  const items = [
    {
      key: '1',
      label: <span>设置</span>,
      onClick: () => setOpen(true),
    },
    {
      key: '2',
      label: <span onClick={logout}>退出</span>,
    },
  ]

  const handleSearch = async (value: any) => {
    if (!value) {
      setOptions([])
      return
    }
    const data = await fetch(`/api/search?q=${value}`)
    const newOptions = await data.json()
    setOptions(newOptions)
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
      <div className="flex items-center gap-[8px]">
        <Button
          type="text"
          className="relative top-[2px] h-[36px]"
          disabled={isClient && window.location.pathname === '/'}
          icon={<LeftOutlined size={12} />}
          onClick={() => route.back()}
        ></Button>
        <AutoComplete
          allowClear
          style={{ width: '300px' }}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          value={inputValue}
          onChange={handleChange}
        >
          <Input
            variant="filled"
            placeholder="搜索"
            prefix={<SearchOutlined />}
            style={{ height: '36px' }}
            onKeyDown={handleKeyDown}
          />
        </AutoComplete>
      </div>
      <div className="relative top-0.5 flex items-center gap-2">
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
              <UserOutlined className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
        </Dropdown>
        <span className="dark:text-black">{isClient && user.username}</span>
      </div>
      <HeadSetting open={open} setOpen={setOpen} />
    </div>
  )
}
