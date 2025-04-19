import { Fetch } from '@/lib/request'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import useStore from '@/store/useStore'

interface LyricProps {
  lyricUrl: string
  currentTime: number
}

interface LyricLine {
  time: number
  text: string
}

const Lyric: React.FC<LyricProps> = ({ lyricUrl, currentTime }) => {
  const currentId = useStore((store) => store.currentId)
  const prevCurrentId = useRef<number>()
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const prevActiveIndex = useRef(-1)
  const lastScrollTime = useRef(0)
  const scrollTimer = useRef<NodeJS.Timeout | null>(null)
  const activeIndexRef = useRef(-1)

  useEffect(() => {
    const fetchLyrics = async () => {
      const text = await Fetch(lyricUrl, { responseType: 'text' })
      const parsedLyrics = parseLRC(text)
      setLyrics(parsedLyrics)
    }

    fetchLyrics()
  }, [lyricUrl])

  const parseLRC = (lrc: string): LyricLine[] => {
    const lines = lrc.split('\n')
    const lyricMap = new Map<number, string[]>()

    lines.forEach((line) => {
      const timeEnd = line.indexOf(']')

      const timeStr = line.substring(1, timeEnd)
      const [mm, ss] = timeStr.split(':').map(parseFloat)

      const time = mm * 60 + ss
      const textLines = line.slice(timeEnd + 1).split('\n')

      lyricMap.set(
        time,
        lyricMap.has(time) ? [...lyricMap.get(time)!, ...textLines] : textLines
      )
    })

    return Array.from(lyricMap).map(([time, texts]) => ({
      time,
      text: texts.join('\n'),
    }))
  }

  // 使用二分查找优化歌词索引定位
  const findActiveIndex = (lyrics: LyricLine[], currentTime: number) => {
    let low = 0
    let high = lyrics.length - 1
    let result = -1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const current = lyrics[mid].time

      if (current <= currentTime) {
        result = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    // 检查下一条歌词是否超过当前时间
    if (result !== -1 && result < lyrics.length - 1) {
      return lyrics[result + 1].time > currentTime ? result : -1
    }
    return result
  }

  const activeIndex = findActiveIndex(lyrics, currentTime)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      lastScrollTime.current = Date.now()

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }

      scrollTimer.current = setTimeout(() => {
        const currentLine = lineRefs.current[activeIndexRef.current]
        if (!currentLine || !containerRef.current) return

        const container = containerRef.current
        const lineTop = currentLine.offsetTop
        const lineHeight = currentLine.offsetHeight
        const containerHeight = container.clientHeight
        const targetScrollTop = lineTop - (containerHeight - lineHeight) / 2

        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        })
      }, 2000)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [])
  // 当歌曲ID变化时立即重置滚动位置
  useEffect(() => {
    if (
      prevCurrentId.current !== undefined &&
      prevCurrentId.current !== currentId
    ) {
      containerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      prevActiveIndex.current = -1 // 重置历史索引
      activeIndexRef.current = -1
    }
    prevCurrentId.current = currentId
  }, [currentId])
  useLayoutEffect(() => {
    if (!containerRef.current || activeIndex === -1) return
    const currentLine = lineRefs.current[activeIndex]
    if (!currentLine || activeIndex === prevActiveIndex.current) return

    const now = Date.now()
    const timeSinceLastScroll = now - lastScrollTime.current

    if (timeSinceLastScroll >= 2000) {
      const container = containerRef.current
      const lineTop = currentLine.offsetTop
      const lineHeight = currentLine.offsetHeight
      const containerHeight = container.clientHeight
      const targetScrollTop = lineTop - (containerHeight - lineHeight) / 2

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      })
    }

    prevActiveIndex.current = activeIndex
  }, [activeIndex, lyrics])

  return (
    <div
      ref={containerRef}
      className="lyric-container flex h-[76%] w-[720px] overflow-y-auto"
    >
      <div className="flex flex-col items-start">
        {lyrics.map((lyric, index) => {
          const isActive = activeIndex === index

          return (
            <div
              ref={(el) => {
                lineRefs.current[index] = el
              }}
              key={index}
              className={`lyric-line whitespace-pre-line px-4 py-2 text-left text-2xl text-white transition-all duration-500 ${
                !isActive && 'text-lg opacity-50'
              }`}
            >
              {lyric.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Lyric
