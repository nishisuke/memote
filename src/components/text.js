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
  return (left < 96 + ((window.innerWidth - 248) / 6) && window.innerHeight - bottom < 104)
}

export default (props) => {
  const d = props.data
  const x = (d ? d.pageXRate * window.innerWidth : 0)
  const y = (d ? d.pageYRate * window.innerHeight : 0)
  const [point, setPoint] = React.useState({
    pageX: x,
    pageY: y,
  })
  const [offset, setOffset] = React.useState({
    offsetX: 0,
    offsetY: 0,
  })
  const [willArchive, setWillArchive] = React.useState(false)

  const autoDelClassName = props.data.autoDeleteAt ? 'auto-del' : ''
  const willArchiveClassName = willArchive ? 'willArchive' : ''

  const onTouchStart = event => {
    props.setSlidable(false)
    if (event.targetTouches.length == 1) {
      let touch = event.targetTouches[0]
      setOffset({ offsetX: touch.pageX - point.pageX, offsetY: touch.pageY - point.pageY })
    }
    return false
  }
  const onTouchMove = event => {
    document.getElementById('archiveIcon').classList.remove('is-invisible')
    document.getElementById('add').classList.add('is-invisible')
    document.getElementById('menu').classList.add('is-invisible')
    if (event.targetTouches.length == 1) {
      let touch = event.targetTouches[0]
      let pageX = touch.pageX - (offset.offsetX || 0)
      let pageY = touch.pageY - (offset.offsetY || 0)
      setPoint(restrictedPoint(pageX, pageY))
      if (shouldArchive(touch, offset)) {
        setWillArchive(true)
      } else {
        setWillArchive(false)
      }
    }
  }
  const onTouchEnd = event => {
    props.setSlidable(true)
    document.getElementById('archiveIcon').classList.add('is-invisible')
    document.getElementById('add').classList.remove('is-invisible')
    document.getElementById('menu').classList.remove('is-invisible')
    if (event.targetTouches.length == 0) {
      let touch = event.changedTouches[0]
      if (shouldArchive(touch, offset)) {
        db.archiveMemo(props.data.id)
      } else {
        db.updatePoint(props.data.id, point.pageX / window.innerWidth, point.pageY / window.innerHeight)
      }
    }
    return false
  }

  return (
    <div
      style={{ left: point.pageX + 'px', top: point.pageY + 'px' }}
      className={`${autoDelClassName} ${willArchiveClassName} moveabs textlabel is-size-7` }
      onClick={() => props.edit(props.data)}
      id={props.data.id}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
    >
      { props.data.headText() }
    </div>
  )
}
