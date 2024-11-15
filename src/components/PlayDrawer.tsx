import { Drawer, List } from 'antd'
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
const PlayDrawer: FC<Props> = ({
  open,
  onClose,
  setCurrentId,
  onClicked,
  setOnClicked,
  setIsPlaying,
  singleList,
}) => {
  return (
    <Drawer
      title="播放列表"
      onClose={onClose}
      open={open}
      width={320}
      maskClassName="ant-mask"
      rootStyle={{
        marginTop: '64px',
        marginBottom: '81px',
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
            }}
            className={`item ${onClicked == item.id ? 'clicked' : ''}`}
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
  )
}
export default PlayDrawer
