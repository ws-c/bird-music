import { ConfigProvider, Drawer } from 'antd'
import { formatTime } from '@/helpers/formatTime'
import { FC } from 'react'
import styles from './PlayDrawer.module.css'
import Image from 'next/image'
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
        <div className="flex flex-col">
          {singleList.map((item) => (
            <div
              key={item.id}
              className={`flex cursor-pointer items-center gap-[8px] border-none bg-transparent px-4 py-2 transition-all duration-500 ease-in-out ${onClicked === item.id ? 'clicked2' : 'item2'}`}
              onClick={() => {
                setCurrentId(item.id)
                setOnClicked(item.id)
                setIsPlaying(true)
              }}
            >
              {onClicked == item.id && isPlaying ? (
                <div className="relative right-1 w-6">
                  <div className={styles.playing}>
                    <div
                      className={`${styles.lineContainer} ${styles['line-1']}`}
                    ></div>
                    <div
                      className={`${styles.lineContainer} ${styles['line-2']}`}
                    ></div>
                    <div
                      className={`${styles.lineContainer} ${styles['line-3']}`}
                    ></div>
                    <div
                      className={`${styles.lineContainer} ${styles['line-4']}`}
                    ></div>
                    <div
                      className={`${styles.lineContainer} ${styles['line-5']}`}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="align-center flex w-6">
                  <div
                    className={styles.play}
                    style={{ backgroundColor: '#fff' }}
                  ></div>
                </div>
              )}
              <div className="flex-shrink-0">
                <Image
                  width={40}
                  height={40}
                  src={item.cover}
                  className="relative rounded-[4px]"
                  alt={item.song_title}
                />
              </div>
              <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="font-medium text-white">{item.song_title}</div>
                <div className="text-sm text-gray-400">
                  {item.song_artists.map(
                    (artist: any, index: number, self: any) => (
                      <span key={artist.artist_id}>
                        {artist.artists.name}
                        {index < self.length - 1 && '/'}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-300">
                {formatTime(item.duration)}
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </ConfigProvider>
  )
}

export default PlayDrawerFull
