import React from 'react'
import db from '../db'

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.docData.string || '',
      storeState: 'de',
      timeoutID: -1,
    };

    this.queueCurrentCondition = this.queueCurrentCondition.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.colorClass = this.colorClass.bind(this);
  }

  colorClass() {
    let s = this.state.storeState
    if ('stored' === s) return 'is-success';
    if ('shouldSaveImi' === s) return 'is-danger';
    if ('setTimeout' === s) return 'is-warning';

    return ''
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      storeState: 'shouldSave',
    });
  }

  hideModal() {
    clearTimeout(this.state.timeoutID)

    if (this.state.storeState === 'stored' || this.state.storeState === 'de') {
      this.props.unmountMe()
    } else {
    let copy = {...this.props.docData}
    let id = copy.id
    delete copy.id
    let text = this.state.value
    Object.assign(copy, { string: text })

    db.putMemo(id, copy)
      .then(this.props.unmountMe)
      .catch(() => {
        alert(`save failed: ${text}`)
this.props.unmountMe()
      });
    }
  }

  queueCurrentCondition() {
    clearTimeout(this.state.timeoutID)

    let copy = {...this.props.docData}
    let id = copy.id
    delete copy.id
    let text = this.state.value
    Object.assign(copy, { string: text })

    let timeoutID = setTimeout(() => {
    db.putMemo(id, copy)
      .then(() => {
        if (this.state.value === text) {
          this.setState({storeState: 'stored'})
        }
      })
      .catch(() => {
        this.setState({storeState: 'shouldSaveImi', failText: text})
      });
    }, this.state.storeState === 'shouldSaveImi' ? 100 : 1500);
    this.setState({
      timeoutID: timeoutID,
      storeState: 'setTimeout',
    })
  }

  componentDidMount() {
    document.getElementById('ta').focus()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    switch(this.state.storeState) {
      case  'shouldSave':
        this.queueCurrentCondition()
        break;
      case 'shouldSaveImi':
        this.queueCurrentCondition()
        break;
    }
  }

  render() {
    return (
      <div className='modal-content'>
        <div className={`control ${this.state.storeState === 'setTimeout' ? 'is-loading' : ''}`}>
          <textarea id='ta' onChange={this.handleChange} value={this.state.value} onBlur={this.hideModal} className={`textarea has-fixed-size ${this.colorClass()}`} rows='12' />
        </div>
      </div>
    )
  }
}
