import React, { useState, useEffect } from 'react'
import './js/index'
import styled from 'styled-components'
import { Switch, Route, Redirect } from 'react-router-dom'
import colors from './js/constants/colors'
import 'react-toastify/dist/ReactToastify.min.css'
import './semantic/dist/semantic.min.css'
import { Icon, Button } from 'semantic-ui-react'
import pages from './js/constants/pages'
import './App.css'
import 'highlight.js/styles/solarized-dark.css'
import NavBar from './js/components/Home/NavBar/index'
import Main from './js/components/Home/index'
import FAQ from './js/components/Home/FAQ/index'
import FeedBrowser from './js/components/Home/FeedBrowser/index'
import ControlPanel from './js/components/ControlPanel/index'
import { useSelector, useDispatch } from 'react-redux'
import DiscordModal from './js/components/utils/DiscordModal'
import modal from './js/components/utils/modal'
import { Scrollbars } from 'react-custom-scrollbars'
import { fetchFaq } from './js/actions/faq'
import PrivacyPolicy from 'js/components/Home/PrivacyPolicy'
import TermsAndConditions from 'js/components/Home/TermsAndConditions'
import CookiePolicy from 'js/components/Home/CookiePolicy'

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

const Wrapper = styled.div`
  padding: 0 0px;
  max-width: 1450px;
  margin: 0 auto;
  height: 60px;
`

function App () {
  const dispatch = useDispatch()
  const [errorMessage] = useState('')
  const [scrollbarRef, setScrollbarRef] = useState()
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
        <Route render={() => (
          <Scrollbars style={{ width: '100vw', height: '100vh' }} ref={scrollbar => setScrollbarRef(scrollbar)}>
            <Wrapper>
              <NavBar />
            </Wrapper>
            <Switch>
              <Route path={`${pages.FEED_BROWSER}/:url?`} component={FeedBrowser} />
              <Route
                path={`${pages.FAQ}/:question?`} render={props => {
                  // eslint-disable-next-line react/jsx-pascal-case
                  return <FAQ {...props} scrollbar={scrollbarRef} />
                }}
              />
              <Route path={pages.PRIVACY_POLICY} component={PrivacyPolicy} />
              <Route path={pages.TERMS} component={TermsAndConditions} />
              <Route path={pages.COOKIE_POLICY} component={CookiePolicy} />
              <Route path='/' component={routerProps => <Main {...routerProps} />} />
              <Route render={() => <Redirect to='/' />} />
            </Switch>
          </Scrollbars>
        )}
        />
      </Switch>
    </div>
  )
}

export default App
