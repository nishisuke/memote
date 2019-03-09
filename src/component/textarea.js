import React from 'react'
import db from '../db'

export default class TA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      innerState: 'waiting',
      value: '',
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
    if ('updated' === s) return 'is-success';
    if ('updateFailed' === s) return 'is-danger';
    if ('willUpdate' === s) return 'is-warning';

    return ''
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      innerState: 'shouldSave',
    });
  }

  componentDidMount() {
    window.addEventListener('beforeunload', e => {
      if (this.state.innerState === 'waiting' || this.state.innerState === 'updated') {
      } else {
        e.returnValue = '本当にページ移動しますか？';
      }
    })
  }

  detectPropChange() {
    console.log('prop changed')
    document.getElementById('editor').focus()

    switch(this.state.innerState) {
      case 'shouldSave':
        if (!this.state.id) {
          db.createMemo(this.state.value).then(() => {
            this.setState({id: this.props.doc.id, value: this.props.doc.string, innerState: 'waiting', timeoutID: -1})
          })
        }
        break;
      case 'updateFailed':
        alert(`not saved: "${this.state.failText}"`);
        break;
      default:
        this.setState({id: this.props.doc.id, value: this.props.doc.string, innerState: 'waiting', timeoutID: -1})
    }
  }

  update(id, t) {
    db.updateText(id, t)
      .then(() => {
        if (id === this.state.id && this.state.value === t) {
          this.setState({ innerState: 'updated' })
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
    let text = this.state.value
    let timeoutID = setTimeout(() => {
      this.update(id, text)
    }, 1500);
    this.setState({
      timeoutID: timeoutID,
      innerState: 'willUpdate',
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.doc.id != this.props.doc.id) {
      this.detectPropChange()
    } else if (prevProps.doc.string == this.props.doc.string) { // prop のstrの違いに反応しないように
      console.log(this.state.innerState)
      switch(this.state.innerState) {
        case 'shouldSave':
          if (this.state.id) {
            this.replaceUpdateJob()
          }
          break;
        case 'updateFailed':
          let id = this.state.id
          if (this.state.failID === id) {
            let val = this.state.value
            this.setState({ innerState: 'willUpdate' })
            this.update(id, val)
          } else {
            alert(`update failed: "${this.state.failText}"`);
          }
          break;
      }
    }
  }

  render() {
    return (
      <div className={`editorContainer control ${this.state.innerState === 'willUpdate' ? 'is-loading' : ''}`}>
        <textarea className={`textarea has-fixed-size editor ${this.colorClass()}`} onChange={this.handleChange} value={this.state.value} id='editor' />
      </div>
    );
  }
}
