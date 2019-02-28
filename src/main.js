import './main.css'
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import React from 'react';
import ReactDOM from 'react-dom';

import ENV from 'ENV';
import SignedInContainer from './sp/signed_in_container'
import PC from './pc/pc'

firebase.initializeApp({
  apiKey: ENV.SBA_NODE_FB_APIKEY,
  authDomain: ENV.SBA_NODE_FB_AUTHDOMAIN,
  projectId: ENV.SBA_NODE_FB_PROJECTID
});

import db from './db'
db.setup()

if (window.innerWidth < 560) {
  ReactDOM.render(<SignedInContainer />, document.getElementById('main'))
} else {
  ReactDOM.render(<PC />, document.getElementById('main'))
}

import runtime from 'serviceworker-webpack-plugin/lib/runtime';

if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}
