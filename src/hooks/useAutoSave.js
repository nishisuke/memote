import React, { useReducer, useEffect, useMemo, useCallback } from 'react'
import db from '../db'

const STANDBY_ACT        = 'STANDBY'
const START_ACT          = 'START'
const SET_SAVING_JOB     = 'SET_SAVING'
const SAVE_ACT           = 'SAVE'
const SUCCESS_SAVING_ACT = 'SUCCESS_SAVING'
const FINISH_ACT         = 'FINISH'

const STANDBY_STATUS        = 'STANDBY_STATUS'
const STARTED_STATUS        = 'STARTED_STATUS'
const SET_SAVING_JOB_STATUS = 'SET_SAVING_JOB_STATUS'
const SAVING_STATUS         = 'SAVING_STATUS'
const SAVED_STATUS          = 'SAVED_STATUS'
const STOPPED_STATUS        = 'STOPPED_STATUS'

const reducer = (state, action) => {
  switch (action.type) {
    case STANDBY_ACT:    return { ...state, statusName: STANDBY_STATUS }
    case START_ACT:      return { ...state, statusName: STARTED_STATUS,    editingText: action.text }
    case SET_SAVING_JOB:   return { ...state, statusName: SET_SAVING_JOB_STATUS, timeoutID: action.timeoutID, editingText: action.editingText }
    case SAVE_ACT: return { ...state, statusName: SAVING_STATUS}
    case SUCCESS_SAVING_ACT:      return { ...state, statusName: SAVED_STATUS}
    case FINISH_ACT:    return { ...state, statusName: STOPPED_STATUS,  prevState: state.statusName                           }
    default: throw new Error();
  }
}

let promise = new Promise(resolve => {
  resolve(1)
})

const initialState = {
  statusName: STANDBY_STATUS,
  editingText: {},
  timeoutID: -1,
}

export default () => {
  const [autoSave, dispatch] = useReducer(reducer, initialState);

  const isEditing = useMemo(() => !(autoSave.statusName === STOPPED_STATUS || autoSave.statusName === STANDBY_STATUS), [autoSave.statusName])

  const change = useCallback(e => {
    if (!isEditing) {
      alert('editing is not started. this may be bug.')
      return
    }

    const t = e.target.value;

    clearTimeout(autoSave.timeoutID)

    const timeoutID = setTimeout(() => {
      dispatch({ type: SAVE_ACT})

      promise = promise.then(num => {
        return new Promise(resolve => {
          db.putMemo(autoSave.editingText.getEdited(t))
            .then(() => {
              dispatch({ type: SUCCESS_SAVING_ACT})
              resolve(true)
            }).catch(e => {
              alert(`save failed!!: ${t}`)
              resolve(false)
            })
        })
      })
    }, 1500)

    dispatch({ type: SET_SAVING_JOB, timeoutID: timeoutID, editingText: autoSave.editingText.getEdited(t) })
  }, [autoSave.timeoutID, isEditing, autoSave.editingText.id])

  useEffect(() => {
    if (autoSave.statusName !== STOPPED_STATUS) return;

    switch (autoSave.prevState) {
      case SET_SAVING_JOB_STATUS:
        clearTimeout(autoSave.timeoutID)

        promise = promise.then(num => {
          return new Promise(resolve => {
            db.putMemo(autoSave.editingText)
              .then(() => {
                dispatch({ type: STANDBY_ACT })
                resolve(true)
              })
              .catch(e => {
                alert(`save failed!!: ${t}`)
                resolve(false)
              })
          })
        })

        break;
      case SAVING_STATUS:
        promise = promise.then(() => {
          return new Promise(resolve => {
            dispatch({ type: STANDBY_ACT })
            resolve(1)
          })
        })
        break;
      default:
        dispatch({ type: STANDBY_ACT })
        break;
    }
  })

  return {
    statusName: autoSave.statusName,
    isEditing: isEditing,
    value: autoSave.editingText.text,
    change: change,
    startEditing: t => dispatch({ type: START_ACT, text: t }),
    finishEditing: () => dispatch({ type: FINISH_ACT }),
  }
}
