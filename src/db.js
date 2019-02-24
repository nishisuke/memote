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
}

export default new FirestoreDB()
