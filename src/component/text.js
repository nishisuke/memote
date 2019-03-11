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
    this.shouldArchive = this.shouldArchive.bind(this);
  }

  hoge() {
    if (window.innerWidth < 560) {
      this.props.edit()
    } else {
      this.props.setEdit()
    }
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

  shouldArchive(touch) {
    let left = touch.pageX - (this.state.offsetX || 0)
    let bottom = touch.pageY - (this.state.offsetY || 0) + 28
    return (left < 96 + ((window.innerWidth - 248) / 6) && window.innerHeight - bottom < 72)
  }

  componentDidMount() {
    let ele = document.getElementById(this.props.data.id)
    ele.addEventListener('touchstart', event => {
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        this.setState({ offsetX: touch.pageX - this.state.pageX, offsetY: touch.pageY - this.state.pageY })
      }
      return false
    }, { passive: false })

    ele.addEventListener('touchmove', event => {
      event.preventDefault()

      this.props.show()
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        let pageX = touch.pageX - (this.state.offsetX || 0)
        let pageY = touch.pageY - (this.state.offsetY || 0)
        this.setState(this.restrictedPoint(pageX, pageY))
        if (this.shouldArchive(touch)) {
          document.getElementById('archiveIcon').classList.add('red')
          ele.classList.add('willArchive')
        } else {
          document.getElementById('archiveIcon').classList.remove('red')
          ele.classList.remove('willArchive')
        }
      }
    }, { passive: false })

    ele.addEventListener('touchend', event => {
      this.props.hide()
      if (event.targetTouches.length == 0) {
        let touch = event.changedTouches[0]
        if (this.shouldArchive(touch)) {
          this.archive()
          document.getElementById('archiveIcon').classList.remove('red')
        } else {
          this.storePoint()
        }
      }
      return false
    }, { passive: false })
  }

  storePoint() {
    db.updatePoint(this.props.data.id, this.state.pageX / window.innerWidth, this.state.pageY / window.innerHeight)
  }

  render() {
    return (
      <div style={{ left: this.state.pageX + 'px', top: this.state.pageY + 'px' }} className='moveabs textlabel is-size-7' onClick={this.hoge} id={this.props.data.id}>
      {this.props.data.string.split('\n')[0]}
      </div>
    )
  }
}
