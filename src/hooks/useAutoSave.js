import React, { useReducer, useEffect, useMemo, useCallback } from 'react'
import db from '../db'

const reducer = (state, action) => {
  switch (action.type) {
    case 'waiting':    return { ...state, statusName: 'waiting'                                                    }
    case 'begin':      return { ...state, statusName: 'begin',    value: action.text.text, id: action.text.id, editingText: action.text }
    case 'willSave':   return { ...state, statusName: 'willSave', value: action.value, timeoutID: action.timeoutID }
    case 'setPromise': return { ...state, statusName: 'setPromise'                                                 }
    case 'saved':      return { ...state, statusName: 'saved'                                                      }
    case 'stopped':    return { ...state, statusName: 'stopped',  prevState: state.statusName                           }
    default: throw new Error();
  }
}

let promise = new Promise(resolve => {
  resolve(1)
})

const initialState = {
  statusName: 'waiting',
  editingText: {},
  timeoutID: -1,
  value: '', // 終了時にcleartimeoutして即時実行する時必要
}

export default () => {
  const [autoSave, dispatch] = useReducer(reducer, initialState);

  const editingText = autoSave.editingText

  const change = useCallback(e => {
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
  }, [autoSave.timeoutID, editingText.id])

  useEffect(() => {
    if (autoSave.statusName !== 'stopped') return;

    switch (autoSave.prevState) {
      case 'willSave':
        clearTimeout(autoSave.timeoutID)

        promise = promise.then(num => {
          return new Promise(resolve => {
            db.putMemo(editingText.getEdited(autoSave.value))
              .then(() => {
                dispatch({ type: 'waiting' })
                resolve(true)
              })
              .catch(e => {
                alert(`save failed!!: ${t}`)
                resolve(false)
              })
          })
        })

        break;
      case 'setPromise':
        promise = promise.then(() => {
          return new Promise(resolve => {
            dispatch({ type: 'waiting' })
            resolve(1)
          })
        })
        break;
      default:
        dispatch({ type: 'waiting' })
        break;
    }
  }, [autoSave.statusName])

  return {
    statusName: autoSave.statusName,
    value: autoSave.value,
    change: change,
    startEditing: t => dispatch({ type: 'begin', text: t }),
    finishEditing: () => dispatch({ type: 'stopped' }),
  }
}
