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
  }

  render() {
    return (
      <div>
      {`${this.props.data.write}: ${this.props.data.string}`}
      </div>
    )
  }
}
