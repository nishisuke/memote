import React from 'react'

import Archive from './archived'
import Main from './mainPage'

export default class SignedInContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      innerPath: this.props.path || '/main',
    }

    this.navigator = this.navigator.bind(this);

    this.isMain = this.isMain.bind(this);
    this.goMain = this.goMain.bind(this);
    this.isArchive = this.isArchive.bind(this);
    this.goArchive = this.goArchive.bind(this);
  }

  isMain() { return this.state.innerPath === '/main' }
  goMain() { this.setState({ innerPath: '/main' }) }
  isArchive() { return this.state.innerPath === '/archive' }
  goArchive() { this.setState({ innerPath: '/archive' }) }
  navigator() {
    let nav = {}
    nav.goMain = this.goMain
    nav.goArchive = this.goArchive
    return nav
  }

  render() {
    return this.isMain() ? <Main navigator={this.navigator()} />
      : (this.isArchive() ? <Archive navigator={this.navigator()} />
        : '')
  }
}
