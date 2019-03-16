import React, { useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import db from '../db'
import useSubscribeTexts from '../hooks/useSubscribeTexts'
import ImmutableText from '../records/ImmutableText'

import OpenedModal from '../component/modaltext'
import TextComponent from '../component/text'
import Modal from '../component/Modal'
import Menu from '../component/menu'

const reducer = (state, action) => {
  switch (action.type) {
    case 'willSave': return {...state, state: 'willSave', timeoutID: action.timeoutID};
    case 'setPromise': return {...state, state: 'setPromise' }
    case 'saved': return { ...state, state: 'saved', savedValue: action.savedValue }
    default: throw new Error();
  }
}

let promise = new Promise(resolve => {
  resolve(1)
})

export default props => {
  const texts = useSubscribeTexts()

  const [state, dispatch] = useReducer(reducer, {state: 'notChanged', timeoutID: -1, savedValue: ''});

  const [editingID, setEditing] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setShowEditor(!!editingID)
  }, [editingID])

  const editorOpen = () => {
    setEditing(db.newMemo().id) 
  }

  const editing = editingID ? (texts.find(t => t.id === editingID) || new ImmutableText({id: editingID})) : null

  const cb = t => {
    if (!editing) return;
    if (editing.text !== state.savedValue) { alert('other editor may be still working! invalidate this editor for safety.'); return; }

    clearTimeout(state.timeoutID)

    const timeoutID = setTimeout(() => {
      dispatch({ type: 'setPromise' })

      promise = promise.then(num => {
        return new Promise(resolve => {
          db.putMemo(editing.getEdited(t))
            .then(() => {
              dispatch({ type: 'saved', savedValue: t })
              resolve(true)
            }).catch(e => {
              alert(`save failed!!: ${t}`)
              resolve(false)
            })
        })
      })
    }, 1500)

    dispatch({ type: 'willSave', timeoutID: timeoutID })
  }

  const superFunc = () => {
    setEditing(null)
  }

  const aa = useCallback(cb, [editingID, state.timeoutID])
  const editor = useMemo(() => <OpenedModal changedCallback={aa} defaultValue={state.savedValue} />, [aa, state.savedValue])

  const menu = useMemo(() => <Menu />, [])

  return (
    <div className='rootContainer'>
      <Modal isActive={showEditor} inactivate={superFunc} content={editor} />

      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

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
