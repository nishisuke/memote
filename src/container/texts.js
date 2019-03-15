import React, { useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import db from '../db'
import useSubscribeTexts from '../hooks/useSubscribeTexts'

import OpenedModal from '../component/modaltext'
import Text from '../component/text'
import Menu from '../component/menu'
import Modal from '../component/Modal'
import TextEditor from '../component/textarea'

const ACTION_EDITING = 'editing'
const ACTION_FINISH_EDITING = 'finishEditing'

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_EDITING:
      if (state.showTextareaModal) return state;
      return { showTextareaModal: true, editingID: action.id };
    case ACTION_FINISH_EDITING:
      if (!state.showTextareaModal) return state;
      return { showTextareaModal: false, editingID: null };
    default: throw new Error();
  }
}

export default props => {
  const texts = useSubscribeTexts()

  const [state, dispatch] = useReducer(reducer, {
    showTextareaModal: false,
    editingID: db.newMemo().id,
  })

  const [showMenu, setShowMenu] = useState(false);

  const setNewEditing = () => setEditingFunc(db.newMemo().id)()
  const finishEditing = useCallback(() => dispatch({ type: ACTION_FINISH_EDITING }), [])
  const setEditingFunc = id => (() => dispatch({ type: ACTION_EDITING, id: id }))

  const editing = texts.find(t => t.id === state.editingID) || { id: state.editingID, string: '' }
  const memoEditing = useMemo(() => (texts.find(t => t.id === state.editingID) || { id: state.editingID, string: '' }), [editing.id, editing.string])

  return (
    <div className='rootContainer'>
      <div className={`modal ${state.showTextareaModal && window.innerWidth < 560 ? 'is-active' : ''}`}>
        <div className='modal-background' onClick={finishEditing}></div>
        <OpenedModal unmountMe={finishEditing} docData={memoEditing}/>
      </div>

      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)}>
        <Menu />
      </Modal>

      <div className='CMain'>
        <div className='CTexts'>{ texts.map(text => <Text setEdit={setEditingFunc(text.id)} key={text.id} data={text} edit={setEditingFunc(text.id)} />)}</div>
        <div className='inputContainer'>
          <TextEditor docData={memoEditing} />

          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='has-text-danger is-invisible'><span className='icon is-large'><i className='fas fa-archive fa-2x'></i></span></div>
            <div className='has-text-primary' onClick={setNewEditing}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
            <div onClick={() => setShowMenu(true)}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
