import React, { useLayoutEffect, useRef, useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import db from '../db'
import useSubscribeTexts from '../hooks/useSubscribeTexts'
import useAutoSave from '../hooks/useAutoSave'
import ImmutableText from '../records/ImmutableText'

import Editor from '../component/editor'
import TextComponent from '../component/text'
import Modal from '../component/Modal'
import Menu from '../component/menu'

export default () => {
  // なんでtextsとコンポーネント分けたか
  // textsのレンダーのたびにstatusもリコールされてeffectが走るのを避けるため
  const autoSave = useAutoSave()

  return <TextContainer autoSave={autoSave} />
}

const TextContainer = ({ autoSave }) => {
  const texts = useSubscribeTexts()

  // editor
  const editorRef = useRef(null)
  useLayoutEffect(() => {
    if (autoSave.isEditing) editorRef.current.focus();
  }, [autoSave.isEditing])

  // menu
  const [showMenu, setShowMenu] = useState(false)
  const menu = useMemo(() => <Menu />, [])

  return (
    <div className='rootContainer'>
      <Modal isActive={autoSave.isEditing} inactivate={autoSave.finishEditing} content={<Editor finish={autoSave.finishEditing} ref={editorRef} handleChange={autoSave.change} value={autoSave.value} />} />
      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

      <div className='CMain'>
        <div className='CTexts'>{ texts.map(t => <TextComponent edit={autoSave.startEditing} key={t.id} data={t} />)}</div>
        <div className='inputContainer'>
          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='has-text-danger is-invisible'><span className='icon is-large'><i className='fas fa-archive fa-2x'></i></span></div>
            <div id='add' className='has-text-primary' onClick={() => autoSave.startEditing(db.newMemo())}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
            <div id='menu' onClick={() => setShowMenu(true)}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
