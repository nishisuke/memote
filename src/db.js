import firebase from 'firebase/app';
import 'firebase/firestore'; // Required for side-effects

class FirestoreDB {
  setup() {
    if (!this.firestore) this.firestore = firebase.firestore();
  }

  subscribeMemos(userID, onChanged) {
    this.firestore.collection('texts').where('user_id', '==', userID).where('archived', '==', false)
      .onSnapshot({ includeMetadataChanges: true }, snapshot => {
        snapshot.docChanges().forEach(change => {
          onChanged(change.doc.id, change.doc.data(), change.type == 'removed', change.doc.metadata)
        })
      })
  }

  fetchArchivedMemos(userID, eachCallback) {
    let today = new Date()
    let query = this.firestore.collection('texts')
      .where('user_id', '==', userID)
      .where('archived', '==', true)
      .where('archivedAt', '<=', new Date(today.getFullYear() + 1, 2))
      .orderBy('archivedAt', 'desc')
      .limit(10)

    query.get().then(snapshot => {
      snapshot.forEach(d => eachCallback(d.id, d.data()))
    })
  }

  activateMemo(id) {
    this.firestore.collection('texts').doc(id).update({ archived: false, archivedAt: new Date(2099, 3) })
  }

  persistMemo(userID, memoID, text) {
    let col = this.firestore.collection('texts')
    let doc = memoID ? col.doc(memoID) : col.doc()
    let data = {
      string: text,
      user_id: userID,
      archived: false,
      archivedAt: new Date(2099, 3),
    }

    doc.set(data)
  }
}

export default new FirestoreDB()
