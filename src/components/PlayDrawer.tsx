import { Drawer, Flex, List } from 'antd'
import { formatTime } from '@/helpers/formatTime'
import { FC } from 'react'
// import styles from './PlayDrawer.module.css'
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
const PlayDrawer: FC<Props> = ({
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
    <Drawer
      title="播放列表"
      onClose={onClose}
      open={open}
      width={360}
      maskClassName="ant-mask"
      rootStyle={{
        marginTop: '64px',
        marginBottom: '93px',
      }}
    >
      <div className="flex flex-col">
        {singleList.map((item) => (
          <div
            key={item.id}
            className={`flex cursor-pointer items-center gap-[8px] border-none bg-transparent px-4 py-2 transition-all duration-500 ease-in-out ${onClicked === item.id ? 'clicked' : 'item'}`}
            onClick={() => {
              setCurrentId(item.id)
              setOnClicked(item.id)
              setIsPlaying(true)
            }}
          >
            {/* {onClicked === item.id && isPlaying ? (
                <div className="mr-1 flex items-end">
                  <div className="ml-1 mt-4 flex rotate-180 transform">
                    <div className="animate-move6 my-[0.1em] h-[0.2em] w-[2px] rounded-[5px] bg-[#f30074] delay-200"></div>
                    <div className="animate-move6 delay-400 my-[0.1em] h-[0.2em] w-[2px] rounded-[5px] bg-[#f30074]"></div>
                    <div className="animate-move6 delay-600 my-[0.1em] h-[0.2em] w-[2px] rounded-[5px] bg-[#f30074]"></div>
                    <div className="animate-move6 my-[0.1em] h-[0.2em] w-[2px] rounded-[5px] bg-[#f30074]"></div>
                  </div>
                </div>
              ) : (
                <div className=" flex h-full items-center">
                  <div className="clip-path-polygon-50-50-100-50-75-6.6 relative left-[-0.35em] mt-[-0.7em] h-[1.6em] w-[1.6em] rotate-90 transform self-center justify-self-center bg-white"></div>
                </div>
              )} */}
            <div className="flex-shrink-0">
              <img
                src={item.cover}
                className="relative h-[40px] w-[40px] rounded-[4px]"
                alt={item.song_title}
              />
            </div>
            <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="font-medium text-black">{item.song_title}</div>
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
  )
}
export default PlayDrawer
