import React from 'react'
import db from '../db'

export default class TA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.storeIfNeed = this.storeIfNeed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value, lastEdit: Date.now() });
  }

  storeIfNeed() {
    if (this.state.before == this.state.value) return;
    if (!this.props.editing.id) return;
    if (Date.now() - this.state.lastEdit < 1000) return;

    let current = this.state.value
    db.updateText(this.props.editing.id, current)
      .then(() => {
        console.log('boom')
        this.setState({ before: current })
      })
      .catch(console.error);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.editing.id) {
      if (this.setState.intervalID) {
        clearInterval(this.setState.intervalID)
        this.setState({intervalID: null, before: '', value: '', lastEdit: null})
      }
      
      return;
    } else if (this.props.editing.id != prevProps.editing.id) {
      let intervalID = setInterval(this.storeIfNeed, 1500)
      this.setState({intervalID: intervalID, before: this.props.editing.string, value: this.props.editing.string, lastEdit: Date.now()})
      document.getElementById('editor').focus()
    }
  }

  render() {
    return (
      <textarea className='editor' onChange={this.handleChange} value={this.state.value} id='editor' />
    );
  }
}
