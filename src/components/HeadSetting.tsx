import React, { useEffect, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  Input,
  Upload,
  message,
  Image,
  Space,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useStore from '@/store/useStore'
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import { Fetch } from '@/lib/request'
import ImgCrop from 'antd-img-crop'
import { toWebP } from '@/helpers/toWebp'

interface UserSettingsProps {
  open: boolean
  setOpen: (open: boolean) => void
  type: string
}

const HeadSetting: React.FC<UserSettingsProps> = ({ open, setOpen, type }) => {
  const { user, setUser } = useStore()
  const [fileList, setFileList] = useState<any[]>(
    user.cover ? [{ url: user.cover }] : []
  )
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const uploadProps: UploadProps = {
    action: '/api/common/upload_avatar',
    listType: 'picture-card' as const,
    maxCount: 1,
    beforeUpload: async (file) => {
      if (!file.type.startsWith('image/')) {
        message.error('只能上传图片')
        return Upload.LIST_IGNORE
      }
      // 转换为 WebP
      const webpFile = await toWebP(file)
      // 检查转换后的文件大小
      if (webpFile.size / 1024 > 150) {
        message.error('图片大小不能超过150KB')
        return Upload.LIST_IGNORE
      }

      return webpFile
    },
    onChange: (info: UploadChangeParam) => {
      setFileList(info.fileList)
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

  const submit = async (type: string) => {
    if (type === '1') {
      const values = await form.validateFields()
      const data = {
        ...values,
        oldName: user.username,
        cover: fileList[0]?.url || fileList[0]?.response?.data.url || '',
      }
      const res = await Fetch('/api/user/update', {
        method: 'PUT',
        body: data,
      })
      if (!res.success) return
      message.success(res.msg)
      setUser(res.data)
    } else {
      const values = await passwordForm.validateFields()
      const data = {
        ...values,
        id: user.id,
      }
      const res = await Fetch('/api/user/updatePassword', {
        method: 'PUT',
        body: data,
      })
      message.success(res.msg)
    }
    setOpen(false)
  }
  useEffect(() => {
    form.resetFields()
    setFileList(user.cover ? [{ url: user.cover }] : [])
  }, [open])
  return (
    <Drawer
      title={type === '1' ? '修改资料' : '设置密码'}
      width={450}
      onClose={() => setOpen(false)}
      open={open}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => submit(type)} type="primary">
            保存
          </Button>
        </Space>
      }
    >
      {type === '1' && (
        <Form
          form={form}
          name="userForm"
          layout="vertical"
          initialValues={{
            username: user.username,
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            style={{ width: '60%' }}
            rules={[
              { required: true, message: '请输入用户名' },
              { max: 16, message: '用户名长度不能超过20个字符' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="头像">
            <ImgCrop>
              <Upload {...uploadProps} fileList={fileList} accept="image/*">
                {fileList.length < 1 && (
                  <a>
                    <UploadOutlined />
                    上传头像
                  </a>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              width={200}
              alt="头像"
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
      )}
      {type === '2' && (
        <Form form={passwordForm} name="userForm" layout="vertical">
          <Form.Item
            label="原密码"
            name="password"
            style={{ width: '60%' }}
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input type="password" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            style={{ width: '60%' }}
            rules={[
              {
                required: true,
                message: '请输入新密码, 长度6-20位',
                min: 6,
                max: 20,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            validateTrigger={['onBlur', 'onSubmit']}
            style={{ width: '60%' }}
            dependencies={['newPassword']} // 依赖项声明
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}

export default HeadSetting
