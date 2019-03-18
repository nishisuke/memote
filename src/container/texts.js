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
    case 'willSave': return {...state, state: 'willSave', value: action.value, timeoutID: action.timeoutID};
    case 'setPromise': return {...state, state: 'setPromise' }
    case 'saved': return { ...state, state: 'saved' }
    case 'edit': return { ...state, state: 'edit', editingID: action.editingID, value: action.value }
    default: throw new Error();
  }
}

let promise = new Promise(resolve => {
  resolve(1)
})

const initialState = {
  state: 'notChanged',
  editingID: null,
  timeoutID: -1,
  value: '', // 終了時にcleartimeoutして即時実行する時必要
}

export default props => {
  const texts = useSubscribeTexts()

  const [autoSave, dispatch] = useReducer(reducer, initialState);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => setShowEditor(!!autoSave.editingID) , [autoSave.editingID])

  const editorOpen = () => {
    const newText = db.newMemo()
    dispatch({ type: 'edit', editingID: newText.id, value: newText.text })
  }

  const edit = text => {
    dispatch({ type: 'edit', editingID: text.id, value: text.text })
  }

  const storedText = texts.find(t => t.id === autoSave.editingID)
  const storedTextValue = storedText ? storedText.text : null

  const editingText = texts.find(t => t.id === autoSave.editingID) || new ImmutableText({id: autoSave.editingID})

  const cb = e => {
    const t = e.target.value;

    clearTimeout(autoSave.timeoutID)

    const timeoutID = setTimeout(() => {
      dispatch({ type: 'setPromise'})

      promise = promise.then(num => {
        return new Promise(resolve => {
          db.putMemo(editingText.getEdited(t))
            .then(() => {
              console.log('d')
              dispatch({ type: 'saved' })
              resolve(true)
            }).catch(e => {
              alert(`save failed!!: ${t}`)
              resolve(false)
            })
        })
      })
    }, 1500)

    dispatch({ type: 'willSave', timeoutID: timeoutID, value: t })
  }

  const superFunc = () => {
    switch (autoSave.state) {
      case 'willSave':
        clearTimeout(autoSave.timeoutID)
        db.putMemo(editingText.getEdited(autoSave.value)).then(() => {
          dispatch({ type: 'edit', editingID: null })
        })
      case 'setPromise':
        promise = promise.then(() => {
          dispatch({ type: 'edit', editingID: null })
          return new Promise(resolve => {
            resolve(1)
          })
        })
      default:
        dispatch({ type: 'edit', editingID: null })
    }
  }

  const menu = useMemo(() => <Menu />, [])

  return (
    <div className='rootContainer'>
      <Modal isActive={showEditor} inactivate={superFunc} content={<OpenedModal handleChange={cb} value={autoSave.value} />} />

      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

      <div className='CMain'>
        <div className='CTexts'>{ texts.map(t => <TextComponent edit={edit} key={t.id} data={t} />)}</div>
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
