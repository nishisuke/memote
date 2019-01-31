import React from 'react'
import firebase from 'firebase';

// Required for side-effects
import 'firebase/firestore';

export default class Text extends React.Component {
   constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
    let db = firebase.firestore();
    db.collection('texts').doc(this.props.id).get().then(doc => {
      if (doc.exists) {
        this.setState(doc.data())
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    })
  }

  render() {
    return (
      <div>
      {this.state.string}
      </div>
    )
  }
}
