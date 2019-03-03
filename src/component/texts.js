import React from 'react'

import OpenedModal from './modal'
import Text from './text'
import Menu from './menu'

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
          { this.state.modalPath == '/new' ?
            <OpenedModal unmountMe={this.hide} docData={this.state.modalData}/>
            : (this.state.modalPath == '/menu' ?
            <Menu close={this.hide} navigator={this.props.navigator} />
            : '')
          }
          <button className='modal-close is-large' onClick={this.hide} aria-label="close"></button>
        </div>

        <div className='textsContainer'>
          { this.props.texts.map(text => <Text key={text.id} data={text} edit={this.showModal(text)}/>)}
        </div>

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
          <button className='button is-medium' onClick={this.showModal(null, {})}>new</button>
          <button className='button is-medium' onClick={this.showMenu}>menu</button>
        </div>
      </div>
    )
  }
}
