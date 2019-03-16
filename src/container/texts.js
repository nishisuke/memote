import React, { useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import db from '../db'
import useSubscribeTexts from '../hooks/useSubscribeTexts'

import OpenedModal from '../component/modaltext'
import Text from '../component/text'
import Menu from '../component/menu'
import Modal from '../component/Modal'
import TextEditor from '../component/textarea'

export default props => {
  const texts = useSubscribeTexts()

  const [editingID, setEditing] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const editing = texts.find(t => t.id === editingID) || { id: editingID, text: '' }
  const memoEditing = useMemo(() => (texts.find(t => t.id === editingID) || { id: editingID, text: '' }), [editing.id, editing.text])

  const editorOpen = () => {
    setEditing(db.newMemo().id) 
    setShowEditor(true) 
  }
  const cb = t => {
    // setTimeout(() => {
    //   Object.assign()
    //   db.putMemo(editingID, )
    // }, 1500)
    console.log(t)
  }

  return (
    <div className='rootContainer'>
      <Modal isActive={showEditor} inactivate={() => setShowEditor(false)}>
        <OpenedModal changeCallback={cb} />
      </Modal>

      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)}>
        <Menu />
      </Modal>

      <div className='CMain'>
        <div className='CTexts'>{ texts.map(t => <Text key={t.id} data={t} />)}</div>
        <div className='inputContainer'>
          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='has-text-danger is-invisible'><span className='icon is-large'><i className='fas fa-archive fa-2x'></i></span></div>
            <div className='has-text-primary' onClick={editorOpen}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
            <div onClick={() => setShowMenu(true)}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
