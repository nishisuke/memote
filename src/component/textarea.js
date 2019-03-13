import React from 'react'
import db from '../db'

import { colorClass } from './comt'

export default class TA extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: props.targetID,
      saveState: 'notChanged',
      value: props.docData.string,
      doc: props.docData,
      timeoutID: -1,
      failID: null,
      failText: null,
    };
 
    this.update = this.update.bind(this);
    this.replaceUpdateJob = this.replaceUpdateJob.bind(this);
    this.detectPropChange = this.detectPropChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      saveState: 'changed',
    });
  }

  detectPropChange() {
    document.getElementById('editor').focus()

    switch(this.state.saveState) {
      case 'willSave':
        clearTimeout(this.state.timeoutID)
        let id = this.state.id
        let t = this.state.value
        let v = Object.assign({}, this.state.doc, { string: t })
        db.putMemo(id, v).catch(() => { alert(`fail ${t}`) })

        this.setState({id: this.props.targetID, doc: this.props.docData, value: this.props.docData.string, saveState: 'notChanged', timeoutID: -1})
        break;
      case 'notChanged':
      case 'saved':
      case 'saving':
        // willSaveはtimeoutIDを変えることで前のjobが死なないようにするからok
        this.setState({id: this.props.targetID, doc: this.props.docData, value: this.props.docData.string, saveState: 'notChanged', timeoutID: -1})
        break;
      default:
        // changed
        alert('not saved: this is rare case.') // 雑に対処
    }
  }

  update(id, data) {
    db.putMemo(id, data)
      .then(() => {
        if (id === this.state.id && this.state.value === data.string) {
          this.setState({ saveState: 'saved' })
        }
      })
      .catch(e => {
        alert(`update failed: "${data.string}"`);
        console.error(e)
      });
  }

  replaceUpdateJob() {
    clearTimeout(this.state.timeoutID)
    let id = this.state.id
    let v = Object.assign({}, this.state.doc, { string: this.state.value })
    let timeoutID = setTimeout(() => {
      this.setState({ saveState: 'saving' })
    
      this.update(id, v)
    }, 1500);
    this.setState({
      timeoutID: timeoutID,
      saveState: 'willSave',
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.targetID != this.props.targetID) {
      console.log('prop changed')
      this.detectPropChange()
    } else { // prop のstrの違いに反応しないように
      console.log(this.state.saveState)
      switch(this.state.saveState) {
        case 'changed':
          this.replaceUpdateJob()
          break;
      }
    }
  }

  componentDidMount() {
    document.getElementById('editor').focus()
    window.addEventListener('beforeunload', e => {
      if (!(this.state.saveState === 'notChanged' || this.state.saveState === 'saved')) {
        e.returnValue = 'not saved'
      }
    })
  }

  render() {
    return (
      <div className={`editorContainer control ${this.state.saveState === 'willSave' ? 'is-loading' : ''}`}>
        <textarea className={`textarea has-fixed-size editor ${colorClass(this.state.saveState)}`} onChange={this.handleChange} value={this.state.value} id='editor' />
      </div>
    );
  }
}
