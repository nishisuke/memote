import { Record } from 'immutable'

const defaultUpdatedAt = new Date(2018, 1);
const defaultArchivedAt = new Date(2099, 3);

const TextRecord = Record({
  id: null,
  text: '',
  updatedAt: defaultUpdatedAt,
  archived: false,
  archivedAt: defaultArchivedAt,
  pageXRate: null,
  pageYRate: null,
})

export default class ImmutableText extends TextRecord {
  getEdited(text) {
    return this.merge({ text: text, updatedAt: new Date() })
  }

  storeObject(userID) {
    const d = this.toObject()
    delete d.id
    const t = this.text
    delete d.text
    d.string = t
    d.user_id = userID
    return d
  }

  fromFirestore(doc) {
    const d = doc.data()
    return this.merge({ ...d, id: doc.id, text: d.string })
  }
}
