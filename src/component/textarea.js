import React from 'react'

export default class TA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.editing.id) return;
    
    if (this.props.editing.id != prevProps.editing.id) {
      this.setState({value: this.props.editing.string})
      document.getElementById('editor').focus()
    }
  }

  render() {
    return (
      <textarea className='editor' onChange={this.handleChange} value={this.state.value} id='editor' />
    );
  }
}
