import React from 'react'
import db from '../db'

import { colorClass } from './comt'

export default class Modal extends React.PureComponent {
  constructor(props) {
    super(props);

    let d = {...props.docData};
    let id = d.id
    delete d.id
    this.state = {
      value: d.string || '',
      docData: d,
      docID: id,
      saveState: 'notChanged',
      timeoutID: null,
      failText: null,
    };

    this.cancelSaving = this.cancelSaving.bind(this);
    this.saveTextAfter = this.saveTextAfter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  handleChange(event) {
    if (this.state.saveState === 'willBeFinished') {
      alert('finishing edit');
      return;
    }
    this.setState({
      value: event.target.value,
      saveState: 'changed',
    });
  }

  hideModal() {
    this.setState({saveState: 'willBeFinished'})
  }

  cancelSaving() {
    clearTimeout(this.state.timeoutID)
  }

  saveTextAfter(milsec) {
    let text = this.state.value
    let d = Object.assign({}, this.state.docData, { string: text })

    let timeoutID = setTimeout(() => {
      this.setState({saveState: 'saving', timeoutID: null, failText: null})
      db.putMemo(this.state.docID, d)
        .then(() => {
          if (this.state.value === text) {
            this.setState({saveState: 'saved'})
          }
        })
        .catch(() => {
          alert(`save fail: ${text}`)
          if (this.state.saveState === 'willBeFinished') {
            this.props.unmountMe()
          }
        });
    }, milsec);
    return timeoutID;
  }

  componentDidMount() {
    document.getElementById('ta').focus()
  }

  componentDidUpdate(prevProps, prevState) {
    switch(this.state.saveState) {
      case 'changed':
        this.cancelSaving();
        let tid = this.saveTextAfter(1500)
        this.setState({
          timeoutID: tid,
          saveState: 'willSave',
        })
        break;
      case 'willBeFinished':
        switch(prevState.saveState) {
          case 'willSave':
            this.cancelSaving()
            let text = this.state.value
            let d = Object.assign({}, this.state.docData, { string: text })

            db.putMemo(this.state.docID, d)
              .catch(() => {
                alert(`save failed: ${text}`)
              });
            this.props.unmountMe()
            break;
          case 'saving':
            alert('saving')
            break;
          default:
            this.props.unmountMe()
            break;
        }
        break;
    }
  }

  render() {
    return (
      <div className='modal-content'>
        <div className={`control ${this.state.saveState === 'willSave' ? 'is-loading' : ''}`}>
          <textarea id='ta' onChange={this.handleChange} value={this.state.value} onBlur={this.hideModal} className={`textarea has-fixed-size ${colorClass(this.state.saveState)}`} rows='12' />
        </div>
      </div>
    )
  }
}
