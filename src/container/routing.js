import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import firebase from 'firebase/app'

import Archive from './archived'
import Texts from './texts'

export default () => {
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => setSigned(!!user))
  }, [])

  if (!signed) return '';

  return (
    <BrowserRouter>
      <React.Fragment>
        <Route path='/' exact component={Texts} />
        <Route path='/archives/' component={Archive} />
      </React.Fragment>
    </BrowserRouter>
  )
}
