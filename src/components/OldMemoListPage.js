import React from 'react'

const styles = {
   oldMemoListPage: {
     height: 'calc(100vh - 40px)',
     'overflowY': 'scroll',
     padding: '8px 4px',
  },
}

export default ({ texts, edit }) => {
  return (
    <div style={{...styles.oldMemoListPage}}>
      { texts.map(t => {
        return (
          <div key={t.id} className="old-memo" onClick={() => edit(t)}>
            { t.text }
          </div>
        )
      })}
    </div>
  )
}
