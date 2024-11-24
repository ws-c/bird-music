'use client'
import React, { useEffect, useState } from 'react'
import {
  AutoComplete,
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Form,
  Space,
  Upload,
  Image,
  message,
} from 'antd'
import {
  LeftOutlined,
  SearchOutlined,
  UserOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import styles from './Header.module.css'
import Input from 'antd/es/input/Input'
import { useRouter } from 'next/navigation'
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import useStore from '../store/useStore'
type Option = {
  value: string
  label: string
}

export default function Header() {
  const { user, setUser, inputValue, setInputValue } = useStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const route = useRouter()
  const logout = async () => {
    localStorage.clear()
    await fetch('/api/logout', { method: 'POST' })
    route.push('/auth')
  }
  //用户设置
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  // 用户下拉菜单
  const items = [
    {
      key: '1',
      label: <span>设置</span>,
      onClick: showDrawer,
    },
    {
      key: '2',
      label: <span onClick={logout}>退出</span>,
    },
  ]
  const [options, setOptions] = useState<Option[]>([])

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
  // 用户设置
  const [fileList, setFileList] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [form] = Form.useForm()
  const uploadProps: UploadProps = {
    action: '/api/common/upload_playlist',
    listType: 'picture-card' as 'picture-card',
    maxCount: 1,
    beforeUpload: (file: { type: string; size: number }) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片')
        return Upload.LIST_IGNORE
      }
      const isWithinSizeLimit = file.size / 1024 <= 300 // 限制文件大小为 300KB
      if (!isWithinSizeLimit) {
        message.error('图片大小不能超过300KB')
        return Upload.LIST_IGNORE
      }
      return true // 文件符合要求
    },
    onChange: (info: UploadChangeParam) => {
      setFileList(info.fileList) // 更新文件列表
    },
    onPreview: async (file: UploadFile<any>) => {
      const imageUrl =
        file.url ||
        file.preview ||
        (await new Promise<string>((resolve) => {
          const reader = new FileReader()
          if (file.originFileObj) {
            reader.readAsDataURL(file.originFileObj)
          } else {
            message.error('文件对象不存在')
          }
          reader.onload = () => resolve(reader.result as string)
        }))
      setPreviewImage(imageUrl)
      setPreviewOpen(true)
    },
  }
  const submit = async () => {
    try {
      const values = await form.validateFields() // 确保字段验证通过
      const data = {
        ...values,
        oldName: user.username,
        cover: fileList[0]?.response?.data.url || '',
      }
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      if (res.code === 200) {
        message.success(res.msg)
        setUser(res.data)
        setOpen(false)
      } else {
        message.error(res.error)
      }
    } catch (errorInfo) {
      console.log('验证失败：', errorInfo)
      message.error('请检查填写内容是否完整')
    }
  }
  useEffect(() => {
    if (!open) {
      // 重置表单和状态
      form.resetFields()
      setFileList([])
      setPreviewImage('')
      setPreviewOpen(false)
    }
  }, [open, form])
  return (
    <Flex className={styles.header}>
      <Flex align="center" gap={8}>
        <Button
          style={{ position: 'relative', top: '2px', height: '36px' }}
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
            placeholder="搜索"
            prefix={<SearchOutlined />}
            style={{ height: '36px' }}
            onKeyDown={handleKeyDown}
          />
        </AutoComplete>
      </Flex>
      <div className={styles.right}>
        <span>{isClient && user.username}</span>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Avatar
            src={isClient && user.cover}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
        </Dropdown>
      </div>
      <Drawer
        title="用户设置"
        width={450}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={submit} type="primary">
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          name="userForm"
          layout="vertical"
          variant="filled"
          initialValues={{
            username: user.username,
          }}
        >
          <Form.Item
            label="用户名"
            name={'username'}
            style={{ width: '60%' }}
            rules={[
              { required: true, message: '请输入用户名' },
              { max: 16, message: '用户名长度不能超过16个字符' },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item label="头像">
            <Upload {...uploadProps} fileList={fileList} accept="image/*">
              {fileList.length < 1 && (
                <a>
                  <UploadOutlined />
                  上传头像
                </a>
              )}
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              width={200}
              preview={{
                visible: previewOpen,
                onVisibleChange: setPreviewOpen,
                afterOpenChange: (visible: any) =>
                  !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </Form>
      </Drawer>
    </Flex>
  )
}
