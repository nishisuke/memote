import firebase from 'firebase';
import firebaseui from 'firebaseui';

// Required for side-effects
import 'firebase/firestore';

import ENV from 'ENV';

firebase.initializeApp({
  apiKey: ENV.SBA_NODE_FB_APIKEY,
  authDomain: ENV.SBA_NODE_FB_AUTHDOMAIN,
  projectId: ENV.SBA_NODE_FB_PROJECTID
});

let initApp = () => {
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
        console.log(accessToken)
      });

      let db = firebase.firestore();
      db.collection('texts').add({
        string: 'hoge'
      })

    } else {
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
      if (ui.isPendingRedirect()) {
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    }
  }, console.log);
};

document.addEventListener('DOMContentLoaded', initApp);
