import firebase from 'firebase';

import React from 'react'

export default class Archived extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showArchived: false
    };
    this.toggleArchive = this.toggleArchive.bind(this);
  }

  toggleArchive() {
    this.setState({ showArchived: !this.state.showArchived })
  }

  render() {
    return (
      <div>
      <button onClick={this.toggleArchive}>archive</button>
      <p>{ this.state.showArchived ? 'ge' : 'ho'}</p>
      </div>
    )
  }
}
