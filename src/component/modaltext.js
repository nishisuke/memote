import React from 'react'

import { colorClass } from './comt'

export default props => {
  return (
    <div className={`control `}>
      <textarea id='ta' onChange={props.handleChange} value={props.value} className={`textarea has-fixed-size `} rows='12' />
    </div>
  )
}
