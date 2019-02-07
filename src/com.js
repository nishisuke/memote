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
      user_id: window.saveBrainAppFirebaseUser.uid,
      archived: false
    }

    hoge.set(data)
    //  .then(() => {
    //  this.setState({ texts: [...this.state.texts, {...data, id: hoge.id}]})
    //}).catch(e => {
    //  console.log(e)
    //  console.log('text write fail')
    //})
  }

  componentDidMount() {
    let db = firebase.firestore();
    let query = db.collection("texts")
      .where("user_id", "==", window.saveBrainAppFirebaseUser.uid)
      .where('archived', '==', false)

    query.onSnapshot({includeMetadataChanges: true}, snapshot => {
        snapshot.docChanges().forEach(change => {
          console.log(change.type)
          if (change.type === "added") {
            this.setState({ texts: [...this.state.texts, {...change.doc.data(), id: change.doc.id}]})

            // console.log(snapshot.metadata.hasPendingWrites)
            
          var source = snapshot.metadata.fromCache ? "local cache" : "server";
      //    console.log("Data came from " + source);

          }
          if (change.type === "removed") {
            let ho = this.state.texts.filter(t => (t.id != change.doc.id))
            this.setState({ texts: [...ho]})
          }
      });
    })
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
