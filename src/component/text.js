import React from 'react'
import db from '../db';

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
    return (x < 96 + ((window.innerWidth - 248) / 6) && window.innerHeight - y < 72)
  }

  componentDidMount() {
    let ele = document.getElementById(this.props.data.id)
    ele.addEventListener('touchstart', event => {
      event.preventDefault()
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        this.setState({ offsetX: touch.pageX - this.state.pageX, offsetY: touch.pageY - this.state.pageY })
      }
    }, { passive: false })
    ele.addEventListener('touchmove', event => {
      event.preventDefault()
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        let pageX = touch.pageX - (this.state.offsetX || 0)
        let pageY = touch.pageY - (this.state.offsetY || 0)
        this.setState(this.restrictedPoint(pageX, pageY))
        if (this.touchDangerArea(touch.pageX, touch.pageY)) {
          document.getElementById('archiveIcon').classList.add('red')
          ele.classList.add('willArchive')
        } else {
          document.getElementById('archiveIcon').classList.remove('red')
          ele.classList.remove('willArchive')
        }
      }
    }, { passive: false })
    // ele.addEventListener('touchstart', event => {
    // }, { passive: true })
    ele.addEventListener('touchend', event => {
      event.preventDefault()
      if (event.targetTouches.length == 0) {
        let touch = event.changedTouches[0]
        if (this.touchDangerArea(touch.pageX, touch.pageY)) {
          this.archive()
          document.getElementById('archiveIcon').classList.remove('red')
        } else {
          this.storePoint()
        }
      }
    }, { passive: false })
  }

  storePoint() {
    db.updatePoint(this.props.data.id, this.state.pageX / window.innerWidth, this.state.pageY / window.innerHeight)
  }

//  <button onClick={this.archive}>x</button>
  render() {
    return (
      <div style={{ left: this.state.pageX + 'px', top: this.state.pageY + 'px' }} className='moveabs textlabel is-size-7' onClick={this.hoge} id={this.props.data.id}>
      {this.props.data.string.split('\n')[0]}
      </div>
    )
  }
}
