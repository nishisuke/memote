import React from 'react'
import firebase from 'firebase/app';
import Arc from './archived'

export default class Text extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
    };
    this.out = this.out.bind(this);
  }

  out() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    return (
      <div className={`modal is-active`}>
        <div className='modal-background'></div>
        <div className="modal-content">
          <button className='button is-medium' onClick={this.out}>sign out</button>
          <Arc />
        </div>
        <button className="modal-close is-large" onClick={this.props.close} aria-label="close"></button>
      </div>
    )
  }
}
