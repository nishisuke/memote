import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import ReactGA from 'react-ga';

import ENV from 'ENV';
import db from './db'

import Archive from './components/archived'
import Texts from './components/texts'

import './main.css'
import 'firebaseui/dist/firebaseui.css'

const GAID = 'UA-141672362-1'

firebase.initializeApp({
  apiKey: ENV.SBA_NODE_FB_APIKEY,
  authDomain: ENV.SBA_NODE_FB_AUTHDOMAIN,
  projectId: ENV.SBA_NODE_FB_PROJECTID
});

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

db.setup()

if ('serviceWorker' in navigator) {
  runtime.register();
}

const Routing = () => {
  const [signed, setSigned] = React.useState(false);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => setSigned(!!user))
  }, [])

  ReactGA.initialize(GAID, {
    debug: ENV.SBA_NODE_DEBUG,
    titleCase: false,
  });
  const u = firebase.auth().currentUser
  if (signed && u) {
    ReactGA.set({ userId: u.uid });
  }

  if (!signed) return '';

  return (
    <BrowserRouter>
      <React.Fragment>
        <Route path='/' exact component={Texts} />
        <Route path='/archives/' component={Archive} />
      </React.Fragment>
    </BrowserRouter>
  )
}

ReactDOM.render(<Routing />, document.getElementById('root'))
