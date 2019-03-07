import React from 'react'

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
      editingID: null,
    };

    this.showModal = this.showModal.bind(this);
    this.hide = this.hide.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.setEditing = this.setEditing.bind(this);
  }

  setEditing(id) {
    return () => {
      this.setState({ editingID: id })
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

  showModal(doc) {
    return () => {
      this.setState({
        modalPath: '/new',
        modalData: { ...doc },
      });
    }
  }

  render() {
    let editing = this.props.texts.find(t => t.id == this.state.editingID) || {}

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
            { this.props.texts.map(text => <Text setEdit={this.setEditing(text.id)} key={text.id} data={text} edit={this.showModal(text)}/>)}
          </div>

          <div className='inputContainer'>
            <TextEditor editing={editing} />
            <div className='fixedActionContainer'>
              <div id='archiveIcon'>
                <span className='icon is-medium'>
                  <i className='fas fa-archive fa-lg'></i>
                </span>
                <br/>
                <small className='archiveLabel'>
                  move here
                </small>
              </div>
              <button className='button is-medium' onClick={this.showModal({})}>new</button>
              <button className='button is-medium' onClick={this.showMenu}>menu</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
