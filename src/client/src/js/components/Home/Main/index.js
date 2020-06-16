import React from 'react'
import Section from './common/Section'
import GetStarted from './GetStarted'
import Features from './Features'
import Header from './Header'
import Stats from './Stats'

function Main () {
  return (
    <div>
      <Header />
      <Section>
        <Stats />
      </Section>
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
