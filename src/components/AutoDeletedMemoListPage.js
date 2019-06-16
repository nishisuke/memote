import React from 'react'

const styles = {
   autoDeletedPage: {
     height: 'calc(100vh - 40px)',
     'overflowY': 'scroll',
     padding: '8px 4px',
  },
}

export default ({ texts, edit }) => {
  return (
    <div style={{...styles.autoDeletedPage }}>
      { texts.map(t => {
        return (
          <div key={t.id} className="auto-deleted-memo">
            { t.text }
          </div>
        )
      })}
    </div>
  )
}
