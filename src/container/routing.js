import React from 'react'
import firebase from 'firebase/app'

import Archive from './archived'
import Texts from './texts'

export default class Routing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      innerPath: this.props.path || '/texts',
      signed: false,
    }

    this.isMain = this.isMain.bind(this);
    this.goMain = this.goMain.bind(this);
    this.isArchive = this.isArchive.bind(this);
    this.goArchive = this.goArchive.bind(this);
  }

  isMain() { return this.state.innerPath === '/texts' }
  goMain() { this.setState({ innerPath: '/texts' }) }
  isArchive() { return this.state.innerPath === '/archive' }
  goArchive() { this.setState({ innerPath: '/archive' }) }
  get navigator() {
    let nav = {}
    nav.goMain = this.goMain
    nav.goArchive = this.goArchive
    return nav
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

    return this.isMain() ? <Texts navigator={this.navigator} />
      : (this.isArchive() ? <Archive navigator={this.navigator} />
        : '')
  }
}
