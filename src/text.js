import React from 'react'

export default class Text extends React.Component {
   constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
      {`${this.props.data.write}: ${this.props.data.string}`}
      </div>
    )
  }
}
