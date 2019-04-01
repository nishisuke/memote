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

  React.useEffect(() => {
    autoSave.startEditing(db.newMemo())
  }, []) // pcの場合最初からediting

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
      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

      <div className='CMain'>
        <TextsComponent startEditing={autoSave.startEditing} />
        <div className='inputContainer'>
          <div className='editorContainer'>
            <textarea placeholder='hogehoge..' rows='8' className='textarea has-fixed-size editor' ref={editorRef} onChange={autoSave.change} value={autoSave.value} />
          </div>
          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='has-text-danger is-invisible'><span className='icon is-large'><i className='fas fa-archive fa-2x'></i></span></div>
            <div id='add' className='has-text-primary' onClick={() => autoSave.startEditing(db.newMemo())}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
            <div id='menu' onClick={() => setShowMenu(true)}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

