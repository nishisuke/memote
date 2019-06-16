import { Link } from 'react-router-dom';

import React from 'react'
import ReactGA from 'react-ga';
import db from '../db'

export default class Archived extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      texts: [],
    };

    this.toggleArchiveFunc = this.toggleArchiveFunc.bind(this);
    this.ago = this.ago.bind(this);
  }

  toggleArchiveFunc(id) {
    return () => {
      db.activateMemo(id)

      let arr = this.state.texts.filter(t => (t.id != id))
      this.setState({texts: [...arr]})
    }
  }

  componentDidMount() {
    ReactGA.pageview('/archived')
    db.fetchArchivedMemos(t => {
      this.setState({texts: [...this.state.texts, t]})
    })
  }

  ago(seconds) {
    const now = Math.floor(Date.now() / 1000)
    if (now - seconds < 60) {
      return `${now - seconds} sec ago`
    } else if (now - seconds < 3600) {
      return `${Math.floor((now - seconds) / 60)} min ago`
    } else if (now - seconds < 3600 * 24) {
      return `${Math.floor((now - seconds) / 3600)} h ago`
    } else if (now - seconds < 3600 * 24 * 28) {
      return `${Math.floor((now - seconds) / (3600 * 24))} days ago`
    } else if (now - seconds < 3600 * 24 * 365) {
      return `${Math.floor((now - seconds) / (3600 * 24 * 28))} months ago`
    } else {
      return `${Math.floor((now - seconds) / (3600 * 24 * 365))} years ago`
    }
  }

  render() {
    return (
      <div className='scrollContainer'>
      <div className='section'>
        <p>最初の10件のみ表示中</p>

        <Link to='/' className='button'>back</Link>
        { this.state.texts.map(t =>
          <div key={t.id} className='box'>
            <p>{t.text}</p>
            <small>{this.ago(t.archivedAt.seconds)}</small><button className='button is-small' onClick={this.toggleArchiveFunc(t.id)}>戻す</button>
          </div>
        ) }
      </div>
      </div>
    )
  }
}
