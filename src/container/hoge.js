import React from 'react'
import firebase from 'firebase/app'

import OpenedModal from './modal'
import Text from './text'
import Menu from './menu'
import db from '../db'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalPath: '',
      modalData: {},
    };

    this.showModal = this.showModal.bind(this);
    this.hide = this.hide.bind(this);
    this.showMenu = this.showMenu.bind(this);
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
    return (
      <div className='scroll'>
        <div className={`modal ${this.state.modalPath != '' ? 'is-active' : ''}`}>
          <div className='modal-background'></div>
          <div className="modal-content">
            { this.state.modalPath == '/new' ?
              <OpenedModal unmountMe={this.hide} docData={this.state.modalData}/>
              : (this.state.modalPath == '/menu' ?
              <Menu close={this.hide} navigator={this.props.navigator} />
              : '')
            }
          </div>
          <button className="modal-close is-large" onClick={this.props.close} aria-label="close"></button>
        </div>

        { this.props.texts.map(text => <Text key={text.id} data={text} edit={this.showModal(text)}/>)}

        <button className='button is-medium ab' onClick={this.showModal(null, {})}>memo</button>
        <button className='button is-medium menu' onClick={this.showMenu}>menu</button>
      </div>
    )
  }
}
