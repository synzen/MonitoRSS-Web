import React, { useState, useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import FeedBrowser from './FeedBrowser'
import PrivacyPolicy from './PrivacyPolicy'
import TermsAndConditions from './TermsAndConditions'
import FAQ from './FAQ/index'
import Main from './Main/index'
import CookiePolicy from './CookiePolicy'
import pages from 'js/constants/pages'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { fetchFaq } from 'js/actions/faq'
import { fetchStats } from 'js/actions/stats'
import Footer from './Footer'
import { fetchBotUser } from 'js/actions/user'
import colors from 'js/constants/colors'
import { Icon } from 'semantic-ui-react'

const Wrapper = styled.div`
  padding: 0 0px;
  max-width: 1450px;
  margin: 0 auto;
  height: 60px;
`

const Alert = styled.div`
  background:  rgba(67,181,129,.9);
  width: 100vw;
  /* height: 50px; */
  color: ${colors.discord.white};
  font-weight: bold;
  text-align: center;
  padding: 10px 20px;
`

const CloserAlertButton = styled.button`
  background: none;
  border: solid 1px transparent;
  color: ${colors.discord.white};
  margin-left: 5px;
  padding: 5px;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    border: dashed 1px ${colors.discord.white};
  }
`

const today = new Date().getTime()
const hideRenameAlertTime = new Date('20 September 2020').getTime()
const showCloseButtonTime = new Date('1 September 2020').getTime()

const alertAcknowledgeStorageKey = 'discordrssRenameAck'

function Home () {
  const dispatch = useDispatch()
  const location = useLocation()
  const [scrollbarRef, setScrollbarRef] = useState()
  const [showRenameAlert, setShowRenameAlert] = useState(
    today < showCloseButtonTime || (
      !localStorage.getItem(alertAcknowledgeStorageKey) &&
      today < hideRenameAlertTime
    )
  )
  const pathname = location.pathname

  useEffect(() => {
    dispatch(fetchFaq())
    dispatch(fetchStats())
    dispatch(fetchBotUser())
  }, [])

  useEffect(() => {
    if (!scrollbarRef || pathname.startsWith('/faq/')) {
      return
    }
    scrollbarRef.scrollToTop()
  }, [pathname, scrollbarRef])

  function closeAlert () {
    localStorage.setItem(alertAcknowledgeStorageKey, 'true')
    setShowRenameAlert(false)
  }

  return (
    <Scrollbars style={{ width: '100vw', height: '100vh' }} ref={scrollbar => setScrollbarRef(scrollbar)}>
      {showRenameAlert &&
        <Alert>
          <span>Discord.RSS has been renamed to MonitoRSS</span>
          {today > showCloseButtonTime && showRenameAlert &&
            <CloserAlertButton onClick={closeAlert}>
              <Icon name='close' />
            </CloserAlertButton>}
        </Alert>}
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
      <Footer />
    </Scrollbars>
  )
}

export default Home
