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
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    let tags = document.getElementsByTagName('script')
    let pathArr = tags[tags.length - 1].src.split('/')
    let arr = pathArr[pathArr.length - 1].split('.')
    let str = arr[0]
    return (
      <div className='modal-content'>
        <button className='button is-medium' onClick={this.out}>sign out</button>
        <button className='button is-medium' onClick={this.props.navigator.goArchive}>archive</button>
        <p>{str}</p>
      </div>
    )
  }
}
