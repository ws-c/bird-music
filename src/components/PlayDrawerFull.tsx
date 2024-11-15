import { ConfigProvider, Drawer, List } from 'antd'
import { formatTime } from '../utils/formatTime'
import { FC } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  setCurrentId: (id: string) => void
  onClicked: string | null
  setOnClicked: (id: string) => void
  setIsPlaying: (isPlaying: boolean) => void
  singleList: any[]
}
const PlayDrawerFull: FC<Props> = ({
  open,
  onClose,
  setCurrentId,
  onClicked,
  setOnClicked,
  setIsPlaying,
  singleList,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: 'rgba(255, 255, 255, 0.88)',
          colorIcon: 'rgba(255, 255, 255, 0.88)',
          colorIconHover: 'rgba(0, 0, 0, 0.45)',
          colorTextDescription: 'rgba(255, 255, 255, 0.45)'
        },
      }}
    >
      <Drawer
        title="播放列表"
        onClose={onClose}
        open={open}
        width={400}
        maskClassName="ant-mask"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <List
          dataSource={singleList}
          renderItem={(item) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '0px 8px',
                marginBottom: '8px',
                backgroundColor: 'transparent',
              }}
              className={`item ${onClicked == item.id ? 'clicked2' : ''}`}
              onClick={() => {
                setCurrentId(item.id)
                setOnClicked(item.id)
                setIsPlaying(true)
              }}
            >
              <List.Item.Meta
                avatar={
                  <img
                    src={item.cover}
                    style={{
                      position: 'relative',
                      top: '4px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                    }}
                  ></img>
                }
                title={item.song_title}
                description={item.name}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              <div>{formatTime(item.duration)}</div>
            </List.Item>
          )}
        />
      </Drawer>
    </ConfigProvider>
  )
}
export default PlayDrawerFull
