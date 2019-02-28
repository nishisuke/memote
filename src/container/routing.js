import React from 'react'

import Archive from './archived'
import Texts from './texts'

export default class Routing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      innerPath: this.props.path || '/texts',
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

  render() {
    return this.isMain() ? <Texts navigator={this.navigator} />
      : (this.isArchive() ? <Archive navigator={this.navigator} />
        : '')
  }
}
