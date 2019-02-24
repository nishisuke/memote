import React from 'react'
import firebase from 'firebase/app';

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
    if (this.state.value === '' && !this.props.docID) return;

    let db = firebase.firestore();
    let col = db.collection('texts')
    let doc = this.props.docID ? col.doc(this.props.docID) : col.doc()
    let data = {
      string: this.state.value,
      user_id: window.saveBrainAppFirebaseUser.uid,
      archived: false,
      archivedAt: new Date(2099, 3),
    }

    doc.set(data)
    //  .then(() => {
    //  this.setState({ texts: [...this.state.texts, {...data, id: hoge.id}]})
    //}).catch(e => {
    //  console.log(e)
    //  console.log('text write fail')
    //})
  }

  hideModal() {
    this.handleSubmit()
    this.props.unmountMe()
  }

  componentDidMount() {
    if (document.getElementsByClassName('modal is-active')[0]) {
      document.getElementById('ta').focus()
    }
  }

  render() {
    return (
      <div className={`modal is-active`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className='control is-loading'>
            <textarea id='ta' onChange={this.handleChange} value={this.state.value} onBlur={this.hideModal} className='textarea' rows='12' />
          </div>
        </div>
        <button className="modal-close is-large" onClick={this.hideModal} aria-label="close"></button>
      </div>
    )
  }
}
