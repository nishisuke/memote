import React from 'react'
import firebase from 'firebase';

export default class Text extends React.Component {
   constructor(props) {
    super(props);

    this.state = {
    };

    this.archive = this.archive.bind(this);
  }

  archive() {
    let db = firebase.firestore();
    let text = db.collection('texts').doc(this.props.data.id)
    text.update({ archived: true, archivedAt: new Date() })
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
      {`${this.props.data.write}: ${this.props.data.string}`}
      <button onClick={this.archive}>x</button>
      </div>
    )
  }
}
