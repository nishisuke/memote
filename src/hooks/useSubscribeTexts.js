import React, { useReducer, useEffect } from 'react'
import db from '../db'

const reducer = (state, action) => {
  const newText = action.text
  const newTexts = state.texts.filter(t => t.id !== newText.id)

  if (!action.isRemoved) {
    const i = newTexts.findIndex(t => t.updatedAt <= newText.updatedAt)
    newTexts.splice(i, 0, newText);
  }

  return { texts: newTexts }
}

const initialState = { texts: [] }

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    // return unsubscribe
    return db.subscribeMemos((text, isRemoved) => {
      dispatch({ text: text, isRemoved: isRemoved })
    })
  }, [])

  return state.texts
}
