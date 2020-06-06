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
import Footer from './Footer'

const Wrapper = styled.div`
  padding: 0 0px;
  max-width: 1450px;
  margin: 0 auto;
  height: 60px;
`

function Home () {
  const dispatch = useDispatch()
  const location = useLocation()
  const [scrollbarRef, setScrollbarRef] = useState()

  useEffect(() => {
    dispatch(fetchFaq())
  }, [])

  useEffect(() => {
    if (!scrollbarRef) {
      return
    }
    scrollbarRef.scrollToTop()
  }, [location.pathname, scrollbarRef])

  return (
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
      <Footer />
    </Scrollbars>
  )
}

export default Home
