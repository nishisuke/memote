import React from 'react'
import ReactGA from 'react-ga';

import SP from './sp'
import PC from './pc'

export default () => {
  React.useEffect(() => {
    ReactGA.pageview('/texts')
  }, [])
  return window.innerWidth < 560 ? <SP /> : <PC />
}