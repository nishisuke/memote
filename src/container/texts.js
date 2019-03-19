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
    case 'edit': return { ...state, state: 'edit', editingID: action.editingID, value: action.value }
    case 'willSave': return {...state, state: 'willSave', value: action.value, timeoutID: action.timeoutID};
    case 'setPromise': return {...state, state: 'setPromise' }
    case 'saved': return { ...state, state: 'saved' }
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

  const edit = useCallback(text => dispatch({ type: 'edit', editingID: text.id, value: text.text }), [])

  const editingText = useMemo(() => {
    return (texts.find(t => t.id === autoSave.editingID) ||
      new ImmutableText({
        id: autoSave.editingID,
        pageXRate: 0.3 + (Math.random() / 20),
        pageYRate: 0.7 + (Math.random() / 20)
      }))
  }, [autoSave.editingID]) // textsは依存じゃない？

  const cb = useCallback(e => {
    const t = e.target.value;

    clearTimeout(autoSave.timeoutID)

    const timeoutID = setTimeout(() => {
      dispatch({ type: 'setPromise'})

      promise = promise.then(num => {
        return new Promise(resolve => {
          db.putMemo(editingText.getEdited(t))
            .then(() => {
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
  }, [autoSave.timeoutID, autoSave.editingID])

  const superFunc = useCallback(() => {
    switch (autoSave.state) {
      case 'willSave':
        // max1.5秒の遅延が起きる。モーダルを閉じても反映されてないという体験はいけてないので
        // 直ちにsave実行
        // ただし前のジョブより先に実行したくないので一応直列処理
        // (1.5秒なのでないと思うけど)
        clearTimeout(autoSave.timeoutID)

        promise = promise.then(num => {
          return new Promise(resolve => {
            db.putMemo(editingText.getEdited(autoSave.value))
              .then(() => resolve(true))
              .catch(e => {
                alert(`save failed!!: ${t}`)
                resolve(false)
              })
          })
        })

        // 書き込みを待ってからモーダルを閉じたくないので即閉じる
        dispatch({ type: 'edit', editingID: null })
      default:
        // setPromise:
        // firestoreのレイテンシ補正（ローカル書き込みイベントが早めに起こる）があるので、
        // モーダル閉じた直後に反映されてないと感じる体験は起きないので即終了
        // willsaveみたいにpromise.thenしても良い
        //
        // other: 普通に閉じておk
        dispatch({ type: 'edit', editingID: null })
    }
  }, [autoSave.state, autoSave.timeoutID, autoSave.value, autoSave.editingID])

  const showEditor = useMemo(() => !!autoSave.editingID, [autoSave.editingID]);

  useEffect(() => {
    if (showEditor) document.getElementById('ta').focus();
  }, [showEditor])

  const [showMenu, setShowMenu] = useState(false);
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
            <div className='has-text-primary' onClick={() => edit(db.newMemo())}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
            <div onClick={() => setShowMenu(true)}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
