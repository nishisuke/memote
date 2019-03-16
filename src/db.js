import firebase from 'firebase/app';
import 'firebase/firestore'; // Required for side-effects
import Text from './records/text'

class FirestoreDB {
  setup() {
    if (this.firestore) return;

    let firestore = firebase.firestore()

    firestore.enablePersistence()
      .catch(err => {
        if (err.code == 'failed-precondition') {
          console.log(err.code)
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
        } else if (err.code == 'unimplemented') {
          console.log(err.code)
          // The current browser does not support all of the
          // features required to enable persistence
        }
      });

    this.firestore = firestore
  }

  get userID() {
    let u = firebase.auth().currentUser
    return u ? u.uid : ''
  }

  subscribeMemos(eachCallback) {
    return this.firestore.collection('texts').where('user_id', '==', this.userID).where('archived', '==', false)
      .onSnapshot({ includeMetadataChanges: true }, snapshot => {
        snapshot.docChanges().forEach(change => {
          const t = new Text();
          eachCallback(t.fromFirestore(change.doc), change.type === 'removed')
        })
      }, e => {
        // nothing
      })
  }

  fetchArchivedMemos(eachCallback) {
    let today = new Date()
    let query = this.firestore.collection('texts')
      .where('user_id', '==', this.userID)
      .where('archived', '==', true)
      .where('archivedAt', '<=', new Date(today.getFullYear() + 1, 2))
      .orderBy('archivedAt', 'desc')
      .limit(10)

    query.get().then(snapshot => {
      snapshot.forEach(d => {
        const t = new Text();
        eachCallback(t.fromFirestore(d))
      })
    })
  }

  newMemo() {
    const s = this.firestore.collection('texts').doc()
    return new Text({id: s.id})
  }

  activateMemo(id) {
    this.firestore.collection('texts').doc(id).update({ archived: false, archivedAt: new Date(2099, 3) })
  }

  putMemo(t) {
    return this.firestore.collection('texts').doc(t.id).set(t.storeObject)
  }

  get defaultMemo() {
    return {
      string: '',
      user_id: this.userID,
      archived: false,
      archivedAt: new Date(2099, 3),
      updatedAt: Date.now(),
      pageXRate: (Math.random() / 7) + (2 / 7),
      pageYRate: (Math.random() / 14) + (5 / 7),
    }
  }

  createMemo(text) {
    let v = Object.assign({}, this.defaultMemo, { string: text })
    return this.firestore.collection('texts').add(v)
  }

  archiveMemo(memoID) {
    let text = this.firestore.collection('texts').doc(memoID)
    text.update({ archived: true, archivedAt: new Date() })
  }

  updatePoint(id, x, y) {
    let text = this.firestore.collection('texts').doc(id)
    text.update({ pageXRate: x, pageYRate: y })
  }
}

export default new FirestoreDB()
