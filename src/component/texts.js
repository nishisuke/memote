import React, { useReducer } from 'react'

import db from '../db'
import OpenedModal from './modal'
import Text from './text'
import Menu from './menu'
import TextEditor from './textarea'

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
  const finishEditing = () => dispatch({ type: ACTION_FINISH_EDITING })

  const editingID = state.editingID
  const editing = props.texts.find(t => t.id === editingID) || { id: editingID, string: '' }

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

      <div className='mainContainer'>
        <div className='textsContainer'>
          { props.texts.map(text => <Text setEdit={setEditingFunc(text.id)} key={text.id} data={text} edit={setEditingFunc(text.id)} />)}
        </div>

        <div className='inputContainer'>
          <TextEditor docData={editing} />
          <div className='fixedActionContainer'>
            <div id='archiveIcon' className='item has-text-danger is-invisible'>
              <span className='icon is-large'>
                <i className='fas fa-archive fa-2x'></i>
              </span>
            </div>
            <div className='item has-text-primary' onClick={setEditingFunc(db.newMemo().id)} >
              <span className='icon is-large'>
                <i className='fas fa-pen fa-2x'></i>
              </span>
            </div>
            <div className='item' onClick={showMenu}>
              <span className='icon is-large'>
                <i className='fas fa-bars fa-2x'></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
