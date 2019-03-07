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
      db.updateText(this.props.docData.id, this.state.value).then(this.props.unmountMe)
    }
  }

  componentDidMount() {
    document.getElementById('ta').focus()
    window.addEventListener('beforeunload', e => {
      if (this.state.storeState === 'de' || this.state.storeState === 'stored') {
      } else {
        e.returnValue = '本当にページ移動しますか？';
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.storeState === 'shouldSave' || this.state.storeState === 'shouldSaveImi') {
      clearTimeout(this.state.timeoutID)
      let id = this.props.docData.id
      let text = this.state.value
      let timeoutID = setTimeout(() => {
        db.updateText(id, text)
          .then(() => {
            if (this.state.value === text) {
              this.setState({storeState: 'stored'})
            }
          })
          .catch(() => {
            this.setState({storeState: 'shouldSaveImi'})
          });
      }, this.state.storeState === 'shouldSaveImi' ? 10 : 1500);
      this.setState({
        timeoutID: timeoutID,
        storeState: 'setTimeout',
      })
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
