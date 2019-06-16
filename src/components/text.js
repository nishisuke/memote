import React from 'react'
import db from '../db';

const restrictedPoint = (numX, numY) => {
  let maxX = window.innerWidth - 164 // 4 + 160(width)
  let maxY = window.innerHeight - 32 // 4 + 28(height)
  let x = numX < 4 ? 4 : (numX > maxX ? maxX : numX )
  let y = numY < 4 ? 4 : (numY > maxY ? maxY : numY )
  return { pageX: x, pageY: y }
}

const shouldArchive = (touch, state) => {
  let left = touch.pageX - (state.offsetX || 0)
  let bottom = touch.pageY - (state.offsetY || 0) + 28
  return (left < 96 + ((window.innerWidth - 248) / 6) && window.innerHeight - bottom < 72)
}

export default class TextComponent extends React.Component {
  constructor(props) {
    super(props);
    const d = props.data
    const x = (d ? d.pageXRate * window.innerWidth : 0)
    const y = (d ? d.pageYRate * window.innerHeight : 0)

    this.state = {
      pageX: x,
      pageY: y,
    };

  }

  componentDidMount() {
    let ele = document.getElementById(this.props.data.id)
    ele.addEventListener('touchstart', event => {
      this.props.setSlidable(false)
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        this.setState({ offsetX: touch.pageX - this.state.pageX, offsetY: touch.pageY - this.state.pageY })
      }
      return false
    }, { passive: false })

    ele.addEventListener('touchmove', event => {
      event.preventDefault()

      document.getElementById('archiveIcon').classList.remove('is-invisible')
      document.getElementById('add').classList.add('is-invisible')
      document.getElementById('menu').classList.add('is-invisible')
      if (event.targetTouches.length == 1) {
        let touch = event.targetTouches[0]
        let pageX = touch.pageX - (this.state.offsetX || 0)
        let pageY = touch.pageY - (this.state.offsetY || 0)
        this.setState(restrictedPoint(pageX, pageY))
        if (shouldArchive(touch, this.state)) {
          ele.classList.add('willArchive')
        } else {
          ele.classList.remove('willArchive')
        }
      }
    }, { passive: false })

    ele.addEventListener('touchend', event => {
      this.props.setSlidable(true)
      document.getElementById('archiveIcon').classList.add('is-invisible')
      document.getElementById('add').classList.remove('is-invisible')
      document.getElementById('menu').classList.remove('is-invisible')
      if (event.targetTouches.length == 0) {
        let touch = event.changedTouches[0]
        if (shouldArchive(touch, this.state)) {
          db.archiveMemo(this.props.data.id)
        } else {
          db.updatePoint(this.props.data.id, this.state.pageX / window.innerWidth, this.state.pageY / window.innerHeight)
        }
      }
      return false
    }, { passive: false })
  }

  render() {
    const autoDelClassName = this.props.data.autoDeleteAt ? 'auto-del' : ''
    return (
      <div style={{ left: this.state.pageX + 'px', top: this.state.pageY + 'px' }} className={`${autoDelClassName} moveabs textlabel is-size-7` } onClick={() => this.props.edit(this.props.data)} id={this.props.data.id}>
      { this.props.data.headText() }
      </div>
    )
  }
}
