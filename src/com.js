import firebase from 'firebase/app';

import React from 'react'
import Text from './text'
import OpenedModal from './modal'
import Arc from './archived'

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      texts: [],
      showModal: false,
    };

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
  }

  showModal(id, doc) {
    return () => {
      this.setState({
        modalID: id,
        modalDoc: doc,
        showModal: true,
      });
    }
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

        if (change.type === 'modified') {
          let ho = this.state.texts.filter(t => (t.id != change.doc.id))
          this.setState({ texts: [...ho, {...change.doc.data(), id: change.doc.id }] })
        }
        
        if (change.type === "removed") {
          let ho = this.state.texts.filter(t => (t.id != change.doc.id))
          this.setState({ texts: [...ho]})
        }
      });
    })
  }

//        <p>{window.outerHeight}</p>
//        <p>{screen.height}</p>
//        <p>{screen.availHeight}</p>
//        <p>{document.body.clientHeight}</p>
//        <p>{document.documentElement.clientHeight}</p>
//        <p>{window.innerHeight}</p>
  render() {
    return (
      <div className='scroll'>
        <button className='button is-medium' onClick={this.out}>out</button>
        { this.state.showModal ? <OpenedModal unmountMe={this.hideModal} docID={this.state.modalID} docData={this.state.modalDoc}/> : ''}
        { this.state.texts.map(text => <Text key={text.id} data={text} edit={this.showModal(text.id, text)}/>)}
        <div className='has-text-centered'>
          <button className='button is-medium ab' onClick={this.showModal(null, {})}>memo</button>
        </div>
        <Arc />
      </div>
    )
  }
}
