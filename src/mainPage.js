import React from 'react'

import OpenedModal from './modal'
import Text from './text'
import Menu from './menu'
import db from './db'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      texts: [],
      showModal: false,
      showMenu: false,
      modalID: null,
      modalDoc: {},
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }

  hideModal() {
    this.setState({
      showModal: false,
      modalID: null,
      modalDoc: {},
    });
  }

  hideMenu() {
    this.setState({ showMenu: false });
  }

  showMenu() {
    this.setState({
      showMenu: true,
      showModal: false,
      modalID: null,
      modalDoc: {},
    });
  }

  showModal(id, doc) {
    return () => {
      this.setState({
        modalID: id,
        modalDoc: doc,
        showModal: true,
        showMenu: false,
      });
    }
  }

  componentDidMount() {
    let unsubscribe = db.subscribeMemos(window.saveBrainAppFirebaseUser.uid, (id, data, isRemoved, meta) => {
      let removed = this.state.texts.filter(t => (t.id != id))
      if (!isRemoved) { removed.push({...data, id: id }) }
      this.setState({ texts: removed })
    })
    this.setState({ unsubscribeFunc: unsubscribe })
  }

  componentWillUnmount() {
    if (this.state.unsubscribeFunc) { this.state.unsubscribeFunc() }
  }

//        <p>{window.outerHeight}</p>
//        <p>{screen.height}</p>
//        <p>{screen.availHeight}</p>
//        <p>{document.body.clientHeight}</p>
//        <p>{document.documentElement.clientHeight}</p>
//        <p>{window.innerHeight}</p>
  render() {
    return (
      <div className='scroll'>
        { this.state.showModal ?
          <OpenedModal unmountMe={this.hideModal} docID={this.state.modalID} docData={this.state.modalDoc}/>
          : (this.state.showMenu ? 
          <Menu close={this.hideMenu} navigator={this.props.navigator} />
          : '')
        }

        { this.state.texts.map(text => <Text key={text.id} data={text} edit={this.showModal(text.id, text)}/>)}

        <button className='button is-medium ab' onClick={this.showModal(null, {})}>memo</button>
        <button className='button is-medium menu' onClick={this.showMenu}>menu</button>
      </div>
    )
  }
}

