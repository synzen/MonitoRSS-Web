import React from 'react'
import Section from './common/Section'
import Footer from './Footer'
import GetStarted from './GetStarted'
import Features from './Features'
import Header from './Header'

function Home () {
  return (
    <div>
      <Header />
      <Section>
        <GetStarted />
      </Section>
      <Section>
        <Features />
      </Section>
      <Footer />
    </div>
  )
}

export default Home
