import { Record } from 'immutable'

const defaultUpdatedAt = new Date(2018, 1);
const defaultArchivedAt = new Date(2099, 3);

const TextRecord = Record({
  id: null,
  text: '',
  updatedAt: defaultUpdatedAt.getTime(),
  archived: false,
  archivedAt: defaultArchivedAt.getTime(),
  pageXRate: null,
  pageYRate: null,
  autoDeleteAt: null,
})

export default class ImmutableText extends TextRecord {
  getEdited(text) {
    if (this.autoDeleteAt) {
      return this.merge({ text: text, updatedAt: Date.now(), autoDeleteAt: Date.now() + 3 * 24 * 3600 * 1000 })
    } else {
      return this.merge({ text: text, updatedAt: Date.now() })
    }
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
