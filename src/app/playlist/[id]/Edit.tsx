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
  Button,
  Popconfirm,
} from 'antd'
import { FC, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/es/upload'
import type { Playlist } from './page'
import { useRouter } from 'next/navigation'
import { typeOptions } from '@/lib/const'
import { Fetch } from '@/lib/request'

type props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  fetchAllData: () => void
  playList: Playlist
}
const Edit: FC<props> = ({ open, setOpen, name, fetchAllData, playList }) => {
  const nav = useRouter()
  const [form] = Form.useForm()

  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = async () => {
    const values = await form.validateFields() // 确保字段验证通过
    const data = {
      ...values,
      isPrivate: values.isPrivate ? '1' : '0',
      img: fileList[0]?.url || fileList[0]?.response?.data.url || '',
      author: name,
      id: playList.id,
    }
    console.log('表单数据：', data)
    setConfirmLoading(true)

    // 发送请求
    const res = await Fetch('/api/playlist/update', {
      method: 'POST',
      body: data,
    })

    console.log('响应数据：', res)
    fetchAllData()
    message.success(res.msg)
    setOpen(false)
    setConfirmLoading(false)
  }

  const handleCancel = () => {
    setOpen(false)
    form.resetFields()
  }

  const [fileList, setFileList] = useState<any[]>(
    playList.img ? [{ url: playList.img }] : []
  )
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
  const confirmDelete = async () => {
    await Fetch('/api/playlist/delete', {
      method: 'DELETE',
      body: { id: +playList.id },
    })

    nav.push('/')
  }
  return (
    <Modal
      title="修改歌单"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={500}
      footer={[
        <div key="footer" className="flex w-full justify-between">
          <Popconfirm
            key="popconfirm"
            title="删除歌单"
            description="你是否确定要删除这个歌单？"
            onConfirm={confirmDelete}
          >
            <Button type="primary">删除歌单</Button>
          </Popconfirm>
          <div className="flex gap-2">
            <Button key="cancel" onClick={handleCancel}>
              取消
            </Button>
            <Button
              key="ok"
              type="primary"
              loading={confirmLoading}
              onClick={handleOk}
            >
              确认
            </Button>
          </div>
        </div>,
      ]}
    >
      <Form
        form={form}
        name="songList"
        initialValues={{
          ...playList,
          isPrivate: playList.isPrivate === '1',
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="歌单标题"
          name={'name'}
          rules={[{ required: true, message: '歌单标题不能为空' }]}
        >
          <Input
            placeholder="输入歌单标题 (最多输入20个字)"
            maxLength={20}
          ></Input>
        </Form.Item>
        <Form.Item label="歌单封面">
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
            alt='歌单图片'
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: setPreviewOpen,
              afterOpenChange: (visible: any) =>
                !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
        <Form.Item name={'desc'} label="简介">
          <Input.TextArea
            rows={3}
            placeholder="简介 (最多输入60个字)"
            maxLength={60}
          />
        </Form.Item>
        <Form.Item name={'tags'} label="标签">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择标签"
            options={typeOptions}
            maxCount={3}
          />
        </Form.Item>
        <Form.Item
          name={'isPrivate'}
          valuePropName="checked"
          label="私人歌单："
        >
          <Checkbox></Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Edit
