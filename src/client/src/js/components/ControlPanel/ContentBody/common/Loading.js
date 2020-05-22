import React from 'react'
import { Loader } from 'semantic-ui-react'

function Loading () {
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Loader active size='massive'>
        Loading feeds...
      </Loader>
    </div>
  )
}

export default Loading
