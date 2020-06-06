import React from 'react'
import Section from './common/Section'
import GetStarted from './GetStarted'
import Features from './Features'
import Header from './Header'

function Main () {
  return (
    <div>
      <Header />
      <Section>
        <GetStarted />
      </Section>
      <Section>
        <Features />
      </Section>
    </div>
  )
}

export default Main
