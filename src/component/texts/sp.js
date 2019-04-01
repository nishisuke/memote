import React from 'react'

import db from '../../db'
import useAutoSave from '../../hooks/useAutoSave'
import ImmutableText from '../../records/ImmutableText'

import Editor from '../editor'
import TextsComponent from '../TextsComponent'
import Modal from '../Modal'
import Menu from '../menu'

export default () => {
  const autoSave = useAutoSave()

  // editor
  const editorRef = React.useRef(null)
  React.useLayoutEffect(() => {
    if (autoSave.isEditing) editorRef.current.focus();
  }, [autoSave.isEditing])

  // menu
  const [showMenu, setShowMenu] = React.useState(false)
  const menu = React.useMemo(() => <Menu />, [])

  return (
    <React.Fragment>
      <Modal isActive={autoSave.isEditing} inactivate={autoSave.finishEditing} content={<Editor finish={autoSave.finishEditing} ref={editorRef} handleChange={autoSave.change} value={autoSave.value} />} />
      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

      <TextsComponent startEditing={autoSave.startEditing} />
      <div className='fixedActionContainer'>
        <div id='archiveIcon' className='has-text-danger is-invisible'><span className='icon is-large'><i className='fas fa-archive fa-2x'></i></span></div>
        <div id='add' className='has-text-primary' onClick={() => autoSave.startEditing(db.newMemo())}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
        <div id='menu' onClick={() => setShowMenu(true)}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
      </div>
    </React.Fragment>
  )
}
