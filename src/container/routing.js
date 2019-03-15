import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import firebase from 'firebase/app'

import Archive from './archived'
import Texts from './texts'

export default () => {
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => setSigned(!!user))
  }, [])

  if (!signed) return <p>signing in</p>;

  return (
    <Router>
      <div>
        <Route path='/' exact component={Texts} />
        <Route path='/archives/' component={Archive} />
      </div>
    </Router>
  )
}
