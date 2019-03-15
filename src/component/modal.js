import React from 'react'

export default props => {
  const activeClass = props.isActive ? 'is-active' : '';
  return (
    <div className={`modal ${activeClass}`}>
      <div className='modal-background' onClick={props.inactivate}></div>
      <div className='modal-content'>
        {props.children}
      </div>
    </div>
  )
}
