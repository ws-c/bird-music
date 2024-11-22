import { createFromIconfontCN } from '@ant-design/icons'
import React from 'react'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4530194_6obcq1vcvgr.js',
})

function Index(props: {
  type: string
  size: number
  color?: string
  onClick?: (e?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  rootClassName?: string
  style?: object
  alt?: string
}) {
  return (
    <IconFont
      alt=""
      type={props.type}
      style={{
        color: props.color,
        fontSize: props.size,
        ...props.style,
      }}
      className={` ${props.rootClassName}`}
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
