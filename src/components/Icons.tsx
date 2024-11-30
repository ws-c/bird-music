import { createFromIconfontCN } from '@ant-design/icons'
import React from 'react'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4530194_42dq248ik16.js',
})

function Index(props: {
  type: string
  size: number
  color?: string
  onClick?: (e?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  className?: string
  style?: object
  alt?: string
  title?: string
}) {
  return (
    <IconFont
      title={props.title}
      alt=""
      type={props.type}
      style={{
        color: props.color,
        fontSize: props.size,
        ...props.style,
      }}
      className={` ${props.className}`}
      onClick={(e) => {
        // e.stopPropagation()
        if (props.onClick) {
          props.onClick(e)
        }
      }}
    />
  )
}

export default Index
