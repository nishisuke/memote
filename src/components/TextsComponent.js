import React from 'react'
import TextComponent from './text'

export default props => {
  return <div className='CTexts'>{ props.texts.map(t => <TextComponent setSlidable={props.setSlidable} edit={props.startEditing} key={t.id} data={t} />)}</div>
}
