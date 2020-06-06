import React, { useState, useEffect } from 'react'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Home from './Home/index'
import Feeds from './Feeds/index'
import Settings from './Settings/index'
import Message from './Message/index'
import Filters from './Filters/index'
import Subscribers from './Subscribers/index'
import MiscOptions from './MiscOptions/index'
import { useDispatch } from 'react-redux'
import pages from 'js/constants/pages'
import { Scrollbars } from 'react-custom-scrollbars'
import { changePage } from 'js/actions/page'

const Body = styled.div`
  height: 100%;
  width: 100%;
  background-color: #36393f;
`

function ContentBody () {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [scrollbarRef, setScrollbarRef] = useState()

  useEffect(() => {
    if (!scrollbarRef) {
      return
    }
    scrollbarRef.scrollToTop()
  }, [location.pathname, scrollbarRef])

  function redirect (page) {
    dispatch(changePage(page))
    history.push(page)
  }

  return (
    <Body>
      <Scrollbars ref={scrollbar => setScrollbarRef(scrollbar)}>
        <Switch>
          <Route exact path={pages.DASHBOARD} render={routerProps => <Home redirect={redirect} {...routerProps} />} />
          <Route exact path={pages.FEEDS} render={routerProps => <Feeds redirect={redirect} {...routerProps} />} />
          <Route exact path={pages.SERVER_SETTINGS} render={routerProps => <Settings {...routerProps} />} />
          <Route exact path={pages.MESSAGE} render={routerProps => <Message {...routerProps} />} />
          <Route exact path={pages.FILTERS} render={routerProps => <Filters {...routerProps} />} />
          <Route exact path={pages.SUBSCRIBERS} render={routerProps => <Subscribers {...routerProps} />} />
          <Route exact path={pages.MISC_OPTIONS} render={routerProps => <MiscOptions {...routerProps} />} />
          <Route render={routerProps => <Home {...routerProps} />} />
        </Switch>
      </Scrollbars>
    </Body>
  )
}

export default ContentBody
