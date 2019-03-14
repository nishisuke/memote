import React, { useReducer, useEffect } from 'react'

import db from '../db'
import Texts from '../component/texts'

const ACTION_ADD    = 'add'
const ACTION_CHANGE = 'change'
const ACTION_REMOVE = 'remove'

const textsReducer = (state, action) => {
  switch (action.type) {
    case ACTION_ADD:
      const atexts = [...state.texts]
      const i = atexts.findIndex(t => t.updatedAt <= action.text.updatedAt)
      atexts.splice(i, 0, action.text);
      return { texts: atexts }
    case ACTION_CHANGE:
      const texts = state.texts.filter(t => t.id != action.text.id)
      const is = texts.findIndex(t => t.updatedAt <= action.text.updatedAt)
     texts.splice(is, 0, action.text);
      return { texts: texts }
    case ACTION_REMOVE: return { texts: state.texts.filter(t => t.id != action.id)};
    default: throw new Error();
  }
}

export default props => {
  const [state, dispatch] = useReducer(textsReducer, { texts: [] })
  const texts = state.texts

  useEffect(() => {
    // return unsubscribe
    return db.subscribeMemos((id, data, type, meta) => {
      switch(type) {
        case 'added': dispatch({ type: ACTION_ADD, text: {...data, id: id} }); break;
        case 'modified': dispatch({ type: ACTION_CHANGE, text: {...data, id: id} }); break;
        case 'removed': dispatch({ type: ACTION_REMOVE, id: id }); break;
        default: throw new Error();
      }
    })
  }, [])

  return <Texts texts={texts} navigator={props.navigator} />;
}
