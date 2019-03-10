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
      modalPath: '',
      modalData: {},
      editing: { string: '' },
      editingID: db.newMemo().id,
    };

    this.showModal = this.showModal.bind(this);
    this.hide = this.hide.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.setEditing = this.setEditing.bind(this);
    this.createShowModal = this.createShowModal.bind(this);
  }

  setEditing(t) {
    let copy = { ...t }
    let id = copy.id
    delete copy.id
    return () => {
      this.setState({ editingID: id, editing: copy })
    }
  }

  hide() {
    this.setState({
      modalPath: '',
      modalData: {},
    });
  }

  showMenu() {
    this.setState({
      modalPath: '/menu',
      modalData: {},
    });
  }

  createShowModal() {
    let doc = db.newMemo()
    var d = {}
    if (window.innerWidth < 560) {
      d = {
        modalPath: '/new',
        modalData: { id: doc.id },
      }
    } else {
      d = {
        editingID: db.newMemo().id,
        editing: { string: '' },
      }
    }
    this.setState(d);
  }

  showModal(doc) {
    return () => {
      this.setState({
        modalPath: '/new',
        modalData: { ...doc },
      });
    }
  }

  render() {
    return (
      <div className='rootContainer'>
        <div className={`modal ${this.state.modalPath != '' ? 'is-active' : ''}`}>
          <div className='modal-background'></div>
          { this.state.modalPath == '/new' ?
            <OpenedModal unmountMe={this.hide} docData={this.state.modalData}/>
            : (this.state.modalPath == '/menu' ?
            <Menu close={this.hide} navigator={this.props.navigator} />
            : '')
          }
          <button className='modal-close is-large' onClick={this.hide} aria-label="close"></button>
        </div>

        <div className='mainContainer'>
          <div className='textsContainer'>
            { this.props.texts.map(text => <Text setEdit={this.setEditing(text)} key={text.id} data={text} edit={this.showModal(text)}/>)}
          </div>

          <div className='inputContainer'>
            <TextEditor targetID={this.state.editingID} docData={this.state.editing} />
            <div className='fixedActionContainer'>
              <div id='archiveIcon' className='item'>
                <span className='icon is-medium'>
                  <i className='fas fa-archive fa-lg'></i>
                </span>
                <br/>
                <small className='archiveLabel'>
                  move here
                </small>
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
