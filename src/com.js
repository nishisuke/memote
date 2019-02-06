import firebase from 'firebase';

import React from 'react'
import Text from './text'

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      texts: []
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
    let data = {
      string: this.state.value,
      user_id: window.saveBrainAppFirebaseUser.uid
    }

    hoge.set(data).then(() => {
      this.setState({ texts: [...this.state.texts, {...data, id: hoge.id}]})
    }).catch(e => {
      console.log(e)
      console.log('text write fail')
    })
  }

  componentDidMount() {
    let db = firebase.firestore();
    let user = db.collection("texts").where("user_id", "==", window.saveBrainAppFirebaseUser.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());

          let arr = this.state.texts.filter(text => (text.id != doc.id))
          this.setState({ texts: [...arr, {...doc.data(), write: true, id: doc.id}]})
        });

      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  render() {
    return (
      <div>
      { this.state.texts.map(text => <Text key={text.id} data={text}/>)}
      <textarea onChange={this.handleChange} value={this.value} />
      <button onClick={this.handleSubmit}>作成</button>
      </div>
    )
  }
}
