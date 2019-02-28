import firebase from 'firebase/app';
import ENV from 'ENV';

firebase.initializeApp({
  apiKey: ENV.SBA_NODE_FB_APIKEY,
  authDomain: ENV.SBA_NODE_FB_AUTHDOMAIN,
  projectId: ENV.SBA_NODE_FB_PROJECTID
});


import db from './db'
db.setup()


import React from 'react';
import ReactDOM from 'react-dom';

import SignedInContainer from './sp/signed_in_container'
import PC from './pc/pc'

if (window.innerWidth < 560) {
  ReactDOM.render(<SignedInContainer />, document.getElementById('main'))
} else {
  ReactDOM.render(<PC />, document.getElementById('main'))
}


import './main.css'


import runtime from 'serviceworker-webpack-plugin/lib/runtime';

if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}
