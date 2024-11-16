import { Drawer, Flex, List } from 'antd'
import { formatTime } from '../utils/formatTime'
import { FC } from 'react'
import myStyle from './PlayDrawer.module.css'
type Props = {
  open: boolean
  onClose: () => void
  setCurrentId: (id: string) => void
  onClicked: string | null
  setOnClicked: (id: string) => void
  setIsPlaying: (isPlaying: boolean) => void
  singleList: any[]
  isPlaying: boolean
}
const PlayDrawer: FC<Props> = ({
  open,
  onClose,
  setCurrentId,
  onClicked,
  setOnClicked,
  setIsPlaying,
  singleList,
  isPlaying
}) => {
  return (
    <Drawer
      title="播放列表"
      onClose={onClose}
      open={open}
      width={360}
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
              padding: '4px 16px',
              marginBottom: '8px',
              overflow: 'hidden',
            }}
            className={`item ${onClicked == item.id ? 'clicked' : ''}`}
            onClick={() => {
              setCurrentId(item.id)
              setOnClicked(item.id)
              setIsPlaying(true)
            }}
          >
            {onClicked == item.id && isPlaying ? (
              <Flex align="flex-end" style={{ marginRight: '8px' }}>
                <div className={myStyle.loading}>
                  <div className={myStyle.load}></div>
                  <div className={myStyle.load}></div>
                  <div className={myStyle.load}></div>
                  <div className={myStyle.load}></div>
                </div>
              </Flex>
            ) : (
              <Flex
                align="center"
                style={{ marginRight: '8px', height: '100%' }}
              >
                <div className={myStyle.play}></div>
              </Flex>
            )}

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
