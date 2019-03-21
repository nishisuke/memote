import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'

export default () => {
  const scriptTags = document.getElementsByTagName('script')
  const lastScriptTag = scriptTags[scriptTags.length - 1]
  const paths = lastScriptTag.src.split('/')
  const filenameArr = paths[paths.length - 1].split('.')
  const version = filenameArr[0]

  const signout = () => {
    firebase.auth().signOut()
  }

  return (
    <div className='section'>
      <div className='buttons'>
        <Link className='button is-light is-medium is-fullwidth' to='/archives/'>archived items</Link>
        <button className='button is-danger is-medium is-fullwidth' onClick={signout}>sign out</button>
      </div>
      <div className='tags has-addons'>
        <div className='tag'>deployed at</div>
        <div className='tag is-success'>{version}</div>
      </div>
    </div>
  )
}
