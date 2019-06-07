import React from 'react'

import useSubscribeTexts from '../hooks/useSubscribeTexts'

const styles = {
   oldMemoListPage: {
     height: '100vh',
  },
}

export default ({ texts }) => {
  return (
    <div style={{...styles.oldMemoListPage}}>
      { texts.map(t => {
        return (
          <div key={t.id}>
            { t.text }
          </div>
        )
      })}
    </div>
  )
}
