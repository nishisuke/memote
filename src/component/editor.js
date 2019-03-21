import React, { useRef, useImperativeHandle, forwardRef } from 'react'

import { colorClass } from './comt'

const Editor = (props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }))

  return (
    <div className={`control `}>
      <textarea ref={inputRef} onBlur={props.finish} onChange={props.handleChange} value={props.value} className={`textarea has-fixed-size `} rows='12' />
    </div>
  )
}

export default forwardRef(Editor)
