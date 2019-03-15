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
    db.fetchArchivedMemos((id, data) => {
      this.setState({texts: [...this.state.texts, {...data, id: id}]})
    })
  }

  render() {
    return (
      <div>
        <Link to='/'>back</Link>
        { this.state.texts.map(t =>
          <div key={t.id}>
            <p>{t.string}<small>{moment.unix(t.archivedAt.seconds).fromNow()}</small></p>
            <button onClick={this.toggleArchiveFunc(t.id)}>復活</button>
          </div>
        ) }
      </div>
    )
  }
}
