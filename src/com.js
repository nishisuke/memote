import firebase from 'firebase';

// Required for side-effects
import 'firebase/firestore';

import React from 'react'
import Text from './text'

export default class MainPage extends React.Component {
   constructor(props) {
    super(props);

    this.state = {
      value: '',
      ids: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
     this.setState({value: event.target.value});
  }

  handleSubmit() {
    let db = firebase.firestore();
    let hoge = db.collection('texts').doc()
      hoge.set({
      string: this.state.value,
      user_id: window.saveBrainAppFirebaseUser.uid
    })
    this.setState({ids: [...this.state.ids, hoge.id]})
  }

  componentDidMount() {
    let db = firebase.firestore();
    let user = db.collection("texts").where("user_id", "==", window.saveBrainAppFirebaseUser.uid)
      .get()
      .then(querySnapshot => {
	querySnapshot.forEach(doc => {
	  // doc.data() is never undefined for query doc snapshots
	  // console.log(doc.id, " => ", doc.data());
	  this.setState({ ids: [...this.state.ids, doc.id]})
	});

      })
      .catch(function(error) {
	console.log("Error getting documents: ", error);
      });
  }

  render() {
    return (
      <div>
      { this.state.ids.map(id => <Text key={id} id={id}/>)}
      <textarea onChange={this.handleChange} value={this.value} />
      <button onClick={this.handleSubmit}>作成</button>
      </div>
    )
  }
}
