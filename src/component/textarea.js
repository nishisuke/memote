import React from 'react'
import db from '../db'

export default class TA extends React.PureComponent {
  constructor(props) {
    super(props);




    this.state = {
      id: props.targetID,
      innerState: 'notChanged',
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
    this.colorClass = this.colorClass.bind(this);
  }

  colorClass() {
    let s = this.state.innerState
    if ('saved' === s) return 'is-success';
    if ('updateFailed' === s) return 'is-danger';
    if ('willSave' === s) return 'is-warning';

    return ''
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      innerState: 'changed',
    });
  }

  detectPropChange() {
    document.getElementById('editor').focus()

    switch(this.state.innerState) {
      case 'notChanged':
      case 'saved':
      case 'willSave':
        // willSaveはtimeoutIDを変えることで前のjobが死なないようにするからok
        this.setState({id: this.props.targetID, doc: this.props.docData, value: this.props.docData.string, innerState: 'notChanged', timeoutID: -1})
        break;
      default:
        // changed
        // updateFailed
        alert('not saved: this is rare case.') // 雑に対処
    }
  }

  update(id, data) {
    db.putMemo(id, data)
      .then(() => {
        if (id === this.state.id && this.state.value === data.string) {
          this.setState({ innerState: 'saved' })
        }
      })
      .catch(e => {
        console.error(e)
        this.setState({innerState: 'updateFailed', failID: id, failText: t})
      });
  }

  replaceUpdateJob() {
    clearTimeout(this.state.timeoutID)
    let id = this.state.id
    let v = Object.assign({}, this.state.doc, { string: this.state.value })
    let timeoutID = setTimeout(() => {
      this.update(id, v)
    }, 1500);
    this.setState({
      timeoutID: timeoutID,
      innerState: 'willSave',
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.targetID != this.props.targetID) {
      console.log('prop changed')
      this.detectPropChange()
    } else { // prop のstrの違いに反応しないように
      console.log(this.state.innerState)
      switch(this.state.innerState) {
        case 'changed':
          this.replaceUpdateJob()
          break;
        case 'updateFailed':
          let id = this.state.id
          if (this.state.failID === id) {
            let v = Object.assign({}, this.state.doc, { string: this.state.value })
            this.setState({ innerState: 'willSave' })
            this.update(id, v)
          } else {
            alert(`update failed: "${this.state.failText}"`);
          }
          break;
      }
    }
  }

  componentDidMount() {
    document.getElementById('editor').focus()
    window.addEventListener('beforeunload', e => {
      if (!(this.state.innerState === 'notChanged' || this.state.innerState === 'saved')) {
        e.returnValue = 'not saved'
      }
    })
  }

  render() {
    return (
      <div className={`editorContainer control ${this.state.innerState === 'willSave' ? 'is-loading' : ''}`}>
        <textarea className={`textarea has-fixed-size editor ${this.colorClass()}`} onChange={this.handleChange} value={this.state.value} id='editor' />
      </div>
    );
  }
}
