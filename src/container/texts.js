import React, { useLayoutEffect, useRef, useState, useReducer, useEffect, useMemo, useCallback } from 'react'

import db from '../db'
import useAutoSave from '../hooks/useAutoSave'
import ImmutableText from '../records/ImmutableText'

import Editor from '../component/editor'
import TextsComponent from '../component/TextsComponent'
import Modal from '../component/Modal'
import Menu from '../component/menu'

export default () => {
  return window.innerWidth < 560 ? <SP /> : <PC />
}

const PC = () => {
  const autoSave = useAutoSave()

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
      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

      <div className='CMain'>
        <TextsComponent startEditing={autoSave.startEditing} />
        <div className='inputContainer'>
          <div className='editorContainer'><textarea ref={editorRef} onChange={autoSave.change} value={autoSave.value} /></div>
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

const SP = () => {
  const autoSave = useAutoSave()

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
        <TextsComponent startEditing={autoSave.startEditing} />
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
