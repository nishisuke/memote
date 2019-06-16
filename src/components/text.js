import React from 'react'
import db from '../db';

const restrictedPoint = (numX, numY) => {
  let maxX = window.innerWidth - 164 // 4 + 160(width)
  let maxY = window.innerHeight - 32 // 4 + 28(height)
  let x = numX < 4 ? 4 : (numX > maxX ? maxX : numX )
  let y = numY < 4 ? 4 : (numY > maxY ? maxY : numY )
  return { x, y }
}

const shouldArchive = (touch, state) => {
  let left = touch.pageX - (state.x || 0)
  let bottom = touch.pageY - (state.y || 0) + 28
  return (left < 96 + ((window.innerWidth - 248) / 6) && window.innerHeight - bottom < 104)
}

export default (props) => {
  const [point, setPoint] = React.useState({
    x: (props.data ? props.data.pageXRate * window.innerWidth : 0),
    y: (props.data ? props.data.pageYRate * window.innerHeight : 0),
  })
  const [offset, setOffset] = React.useState({
    x: 0,
    y: 0,
  })
  const [willArchive, setWillArchive] = React.useState(false)

  const autoDelClassName = props.data.autoDeleteAt ? 'auto-del' : ''
  const willArchiveClassName = willArchive ? 'willArchive' : ''

  const onTouchStart = event => {
    props.setSlidable(false)
    if (event.targetTouches.length == 1) {
      let touch = event.targetTouches[0]
      setOffset({ x: touch.pageX - point.x, y: touch.pageY - point.y })
    }
    return false
  }
  const onTouchMove = event => {
    document.getElementById('archiveIcon').classList.remove('is-invisible')
    document.getElementById('add').classList.add('is-invisible')
    document.getElementById('menu').classList.add('is-invisible')

    if (event.targetTouches.length != 1) return false

    let touch = event.targetTouches[0]
    setWillArchive(shouldArchive(touch, offset))

    let x = touch.pageX - (offset.x || 0)
    let y = touch.pageY - (offset.y || 0)
    setPoint(restrictedPoint(x, y))
    return false
  }
  const onTouchEnd = event => {
    props.setSlidable(true)
    document.getElementById('archiveIcon').classList.add('is-invisible')
    document.getElementById('add').classList.remove('is-invisible')
    document.getElementById('menu').classList.remove('is-invisible')
    if (event.targetTouches.length != 0) return false

    let touch = event.changedTouches[0]
    if (shouldArchive(touch, offset)) {
      db.archiveMemo(props.data.id)
    } else {
      db.updatePoint(props.data.id, point.x / window.innerWidth, point.y / window.innerHeight)
    }
    return false
  }

  return (
    <div
      style={{ left: point.x + 'px', top: point.y + 'px' }}
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
