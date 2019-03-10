import React from 'react'
import db from '../db'

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
      storeState: 'de',
      timeoutID: null,
      failText: null,
    };

    this.cancelSaving = this.cancelSaving.bind(this);
    this.saveTextAfter = this.saveTextAfter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.colorClass = this.colorClass.bind(this);
  }

  colorClass() {
    switch(this.state.storeState) {
      case 'saved':        return 'is-success';
      case 'savingFailed': return 'is-danger';
      case 'de':           return '';
      default:             return 'is-warning';
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      storeState: 'shouldBeSaved',
    });
  }

  hideModal() {
    this.setState({storeState: 'willBeFinished'})
  }

  cancelSaving() {
    clearTimeout(this.state.timeoutID)
  }

  saveTextAfter(milsec) {
    let text = this.state.value
    let d = Object.assign({}, this.state.docData, { string: text })

    let timeoutID = setTimeout(() => {
      this.setState({storeState: 'beingSaved', timeoutID: null, failText: null})
      db.putMemo(this.state.docID, d)
        .then(() => {
          if (this.state.storeState === 'beingSaved') {
            this.setState({storeState: 'saved'})
          } else if (this.state.storeState === 'willBeFinished') {
            this.setState({storeState: 'canBeFinished'})
          }
        })
        .catch(() => {
          if (this.state.storeState === 'willBeFinished') {
            alert(`save fail: ${text}`)
            this.setState({storeState: 'canBeFinished'})
          } else {
            this.setState({storeState: 'savingFailed', failText: text})
          }
        });
    }, milsec);
    this.setState({
      timeoutID: timeoutID,
      storeState: 'willBeSaved',
    })
  }

  componentDidMount() {
    document.getElementById('ta').focus()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.docData.id !== this.props.docData.id) {
      alert('予期しないケースが発生しました。アプリを終了してください');
      return;
    }

    console.log(this.state.storeState)
    switch(this.state.storeState) {
      case 'shouldBeSaved':
        this.cancelSaving();
        this.saveTextAfter(1500)
        break;
      case 'savingFailed':
        if (prevState.storeState === 'beingSaved') {
          this.cancelSaving();
          this.saveTextAfter(100)
        }
        break;
      case 'willBeFinished':
        switch(prevState.storeState) {
          case 'willBeSaved':
            this.cancelSaving()
            let text = this.state.value
            let d = Object.assign({}, this.state.docData, { string: text })

            db.putMemo(this.state.docID, d)
              .catch(() => {
                alert(`save failed: ${text}`)
              });
            this.setState({ storeState: 'canBeFinished' })
            break;
          case 'beingSaved':
            break;
          default:
            this.setState({ storeState: 'canBeFinished' })
            break;
        }
        break;
      case 'canBeFinished':
        this.props.unmountMe()
        break;
    }
  }

  render() {
    return (
      <div className='modal-content'>
        <div className={`control ${this.state.storeState === 'willBeSaved' ? 'is-loading' : ''}`}>
          <textarea id='ta' onChange={this.handleChange} value={this.state.value} onBlur={this.hideModal} className={`textarea has-fixed-size ${this.colorClass()}`} rows='12' />
        </div>
      </div>
    )
  }
}
