import React from 'react'
import ReactGA from 'react-ga'
import SwipeableViews from 'react-swipeable-views';

import db from '../../db'
import useAutoSave from '../../hooks/useAutoSave'
import ImmutableText from '../../records/ImmutableText'
import useSubscribeTexts from '../../hooks/useSubscribeTexts'

import Editor from '../editor'
import TextsComponent from '../TextsComponent'
import Modal from '../Modal'
import Menu from '../menu'
import OldMemoListPage from '../OldMemoListPage'
import AutoDeletedMemoListPage from '../AutoDeletedMemoListPage'

const styles = {
   mainPage: {
     height: 'calc(100vh - 40px)',
   },
}

const isOld = (day, second) => {
  if (second < (Date.now() / 1000) - 3600 * 24 * day) {
    return true
  } else {
    return false
  }
}

export default () => {
  const texts = useSubscribeTexts()
  const autoSave = useAutoSave()
  const [tabs, setTabs] = React.useState(0)

  // editor
  const editorRef = React.useRef(null)
  React.useLayoutEffect(() => {
    if (autoSave.isEditing) editorRef.current.focus();
  }, [autoSave.isEditing])

  // menu
  const [showMenu, setShowMenu] = React.useState(false)
  const menu = React.useMemo(() => <Menu />, [])

  const onCreateAutoDelete = () => {
    autoSave.startEditing(db.newAutoDeleteMemo())
    ReactGA.event({
      category: 'memo',
      action: 'new-auto-delete',
      label: 'sp'
    });
  }

  const onCreate = () => {
    autoSave.startEditing(db.newMemo())
    ReactGA.event({
      category: 'memo',
      action: 'new',
      label: 'sp'
    });
  }
  const days = 7

  const noAutoDeleteTexts = texts.filter(t => {
    if (!t.autoDeleteAt) return true;
    return Date.now() < t.autoDeleteAt
  })
  const autoDeleted = texts.filter(t => {
    if (!t.autoDeleteAt) return false;
    return t.autoDeleteAt <= Date.now()
  })
  const oldTexts = noAutoDeleteTexts.filter(t => isOld(days, t.updatedAt.seconds))
  const newTexts = noAutoDeleteTexts.filter(t => !isOld(days, t.updatedAt.seconds))

  return (
    <React.Fragment>
      <Modal isActive={autoSave.isEditing} inactivate={autoSave.finishEditing} content={<Editor finish={autoSave.finishEditing} ref={editorRef} handleChange={autoSave.change} value={autoSave.value} />} />
      <Modal isActive={showMenu} inactivate={() => setShowMenu(false)} content={menu} />

      <div className="mytabs">
        <div onClick={() => setTabs(0)} className={ tabs === 0 ? 'mytab' : 'mytab unselected' }>直近</div>
        <div onClick={() => setTabs(1)} className={ tabs === 1 ? 'mytab' : 'mytab unselected' }>直近以外</div>
        <div onClick={() => setTabs(2)} className={ tabs === 2 ? 'mytab aut-del' : 'mytab aut-del unselected' }>自動削除済</div>
      </div>
      <SwipeableViews containerStyle={styles.mainPage} index={tabs} onChangeIndex={i => setTabs(i)}>
        <div>
          <TextsComponent texts={newTexts} startEditing={autoSave.startEditing} />
          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='has-text-danger is-invisible'>
              <span className='icon is-large'>
                <i className='fas fa-archive fa-2x'></i>
              </span>
            </div>
            <div id='add' className='pink-button' onClick={onCreateAutoDelete}>
              <span className='icon is-large'>
                <i className='fas fa-pen fa-2x'></i>
              </span>
              <br />
              <span className="font-small">
                三日で消える
              </span>
            </div>
            <div id='add' className='has-text-primary' onClick={onCreate}>
              <span className='icon is-large'>
                <i className='fas fa-pen fa-2x'></i>
              </span>
            </div>
            <div id='menu' onClick={() => setShowMenu(true)}>
              <span className='icon is-large'>
                <i className='fas fa-bars fa-2x'></i>
              </span>
            </div>
          </div>
        </div>
        <OldMemoListPage texts={oldTexts} edit={autoSave.startEditing} />
        <AutoDeletedMemoListPage texts={autoDeleted} />
      </SwipeableViews>
    </React.Fragment>
  )
}
