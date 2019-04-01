import React from 'react'

import SP from './sp'
import PC from './pc'

export default () => {
  return window.innerWidth < 560 ? <SP /> : <PC />
}
