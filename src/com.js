import firebase from 'firebase/app';

import 'bulma/css/bulma.css'
import React from 'react'
import Text from './text'
import Arc from './archived'

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      texts: [],
      showModal: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.out = this.out.bind(this);
  }

  out() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  hideModal() {
    this.setState({showModal: false});
    this.handleSubmit()
  }

  showModal() {
    this.setState({showModal: true});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    let db = firebase.firestore();
    let doc = db.collection('texts').doc()
    let data = {
      string: this.state.value,
      user_id: window.saveBrainAppFirebaseUser.uid,
      archived: false,
      archivedAt: new Date(2099, 3),
    }

    doc.set(data)
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
      <div className='scroll'>
        <button className='button is-medium' onClick={this.out}>out</button>
        <div className={`modal${this.state.showModal ? ' is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className='control is-loading'>
              <textarea onChange={this.handleChange} value={this.value} onBlur={this.hideModal} className='textarea' rows='12' />
            </div>
          </div>
          <button className="modal-close is-large" onClick={this.hideModal} aria-label="close"></button>
        </div>
        { this.state.texts.map(text => <Text key={text.id} data={text}/>)}
      <div className='has-text-centered'>
        <button className='button is-medium ab' onClick={this.showModal}>memo</button>
      </div>
        <Arc />
      </div>
    )
  }
}
