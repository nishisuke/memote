import './main.css'
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import React from 'react';
import ReactDOM from 'react-dom';

import ENV from 'ENV';
import SignedInContainer from './signed_in_container'

firebase.initializeApp({
  apiKey: ENV.SBA_NODE_FB_APIKEY,
  authDomain: ENV.SBA_NODE_FB_AUTHDOMAIN,
  projectId: ENV.SBA_NODE_FB_PROJECTID
});

import db from './db'
db.setup()

firebase.firestore().enablePersistence()
  .catch(err => {
    if (err.code == 'failed-precondition') {
      console.log(err.code)
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
    } else if (err.code == 'unimplemented') {
      console.log(err.code)
      // The current browser does not support all of the
      // features required to enable persistence
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      // let displayName = user.displayName;
      // let email = user.email;
      // let emailVerified = user.emailVerified;
      // let photoURL = user.photoURL;
      // let uid = user.uid;
      // let phoneNumber = user.phoneNumber;
      // let providerData = user.providerData;
      user.getIdToken().then(accessToken => {
        // console.log(accessToken)
      });
      window.saveBrainAppFirebaseUser = user
      ReactDOM.render(<SignedInContainer />, document.getElementById('main'))
    } else {
      window.saveBrainAppFirebaseUser = {}
      let uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
              'https://www.googleapis.com/auth/calendar.events',
            ],
            customParameters: {
              // Forces account selection even when one account
              // is available.
              prompt: 'select_account'
            }
          },
        ],
        tosUrl: '<your-tos-url>', // TODO set url
        privacyPolicyUrl: () => {
          window.location.assign('<your-privacy-policy-url>'); // TODO set url
        }
      };

      let ui = new firebaseui.auth.AuthUI(firebase.auth());

      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }, console.error);
});
