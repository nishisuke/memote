import React from 'react'
import TextComponent from '../component/text'

export default props => {
  return <div className='CTexts'>{ props.texts.map(t => <TextComponent edit={props.startEditing} key={t.id} data={t} />)}</div>
}
