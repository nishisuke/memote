import React from 'react'

import OpenedModal from './modal'
import Text from './text'
import Menu from './menu'
import db from '../db'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      texts: [],
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

  componentDidMount() {
    let unsubscribe = db.subscribeMemos((id, data, isRemoved, meta) => {
      let removed = this.state.texts.filter(t => (t.id != id))
      if (!isRemoved) { removed.push({...data, id: id }) }
      this.setState({ texts: removed })
    })
    this.setState({ unsubscribeFunc: unsubscribe })
  }

  componentWillUnmount() {
    if (this.state.unsubscribeFunc) { this.state.unsubscribeFunc() }
  }

  render() {
    return (
      <div className='mainContainer'>
        <div className='textContainer'>
          { this.state.texts.map(text => <Text key={text.id} data={text} edit={this.showModal(text)}/>)}
        </div>

        <div className='inputContainer'>
          <textarea className='editor is-size-6' />
          <button className='button is-medium menu' onClick={this.showMenu}>menu</button>
        </div>

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
      </div>
    )
  }
}
