import React from 'react'

import db from '../db'
import OpenedModal from './modal'
import Text from './text'
import Menu from './menu'
import TextEditor from './textarea'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      showTextarea: false,
      editingID: db.newMemo().id,
    };

    this.showModal = this.showModal.bind(this);
    this.hide = this.hide.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.setEditing = this.setEditing.bind(this);
    this.createShowModal = this.createShowModal.bind(this);
  }

  setEditing(t) {
    return () => {
      this.setState({ editingID: t.id })
    }
  }

  hide() {
    this.setState({
      showMenu: false,
      showTextarea: false,
    });
  }

  showMenu() {
    this.setState({
      showMenu: true,
      showTextarea: false,
    });
  }

  createShowModal() {
    let doc = db.newMemo()
    var d = {}
    if (window.innerWidth < 560) {
      d = {
        showTextarea: true,
        showMenu: false,
        editingID: doc.id,
      }
    } else {
      d = { editingID: db.newMemo().id }
    }
    this.setState(d);
  }

  showModal(doc) {
    return () => {
      this.setState({
        showTextarea: true,
        showMenu: false,
        editingID: doc.id,
      });
    }
  }

  render() {
    let editingID = this.state.editingID
    let editing = this.props.texts.find(t => t.id === editingID) || { id: editingID, string: '' }

    return (
      <div className='rootContainer'>
        <div className={`modal ${this.state.showTextarea ? 'is-active' : ''}`}>
          <div className='modal-background' onClick={this.hide}></div>
          { this.state.showTextarea ? <OpenedModal unmountMe={this.hide} docData={editing}/> : '' }
          <button className='modal-close is-large' onClick={this.hide} aria-label="close"></button>
        </div>

        <div className={`modal ${this.state.showMenu ? 'is-active' : ''}`}>
          <div className='modal-background' onClick={this.hide}></div>
          <Menu close={this.hide} navigator={this.props.navigator} />
          <button className='modal-close is-large' onClick={this.hide} aria-label="close"></button>
        </div>

        <div className='mainContainer'>
          <div className='textsContainer'>
            { this.props.texts.map(text => <Text setEdit={this.setEditing(text)} key={text.id} data={text} edit={this.showModal(text)} />)}
          </div>

          <div className='inputContainer'>
            <TextEditor docData={editing} />
            <div className='fixedActionContainer'>
              <div id='archiveIcon' className='item has-text-danger is-invisible'>
                <span className='icon is-large'>
                  <i className='fas fa-archive fa-2x'></i>
                </span>
              </div>
              <div className='item has-text-primary' onClick={this.createShowModal} >
                <span className='icon is-large'>
                  <i className='fas fa-pen fa-2x'></i>
                </span>
              </div>
              <div className='item' onClick={this.showMenu}>
                <span className='icon is-large'>
                  <i className='fas fa-bars fa-2x'></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
