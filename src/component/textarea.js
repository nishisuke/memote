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
 
    this.replaceUpdateJob = this.replaceUpdateJob.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      saveState: 'changed',
    });
  }

  replaceUpdateJob() {
    clearTimeout(this.state.timeoutID)
    let id = this.state.id
    let v = Object.assign({}, this.state.doc, { string: this.state.value })
    let timeoutID = setTimeout(() => {
      this.setState({ saveState: 'saving' })

      db.putMemo(id, v)
        .then(() => {
          if (id === this.state.id && this.state.value === v.string) {
            this.setState({ saveState: 'saved' })
          }
        })
        .catch(e => {
          alert(`update failed: "${v.string}"`);
          console.error(e)
        });
    }, 1500);
    this.setState({
      timeoutID: timeoutID,
      saveState: 'willSave',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.targetID != this.props.targetID) {
      document.getElementById('editor').focus()
      console.log('prop changed')
      this.setState({ saveState: 'willBeFinished', nextID: this.props.targetID, nextDoc: this.props.docData })
    } else {
      console.log(this.state.saveState)
      switch(this.state.saveState) {
        case 'changed':
          this.replaceUpdateJob()
          break;
        case 'willBeFinished':
          switch(prevState.saveState) {
            case 'willSave':
              clearTimeout(this.state.timeoutID)

              let id = this.state.id
              let t = this.state.value
              let v = Object.assign({}, this.state.doc, { string: t })
              db.putMemo(id, v).catch(() => { alert(`fail ${t}`) })

              this.setState({id: this.state.nextID, doc: this.state.nextDoc, value: this.state.nextDoc.string, saveState: 'notChanged', timeoutID: -1})
              break;
            case 'saving':
              alert('saving')
              break;
            default:
              this.setState({id: this.state.nextID, doc: this.state.nextDoc, value: this.state.nextDoc.string, saveState: 'notChanged', timeoutID: -1})
          }
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
