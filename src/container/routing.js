import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import firebase from 'firebase/app'

import Archive from './archived'
import Texts from './texts'

export default class Routing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      signed: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ signed: true })
      } else {
        this.setState({ signed: false })
      }
    })
  }

  render() {
    if (!this.state.signed) return <p>signing in</p>;

    return (
      <Router>
        <div>
          <Route path='/' exact component={Texts} />
          <Route path='/archives/' component={Archive} />
        </div>
      </Router>
    )
  }
}
