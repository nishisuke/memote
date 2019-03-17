import React from 'react'
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

export default () => {
  const scriptTags = document.getElementsByTagName('script')
  const lastScriptTag = scriptTags[scriptTags.length - 1]
  const paths = lastScriptTag.src.split('/')
  const filenameArr = paths[paths.length - 1].split('.')
  const version = filenameArr[0]

  const signout = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(e => {
      // An error happened.
    })
  }

  return (
    <div>
      <button className='button is-medium' onClick={signout}>sign out</button>
      <Link to='/archives/'>archives</Link>
      <p>{version}</p>
    </div>
  )
}
