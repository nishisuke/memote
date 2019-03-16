import React, { useState, useEffect } from 'react'
import db from '../db'

import { colorClass } from './comt'

export default props => {
  const [text, change] = useState(props.defaultValue);

  useEffect(() => {
    props.changedCallback(text)
  }, [text])

  return (
    <div className={`control `}>
      <textarea id='ta' onChange={e => change(e.target.value)} value={text} className={`textarea has-fixed-size `} rows='12' />
    </div>
  )
}
