import React from 'react'
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';

import Archive from './archived'
import Main from './mainPage'

export default class SignedInContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      innerPath: this.props.path || '/main',
    }

    this.navigator = this.navigator.bind(this);

    this.isMain = this.isMain.bind(this);
    this.goMain = this.goMain.bind(this);
    this.isArchive = this.isArchive.bind(this);
    this.goArchive = this.goArchive.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ hoge: true})
        // User is signed in.
        // let displayName = user.displayName;
        // let email = user.email;
        // let emailVerified = user.emailVerified;
        // let photoURL = user.photoURL;
        // let uid = user.uid;
        // let phoneNumber = user.phoneNumber;
        // let providerData = user.providerData;
        // user.getIdToken().then(accessToken => {
        // console.log(accessToken)
        // });
      } else {
        this.setState({ hoge: false })
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
  }

  isMain() { return this.state.innerPath === '/main' }
  goMain() { this.setState({ innerPath: '/main' }) }
  isArchive() { return this.state.innerPath === '/archive' }
  goArchive() { this.setState({ innerPath: '/archive' }) }
  navigator() {
    let nav = {}
    nav.goMain = this.goMain
    nav.goArchive = this.goArchive
    return nav
  }

  render() {
    return this.isMain() ? <Main navigator={this.navigator()} signedIn={this.state.hoge} />
      : (this.isArchive() ? <Archive navigator={this.navigator()} />
        : '')
  }
}
