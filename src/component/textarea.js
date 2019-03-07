import React from 'react'
import db from '../db'

export default class TA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      storeState: 'de',
      value: '',
    };

    this.store = this.store.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      storeState: 'shouldSave',
    });
  }

  store() {
    this.setState({
      storeState: 'timeoutExecuting',
    })
    db.updateText(this.props.editing.id, this.state.value)
      .then(() => {
        this.setState({
          storeState: 'stored',
        })
      })
      .catch(() => {
        this.setState({
          storeState: 'shouldSaveImi',
        })
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      console.log(this.state.storeState)
    if (this.props.editing.id && this.props.editing.id != prevProps.editing.id) {
      console.log('change doc')
      //全開のid 処理残ってないか確認したり
      this.setState({value: this.props.editing.string, storeState: 'de'})
      document.getElementById('editor').focus()
      return
    }

    if (this.state.storeState === 'shouldSave' || this.state.storeState === 'shouldSaveImi') {
      console.log('set job')
      clearTimeout(this.state.timeoutID)
      let timeoutID = setTimeout(this.store, this.state.storeState === 'shouldSaveImi' ? 10 : 1500);
      this.setState({
        timeoutID: timeoutID,
        storeState: 'setTimeout',
      })
    }
  }

  render() {
    return (
      <textarea className='editor' onChange={this.handleChange} value={this.state.value} id='editor' />
    );
  }
}
