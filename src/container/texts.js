import React from 'react'
import firebase from 'firebase/app'

import db from '../db'
import Texts from '../component/texts'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      texts: [],
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let unsubscribe = db.subscribeMemos((id, data, isRemoved, meta) => {
          let removed = this.state.texts.filter(t => (t.id != id))
          if (!isRemoved) { removed.push({...data, id: id }) }
          this.setState({ texts: removed })
        })
        this.setState({ unsubscribeFunc: unsubscribe })
      } else {
        if (this.state.unsubscribeFunc) { this.state.unsubscribeFunc() }
        this.setState({ texts: [] })
      }
    })
  }

  componentWillUnmount() {
    if (this.state.unsubscribeFunc) { this.state.unsubscribeFunc() }
  }

  render() {
    return <Texts texts={this.state.texts} />
  }
}
