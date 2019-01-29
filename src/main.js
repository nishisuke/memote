import React from 'react'
import ReactDOM from 'react-dom'

import initApp from './init'
import MainPage from './com'

document.addEventListener('DOMContentLoaded', initApp);

ReactDOM.render(<MainPage />, document.getElementById('main'))
