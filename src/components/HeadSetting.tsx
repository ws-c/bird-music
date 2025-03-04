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

interface UserSettingsProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const HeadSetting: React.FC<UserSettingsProps> = ({ open, setOpen }) => {
  const { user, setUser } = useStore()
  const [fileList, setFileList] = useState<any[]>(
    user.cover ? [{ url: user.cover }] : []
  )
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [form] = Form.useForm()

  const uploadProps: UploadProps = {
    action: '/api/common/upload_playlist',
    listType: 'picture-card' as const,
    maxCount: 1,
    beforeUpload: (file: { type: string; size: number }) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片')
        return Upload.LIST_IGNORE
      }
      const isWithinSizeLimit = file.size / 1024 <= 300
      if (!isWithinSizeLimit) {
        message.error('图片大小不能超过300KB')
        return Upload.LIST_IGNORE
      }
      return true
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

  const submit = async () => {
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

    message.success(res.msg)
    setUser(res.data)
    setOpen(false)
  }
  useEffect(() => {
    form.resetFields()
    setFileList(user.cover ? [{ url: user.cover }] : [])
  }, [open])
  return (
    <Drawer
      title="用户设置"
      width={450}
      onClose={() => setOpen(false)}
      open={open}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>取消</Button>
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
            { max: 16, message: '用户名长度不能超过16个字符' },
          ]}
        >
          <Input />
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
            wrapperStyle={{ display: 'none' }}
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
  )
}

export default HeadSetting
