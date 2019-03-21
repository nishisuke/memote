import moment from 'moment'
import { Link } from 'react-router-dom';

import React from 'react'
import db from '../db'

export default class Archived extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      texts: [],
    };

    this.toggleArchiveFunc = this.toggleArchiveFunc.bind(this);
  }

  toggleArchiveFunc(id) {
    return () => {
      db.activateMemo(id)

      let arr = this.state.texts.filter(t => (t.id != id))
      this.setState({texts: [...arr]})
    }
  }

  componentDidMount() {
    db.fetchArchivedMemos(t => {
      this.setState({texts: [...this.state.texts, t]})
    })
  }

  render() {
    return (
      <div className='scrollContainer'>
      <div className='section'>
        <Link to='/' className='button'>back</Link>
        { this.state.texts.map(t =>
          <div key={t.id} className='box'>
            <p>{t.text}</p>
            <small>{moment.unix(t.archivedAt.seconds).fromNow()}</small><button className='button is-small' onClick={this.toggleArchiveFunc(t.id)}>戻す</button>
          </div>
        ) }
      </div>
      </div>
    )
  }
}
