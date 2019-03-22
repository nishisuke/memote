import React from 'react'
import TextComponent from '../component/text'
import useSubscribeTexts from '../hooks/useSubscribeTexts'

export default props => {
  const texts = useSubscribeTexts()

  return <div className='CTexts'>{ texts.map(t => <TextComponent edit={props.startEditing} key={t.id} data={t} />)}</div>
}
