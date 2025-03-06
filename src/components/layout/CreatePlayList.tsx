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
import { Fetch } from '@/lib/request'
import ImgCrop from 'antd-img-crop'
import { toWebP } from '@/helpers/toWebp'

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
    const values = await form.validateFields() // 确保字段验证通过
    const data = {
      ...values,
      isPrivate: values.isPrivate ? '1' : '0',
      img: fileList[0]?.response?.data.url || '',
      author: user.username,
      user_id: user.id,
    }
    setConfirmLoading(true)

    // 发送请求
    const res = await Fetch('/api/playlist/create', {
      method: 'POST',
      body: data,
    })

    if (res.code === 200) {
      getMyPlayList()
      message.success(res.msg)
      setOpen(false)
    }

    setConfirmLoading(false)
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
      setFileList(info.fileList) // 更新文件
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
          <ImgCrop>
            <Upload {...uploadProps} fileList={fileList} accept="image/*">
              {fileList.length < 1 && (
                <a>
                  <UploadOutlined />
                  上传图片
                </a>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        {previewImage && (
          <Image
            alt="歌单图片"
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
