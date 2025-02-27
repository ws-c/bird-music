import { useState, useEffect, useRef, useLayoutEffect } from 'react'

interface LyricProps {
  lyricUrl: string
  currentTime: number
}

interface LyricLine {
  time: number
  text: string
}

const Lyric: React.FC<LyricProps> = ({ lyricUrl, currentTime }) => {
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [offset, setOffset] = useState(0)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const prevActiveIndex = useRef(-1)
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch(lyricUrl)
        const text = await response.text()
        const parsedLyrics = parseLRC(text)
        setLyrics(parsedLyrics)
      } catch (err) {
        console.error('Failed to fetch lyrics:', err)
      }
    }

    fetchLyrics()
  }, [lyricUrl])

  const parseLRC = (lrc: string): LyricLine[] => {
    const lines = lrc.split('\n')
    const lyricMap = new Map<number, string[]>()

    lines.forEach((line) => {
      const cleaned = line.trim()
      if (!cleaned) return

      const timeEnd = cleaned.indexOf(']')
      if (timeEnd === -1) return

      const timeStr = cleaned.substring(1, timeEnd)
      const [mm, ss] = timeStr.split(':').map(parseFloat)
      if (isNaN(mm) || isNaN(ss)) return

      const time = mm * 60 + ss
      const textLines = cleaned
        .slice(timeEnd + 1)
        .trim()
        .split('\n')
        .filter(Boolean)

      lyricMap.set(
        time,
        lyricMap.has(time) ? [...lyricMap.get(time)!, ...textLines] : textLines
      )
    })

    return Array.from(lyricMap)
      .map(([time, texts]) => ({ time, text: texts.join('\n') }))
      .sort((a, b) => a.time - b.time)
  }
  // 计算当前激活的歌词索引
  const activeIndex = lyrics.findIndex(
    (lyric, index) =>
      currentTime >= lyric.time &&
      (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time)
  )

  useLayoutEffect(() => {
    if (!containerRef.current || activeIndex === -1) return
    const currentLine = lineRefs.current[activeIndex]
    if (!currentLine || activeIndex === prevActiveIndex.current) return

    // 计算需要的偏移量
    const container = containerRef.current.clientHeight
    const lineTop = currentLine.offsetTop
    const lineHeight = currentLine.offsetHeight
    const newOffset = (container - lineHeight) / 2 - lineTop

    setOffset(newOffset)
    prevActiveIndex.current = activeIndex
  }, [activeIndex, lyrics])
  return (
    <div ref={containerRef} className="flex h-4/5 w-[720px] overflow-y-hidden">
      <div
        className="flex flex-col items-start transition-transform duration-500"
        style={{ transform: `translateY(${offset}px)` }}
      >
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
