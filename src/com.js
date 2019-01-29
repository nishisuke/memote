import firebase from 'firebase';

// Required for side-effects
import 'firebase/firestore';

import React from 'react'

export default class MainPage extends React.Component {
   constructor(props) {
    super(props);

    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
     this.setState({value: event.target.value});
  }

  handleSubmit() {
    let db = firebase.firestore();
    db.collection('texts').add({
      string: this.state.value
    })
  }

  render() {
    return (
      <div>
      <textarea onChange={this.handleChange} value={this.value} />
      <button onClick={this.handleSubmit}>作成</button>
      </div>
    )
  }
}
