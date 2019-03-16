import React, { useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import db from '../db'
import useSubscribeTexts from '../hooks/useSubscribeTexts'

import OpenedModal from '../component/modaltext'
import TextComponent from '../component/text'
import Menu from '../component/menu'
import Modal from '../component/Modal'
import TextEditor from '../component/textarea'
import ImmutableText from '../records/ImmutableText'

const reducer = (state, action) => {
  switch (action.type) {
    case 'willSave': return {state: 'willSave', timeoutID: action.timeoutID};
    case 'saved': return { ...state, state: 'saved', savedValue: action.savedValue }
    case 'saveFailed': return { ...state, state: 'saveFailed', failedValue: action.failedValue}
    default: throw new Error();
  }
}

let promise = new Promise(resolve => {
  resolve(1)
})

export default props => {
  const texts = useSubscribeTexts()

  const [state, dispatch] = useReducer(reducer, {state: 'notChanged'});

  const [editingID, setEditing] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const editorOpen = () => {
    setEditing(db.newMemo().id) 
  }

  useEffect(() => setShowEditor(!!editingID), [editingID])

  const editing = editingID ? (texts.find(t => t.id === editingID) || new ImmutableText({id: editingID})) : null

  const cb = t => {
    if (!editing) return;

    clearTimeout(state.timeoutID)
    const timeoutID = setTimeout(() => {
      promise = promise.then(num => {
        return new Promise(resolve => {

          db.putMemo(editing.getEdited(t))
            .then(() => {
              dispatch({ type: 'saved', savedValue: t })
              resolve(true)
            }).catch(e => {
              dispatch({ type: 'saveFailed', failedValue: t })
              resolve(false)
            })


        })
      })
    }, 1500)
    dispatch({ type: 'willSave', timeoutID: timeoutID })
  }

  return (
    <div className='rootContainer'>
      <Modal isActive={showEditor} inactivate={() => setShowEditor(false)}>
        <OpenedModal changedCallback={cb} />
      </Modal>

      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)}>
        <Menu />
      </Modal>

      <div className='CMain'>
        <div className='CTexts'>{ texts.map(t => <TextComponent key={t.id} data={t} />)}</div>
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
