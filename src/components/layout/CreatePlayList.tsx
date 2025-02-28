'use client'
import {
  Form,
  UploadProps,
  message,
  Upload,
  UploadFile,
  Modal,
  Input,
  Select,
  Checkbox,
  Image,
} from 'antd'
import { FC, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/es/upload'
import { typeOptions } from '@/lib/const'
import useStore from '@/store/useStore'
type props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  getMyPlayList: () => void
}
const CreatePlaylist: FC<props> = ({ open, setOpen, getMyPlayList }) => {
  const { user } = useStore()
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields() // 确保字段验证通过
      const data = {
        ...values,
        isPrivate: values.isPrivate ? '1' : '0',
        img: fileList[0]?.response?.data.url || '',
        author: user.username,
        user_id: user.id,
      }
      console.log('表单数据：', data)
      setConfirmLoading(true)

      // 发送请求
      const response = await fetch('/api/playlist/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await response.json()
      console.log('响应数据：', res)
      if (res.code === 200) {
        getMyPlayList()
        message.success(res.msg)
        setOpen(false)
      } else {
        message.error(res.msg)
      }
    } catch (errorInfo) {
      message.error('请检查填写内容是否完整')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const [fileList, setFileList] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)

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
  return (
    <Modal
      title="创建歌单"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={450}
    >
      <Form form={form} name="songList">
        <Form.Item
          name={'name'}
          rules={[{ required: true, message: '歌单标题不能为空' }]}
        >
          <Input placeholder="输入歌单标题"></Input>
        </Form.Item>
        <Form.Item>
          <Upload {...uploadProps} fileList={fileList} accept="image/*">
            {fileList.length < 1 && (
              <a>
                <UploadOutlined />
                上传图片
              </a>
            )}
          </Upload>
        </Form.Item>
        {previewImage && (
          <Image
            preview={{
              visible: previewOpen,
              onVisibleChange: setPreviewOpen,
              afterOpenChange: (visible: any) =>
                !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
        <Form.Item name={'desc'}>
          <Input.TextArea
            rows={3}
            placeholder="简介 (最多输入40个字)"
            maxLength={40}
          />
        </Form.Item>
        <Form.Item name={'tags'}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择标签"
            options={typeOptions}
            maxCount={3}
          />
        </Form.Item>
        <Form.Item name={'isPrivate'} valuePropName="checked">
          <Checkbox>是否为私人歌单</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreatePlaylist
