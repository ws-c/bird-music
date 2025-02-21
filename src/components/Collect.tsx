import React, { useState } from 'react'
import { Flex, Modal, notification } from 'antd'
import useStore from '@/store/useStore'

type prop = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const Collect: React.FC<prop> = ({ open, setOpen }) => {
  const { currentId, myPlayList, triggerRefresh } = useStore()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleCancel = () => {
    setOpen(false)
  }
  const [clicked, setClicked] = useState<number | null>(null)
  const handleOk = () => {
    setConfirmLoading(true)
    fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        songId: currentId,
        playListId: clicked,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code == 200) {
          notification.success({
            message: res.msg,
          })
        } else {
          notification.error({
            message: res.msg,
          })
        }
      })
      .finally(() => {
        setOpen(false)
        setConfirmLoading(false)
        triggerRefresh()
      })
  }

  return (
    <Modal
      title="收藏到歌单"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {myPlayList.map((item) => {
        return (
          <Flex
            key={item.id}
            gap={16}
            style={{ marginTop: '8px', padding: '8px' }}
            onClick={() => setClicked(item.id)}
            className={`item ${clicked == item.id ? 'clicked' : ''}`}
          >
            <img
              src={
                item.img
                  ? item.img
                  : 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=200y200'
              }
              alt="img"
              style={{ width: '50px', height: '50px', borderRadius: '8px' }}
            />
            <div>{item.name}</div>
          </Flex>
        )
      })}
    </Modal>
  )
}

export default Collect
