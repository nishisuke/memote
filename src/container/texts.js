import React, { useReducer, useEffect, useMemo } from 'react'

import db from '../db'
import OpenedModal from '../component/modal'
import Text from '../component/text'
import Menu from '../component/menu'
import TextEditor from '../component/textarea'
import useSubscribeTexts from '../hooks/useSubscribeTexts'

const ACTION_MENU = 'menu'
const ACTION_HIDE_MENU = 'hideMenu'
const ACTION_EDITING = 'editing'
const ACTION_FINISH_EDITING = 'finishEditing'

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_MENU:
      if (state.showMenu) return state;
      return { showMenu: true,  showTextareaModal: false, editingID: null };
    case ACTION_EDITING:
      if (state.showTextareaModal) return state;
      return { showMenu: false, showTextareaModal: true, editingID: action.id };
    case ACTION_HIDE_MENU:
      if (!state.showMenu) return state;
      return { ...state, showMenu: false };
    case ACTION_FINISH_EDITING:
      if (!state.showTextareaModal) return state;
      return { ...state, showTextareaModal: false, editingID: null };
    default: throw new Error();
  }
}

export default props => {
  const texts = useSubscribeTexts()

  const initialState = {
    showMenu: false,
    showTextareaModal: false,
    editingID: db.newMemo().id,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const showMenu = () => dispatch({ type: ACTION_MENU })
  const hideMenu = () => dispatch({ type: ACTION_HIDE_MENU })
  const setEditingFunc = id => {
    return () => {
      dispatch({ type: ACTION_EDITING, id: id })
    }
  }
  const setNewEditing = () => setEditingFunc(db.newMemo().id)()
  const finishEditing = () => dispatch({ type: ACTION_FINISH_EDITING })

  const editing = useMemo(() => (texts.find(t => t.id === state.editingID) || { id: state.editingID, string: '' }), [state.editingID])

  return (
    <div className='rootContainer'>
      <div className={`modal ${state.showTextareaModal && window.innerWidth < 560 ? 'is-active' : ''}`}>
        <div className='modal-background' onClick={finishEditing}></div>
        <OpenedModal unmountMe={finishEditing} docData={editing}/>
      </div>

      <div className={`modal ${state.showMenu ? 'is-active' : ''}`}>
        <div className='modal-background' onClick={hideMenu}></div>
        <Menu navigator={props.navigator} />
      </div>

      <div className='CMain'>
        <div className='CTexts'>{ texts.map(text => <Text setEdit={setEditingFunc(text.id)} key={text.id} data={text} edit={setEditingFunc(text.id)} />)}</div>
        <div className='inputContainer'>
          <TextEditor docData={editing} />

          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='has-text-danger is-invisible'><span className='icon is-large'><i className='fas fa-archive fa-2x'></i></span></div>
            <div className='has-text-primary' onClick={setNewEditing}><span className='icon is-large'><i className='fas fa-pen fa-2x'></i></span></div>
            <div onClick={showMenu}><span className='icon is-large'><i className='fas fa-bars fa-2x'></i></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
