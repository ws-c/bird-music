'use client'
import {
  Form,
  SelectProps,
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

type props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  getMyPlayList: () => void
}
const CreatePlaylist: FC<props> = ({ open, setOpen, name, getMyPlayList }) => {
  const [form] = Form.useForm()

  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = async () => {
    // 验证表单字段
    const values = await {
      ...form.getFieldsValue(),
      img: fileList[0].response.data.url || '',
      author: name,
    }
    console.log('表单数据：', values)
    setConfirmLoading(true)
    try {
      // 发送请求
      const response = await fetch('/api/playlist/create', {
        method: 'POST',
        body: JSON.stringify(values),
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
      console.log('验证失败：', errorInfo)
      message.error('请求失败，请稍后再试') // 提供错误反馈给用户
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }

  const [isPrivate, setIsPrivate] = useState(false)
  const handleChange = () => {
    setIsPrivate(!isPrivate)
  }
  const options: SelectProps['options'] = [
    { label: '电子', value: '电子' },
    { label: '民谣', value: '民谣' },
    { label: '摇滚', value: '摇滚' },
    { label: '流行', value: '流行' },
    { label: '古典', value: '古典' },
    { label: '说唱', value: '说唱' },
  ]
  const handleChange2 = (value: string[]) => {
    console.log(`selected ${value}`)
  }

  const [fileList, setFileList] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)

  const uploadProps: UploadProps = {
    action: '/api/common/upload',
    listType: 'picture-card' as 'picture-card', // 明确指定为符合 UploadListType 类型
    maxCount: 1,
    beforeUpload: (file: { type: string }) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片')
      }
      return isImage || Upload.LIST_IGNORE // 避免非图片文件继续上传
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
      <Form form={form} name="songList" initialValues={{ tags: ['电子'] }}>
        <Form.Item
          name={'name'}
          rules={[{ required: true, message: '歌单标题不能为空' }]}
        >
          <Input placeholder="输入歌单标题"></Input>
        </Form.Item>
        <Form.Item>
          <Upload {...uploadProps} fileList={fileList} accept="image/*">
            {fileList.length < 1 && (
              <div>
                <UploadOutlined />
                上传图片
              </div>
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
            onChange={handleChange2}
            options={options}
            maxCount={3}
          />
        </Form.Item>
        <Form.Item name={'private'} valuePropName="checked">
          <Checkbox checked={isPrivate} onChange={handleChange}>
            是否为私人歌单
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreatePlaylist
