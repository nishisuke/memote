import React from 'react'
import firebase from 'firebase/app';

export default class Text extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageX: props.data.pageX,
      pageY: props.data.pageY,
    };

    this.archive = this.archive.bind(this);
    this.hoge = this.hoge.bind(this);
    this.storePoint = this.storePoint.bind(this);
  }

  hoge() {
    this.props.edit()
  }

  archive() {
    let db = firebase.firestore();
    let text = db.collection('texts').doc(this.props.data.id)
    text.update({ archived: true, archivedAt: new Date() })
  }

  componentDidMount() {
    let ele = document.getElementById(this.props.data.id)
    ele.addEventListener('touchmove', event => {
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        this.setState({ pageX: touch.pageX + 'px', pageY: touch.pageY + 'px' })
        if (touch.pageX < 40 && touch.pageY > 400) {
          ele.style.color = 'red'
        } else {
          ele.style.color = 'black'
        }
      }
    }, { passive: true })
    // ele.addEventListener('touchstart', event => {
    // }, { passive: true })
    ele.addEventListener('touchend', event => {
      if (event.targetTouches.length == 0) {
        let touch = event.changedTouches[0]
        if (touch.pageX < 40 && touch.pageY > 400) {
          this.archive()
        } else {
        this.storePoint()
        }
      }
    }, { passive: true })
  }

  storePoint() {
    let db = firebase.firestore();
    let text = db.collection('texts').doc(this.props.data.id)
    text.update({ pageX: this.state.pageX, pageY: this.state.pageY })
  }

//  <button onClick={this.archive}>x</button>
  render() {
    return (
      <div style={{ left: this.state.pageX, top: this.state.pageY }} className='moveabs' onClick={this.hoge} id={this.props.data.id}>
      {this.props.data.string.split('\n')[0]}
      </div>
    )
  }
}
