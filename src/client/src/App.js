import React, { useState, useEffect } from 'react'
import './js/index'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'
import colors from './js/constants/colors'
import 'react-toastify/dist/ReactToastify.min.css'
import './semantic/dist/semantic.min.css'
import { Icon, Button } from 'semantic-ui-react'
import pages from './js/constants/pages'
import './App.css'
import 'highlight.js/styles/solarized-dark.css'
import ControlPanel from './js/components/ControlPanel/index'
import { useSelector, useDispatch } from 'react-redux'
import DiscordModal from './js/components/utils/DiscordModal'
import modal from './js/components/utils/modal'
import { fetchFaq } from './js/actions/faq'
import Home from './js/components/Home/index'

const EmptyBackground = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #282b30;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  h1 {
    color: white;
  }
  color: ${colors.discord.text};
`

function App () {
  const dispatch = useDispatch()
  const [errorMessage] = useState('')
  const reduxModal = useSelector(state => state.modal)

  useEffect(() => {
    dispatch(fetchFaq())
  }, [])

  if (errorMessage) {
    return (
      <EmptyBackground>
        <div>
          <Icon name='x' size='massive' color='red' />
          <h1>Oops!<br />Something went wrong!</h1>
          <h3>{errorMessage || ''}</h3>
          <Button basic fluid onClick={e => { window.location.href = '/logout' }} color='red'>Logout</Button>
        </div>
      </EmptyBackground>
    )
  }

  return (
    <div className='App'>
      <DiscordModal onClose={() => modal.hide()} open={reduxModal.open} {...reduxModal.props}>{reduxModal.children}</DiscordModal>
      <Switch>
        <Route path={pages.DASHBOARD} component={ControlPanel} />
        <Route component={Home} />
      </Switch>
    </div>
  )
}

export default App
