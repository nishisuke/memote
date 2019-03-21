import firebase from 'firebase/app';
import ENV from 'ENV';

firebase.initializeApp({
  apiKey: ENV.SBA_NODE_FB_APIKEY,
  authDomain: ENV.SBA_NODE_FB_AUTHDOMAIN,
  projectId: ENV.SBA_NODE_FB_PROJECTID
});


import * as firebaseui from 'firebaseui';

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    let uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
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


import db from './db'
db.setup()


import React from 'react';
import ReactDOM from 'react-dom';

import Routing from './container/routing'

ReactDOM.render(<Routing />, document.getElementById('main'))


import './main.css'
import 'firebaseui/dist/firebaseui.css'


import runtime from 'serviceworker-webpack-plugin/lib/runtime';

if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}
