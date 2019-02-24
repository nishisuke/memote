import React from 'react'
import db from './db';

export default class Text extends React.Component {
  constructor(props) {
    super(props);

      let p = this.restrictedPoint((props.data.pageXRate || 0) * window.innerWidth, (props.data.pageYRate || 0) * window.innerHeight)
    this.state = {
      pageX: p.pageX,
      pageY: p.pageY,
    };

    this.archive = this.archive.bind(this);
    this.hoge = this.hoge.bind(this);
    this.storePoint = this.storePoint.bind(this);
    this.touchDangerArea = this.touchDangerArea.bind(this);
  }

  hoge() {
    this.props.edit()
  }

  restrictedPoint(numX, numY) {
    let maxX = window.innerWidth - 176 // 16 + 160(width)
    let maxY = window.innerHeight - 44 // 16 + 28(height)
    let x = numX < 16 ? 16 : (numX > maxX ? maxX : numX )
    let y = numY < 16 ? 16 : (numY > maxY ? maxY : numY )
    return { pageX: x, pageY: y }
  }

  archive() {
    db.archiveMemo(this.props.data.id)
  }

  touchDangerArea(x, y) {
    return (x < 96 && window.innerHeight - y < 96)
  }

  componentDidMount() {
    let ele = document.getElementById(this.props.data.id)
    ele.addEventListener('touchstart', event => {
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        this.setState({ offsetX: touch.pageX - this.state.pageX, offsetY: touch.pageY - this.state.pageY })
      }
    }, { passive: true })
    ele.addEventListener('touchmove', event => {
      event.preventDefault() // 動かすときにbodyのスクロールできないエフェクトをそし
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        let pageX = touch.pageX - (this.state.offsetX || 0)
        let pageY = touch.pageY - (this.state.offsetY || 0)
        this.setState(this.restrictedPoint(pageX, pageY))
        if (this.touchDangerArea(touch.pageX, touch.pageY)) {
          ele.style.color = 'red'
        } else {
          ele.style.color = 'black'
        }
      }
    }, { passive: false })
    // ele.addEventListener('touchstart', event => {
    // }, { passive: true })
    ele.addEventListener('touchend', event => {
      if (event.targetTouches.length == 0) {
        let touch = event.changedTouches[0]
        if (this.touchDangerArea(touch.pageX, touch.pageY)) {
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
    text.update({ pageXRate: this.state.pageX / window.innerWidth, pageYRate: this.state.pageY / window.innerHeight })
  }

//  <button onClick={this.archive}>x</button>
  render() {
    return (
      <div style={{ left: this.state.pageX + 'px', top: this.state.pageY + 'px' }} className='moveabs label is-size-7' onClick={this.hoge} id={this.props.data.id}>
      {this.props.data.string.split('\n')[0]}
      </div>
    )
  }
}
