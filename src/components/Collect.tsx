import React, { useState } from 'react'
import { Flex, Modal, notification } from 'antd'
import useStore from '@/store/useStore'
import { Fetch } from '@/lib/request'
import { useShallow } from 'zustand/react/shallow'
import Image from 'next/image'

type prop = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const Collect: React.FC<prop> = ({ open, setOpen }) => {
  const { currentId, myPlayList, triggerRefresh } = useStore(
    useShallow((store) => ({
      currentId: store.currentId,
      myPlayList: store.myPlayList,
      triggerRefresh: store.triggerRefresh,
    }))
  )
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleCancel = () => {
    setOpen(false)
  }
  const [clicked, setClicked] = useState<number | null>(null)
  const handleOk = async () => {
    setConfirmLoading(true)
    const res = await Fetch('/api/collect', {
      method: 'POST',
      body: {
        songId: currentId,
        playListId: clicked,
      },
    })

    notification.success({
      message: res.msg,
    })

    setOpen(false)
    setConfirmLoading(false)
    triggerRefresh()
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
            <Image
              width={50}
              height={50}
              src={
                item.img
                  ? item.img
                  : 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=200y200'
              }
              alt="img"
              style={{ borderRadius: '8px' }}
            />
            <div>{item.name}</div>
          </Flex>
        )
      })}
    </Modal>
  )
}

export default Collect
