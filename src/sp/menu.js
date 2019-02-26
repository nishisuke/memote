import React from 'react'
import firebase from 'firebase/app';

export default class Text extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
    };
    this.out = this.out.bind(this);
  }

  out() {
    firebase.auth().signOut().then(function() {
      window.saveBrainAppFirebaseUser = {}
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    return (
      <div>
        <button className='button is-medium' onClick={this.out}>sign out</button>
        <button className='button is-medium' onClick={this.props.navigator.goArchive}>archive</button>
      </div>
    )
  }
}
