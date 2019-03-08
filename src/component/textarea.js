import React from 'react'
import db from '../db'

export default class TA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      storeState: 'de',
      value: '',
      timeoutID: -1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.colorClass = this.colorClass.bind(this);
  }

  colorClass() {
    let s = this.state.storeState
    if ('stored' === s) return 'is-success';
    if ('shouldSaveImi' === s) return 'is-danger';
    if ('setTimeout' === s) return 'is-warning';

    return ''
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      storeState: 'shouldSave',
    });
  }

  componentDidMount() {
    window.addEventListener('beforeunload', e => {
      if (this.state.storeState === 'de' || this.state.storeState === 'stored') {
      } else {
        e.returnValue = '本当にページ移動しますか？';
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.editing.id && this.props.editing.id != prevProps.editing.id) {
      document.getElementById('editor').focus()

      if (this.state.storeState === 'de' || this.state.storeState === 'stored') {
        this.setState({id: this.props.editing.id, value: this.props.editing.string, storeState: 'de', timeoutID: -1})
      } else {
        // 処理中にdoc変わった
        // 処理失敗があるのでidなど変えたくない
        alert('保存中です。')
      }
    } else if (this.props.editing.id && (this.state.storeState === 'shouldSave' || this.state.storeState === 'shouldSaveImi')) {
      clearTimeout(this.state.timeoutID)
      let id = this.state.id
      let text = this.state.value
      let timeoutID = setTimeout(() => {
        db.updateText(id, text)
          .then(() => {
            if (this.state.value === text) {
              this.setState({storeState: 'stored'})
            }
          })
          .catch(() => {
            this.setState({storeState: 'shouldSaveImi'})
          });
      }, this.state.storeState === 'shouldSaveImi' ? 10 : 1500);
      this.setState({
        timeoutID: timeoutID,
        storeState: 'setTimeout',
      })
    }
  }

  render() {
    return (
      <div className={`editorContainer control ${this.state.storeState === 'setTimeout' ? 'is-loading' : ''}`}>
        <textarea className={`textarea has-fixed-size editor ${this.colorClass()}`} onChange={this.handleChange} value={this.state.value} id='editor' />
      </div>
    );
  }
}
