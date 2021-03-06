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
    case START_ACT:      return { ...state, statusName: STARTED_STATUS, editingText: action.text }
    case SET_SAVING_JOB:   return { ...state, statusName: SET_SAVING_JOB_STATUS, timeoutID: action.timeoutID, editingText: action.editingText }
    case SAVE_ACT: return { ...state, statusName: SAVING_STATUS}
    case SUCCESS_SAVING_ACT:      return { ...state, statusName: SAVED_STATUS}
    case FINISH_ACT:    return { ...state, statusName: STOPPED_STATUS, prevState: state.statusName }
    default: throw new Error();
  }
}

class SerialJobQueue {
  constructor() {
    this.queue = Promise.resolve(true)
  }

  next(prms) {
    this.queue = this.queue.then(() => prms)
  }

  do(cb) {
    this.queue = this.queue.then(cb)
  }
}

const queue = new SerialJobQueue

const initialState = {
  statusName: STANDBY_STATUS,
  editingText: {},
  timeoutID: -1,
}

export default () => {
  const [autoSave, dispatch] = useReducer(reducer, initialState);

  const isEditing = useMemo(() => !(autoSave.statusName === STOPPED_STATUS || autoSave.statusName === STANDBY_STATUS), [autoSave.statusName])

  const change = useCallback(e => {
    if (autoSave.statusName === STANDBY_STATUS) {
      // STOPPEDはだめ。iphone でキーボードの完了ボタン押すとchangeとfinishが同時くらいに走りそう（予想）
      alert('editing is not started. this may be bug.')
      return
    }

    const edited = autoSave.editingText.getEdited(e.target.value)

    clearTimeout(autoSave.timeoutID)

    const timeoutID = setTimeout(() => {
      const prms = new Promise(resolve => {
        db.putMemo(edited)
          .then(() => dispatch({ type: SUCCESS_SAVING_ACT }))
          .catch(e => alert(`save failed!!: ${edited.text}`))
          .finally(() => resolve(true))
      })

      dispatch({ type: SAVE_ACT })
      queue.next(prms)
    }, 1500)

    dispatch({ type: SET_SAVING_JOB, timeoutID: timeoutID, editingText: edited })
  }, [autoSave.timeoutID, autoSave.statusName, autoSave.editingText.id])

  useEffect(() => {
    if (autoSave.statusName !== STOPPED_STATUS) return;

    switch (autoSave.prevState) {
      case SET_SAVING_JOB_STATUS:
        clearTimeout(autoSave.timeoutID)

        const prms = new Promise(resolve => {
          db.putMemo(autoSave.editingText)
            .then(() => dispatch({ type: STANDBY_ACT }))
            .catch(e => alert(`save failed!!: ${t}`))
            .finally(() => resolve(true))
        })
        queue.next(prms)

        break;
      case SAVING_STATUS:
        queue.do(() => dispatch({ type: STANDBY_ACT }))
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
