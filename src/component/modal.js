import React from 'react'
import db from '../db'

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.docData.string || '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    if (this.state.value === '' && !this.props.docData.id) return;

    if (this.props.docData.id) {
      db.updateText(this.props.docData.id, this.state.value)
    } else {
      db.createMemo(this.state.value)
    }
  }

  hideModal() {
    this.handleSubmit()
    this.props.unmountMe()
  }

  componentDidMount() {
    document.getElementById('ta').focus()
  }

  render() {
    return (
      <div className='modal-content'>
        <div className='control is-loading'>
          <textarea id='ta' onChange={this.handleChange} value={this.state.value} onBlur={this.hideModal} className='textarea' rows='12' />
        </div>
      </div>
    )
  }
}
