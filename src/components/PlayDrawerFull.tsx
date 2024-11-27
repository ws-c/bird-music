import { ConfigProvider, Drawer, Flex, List } from 'antd'
import { formatTime } from '@/helpers/formatTime'
import { FC } from 'react'
// import myStyle from './playDrawerFull.module.css'
type Props = {
  open: boolean
  onClose: () => void
  setCurrentId: (id: number) => void
  onClicked: number
  setOnClicked: (id: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  singleList: any[]
  isPlaying: boolean
}
const PlayDrawerFull: FC<Props> = ({
  open,
  onClose,
  setCurrentId,
  onClicked,
  setOnClicked,
  setIsPlaying,
  singleList,
  isPlaying,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: 'rgba(255, 255, 255, 0.88)',
          colorIcon: 'rgba(255, 255, 255, 0.88)',
          colorIconHover: 'rgba(0, 0, 0, 0.45)',
          colorTextDescription: 'rgba(255, 255, 255, 0.45)',
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
                padding: '4px 16px',
                marginBottom: '8px',
                backgroundColor: 'transparent',
                border: 'none',
              }}
              className={`item2 ${onClicked == item.id ? 'clicked2' : ''}`}
              onClick={() => {
                setCurrentId(item.id)
                setOnClicked(item.id)
                setIsPlaying(true)
              }}
            >
              {/* {onClicked == item.id && isPlaying ? (
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
              )} */}
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
                description={item.song_artists.map(
                  (item: any, index: number, self: string | any[]) => (
                    <span key={item.artist_id}>
                      {item.artists.name}
                      {index < self.length - 1 && '/'}
                    </span>
                  )
                )}
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
