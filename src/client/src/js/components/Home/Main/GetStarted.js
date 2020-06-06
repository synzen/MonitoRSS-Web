import React from 'react'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import SectionDescription from '../common/SectionDescription'

const Cards = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 50px;
  grid-template-columns: repeat(auto-fit, 350px);
  column-gap: 10px;
  row-gap: 10px;
`

const Card = styled.div`
  background-color: #26262b;
  padding: 30px 20px;
  min-height: 350px;
  h3 {
    margin-top: 30px !important;
    font-weight: bolder;
    line-height: 30px;
    margin-bottom: 12px;
  }
  p {
    font-size: 1.25em;
    margin-bottom: 50px !important;
  }
  i {
    font-size: 3.5em !important;
    margin-top: 50px !important;
  }
  a {
    word-break: break-all;
  }
`

function GetStarted () {
  return (
    <div>
      <h1>Get Started!</h1>
      <SectionDescription>
        Getting automatic delivery of your desired news can be done in 3 simple steps.<br />For the full list of commands, use the rss.help command.
      </SectionDescription>
      {/* <p style={{ fontSize: 16 }}>In just 3 easy steps.</p> */}
      <Cards>
        <Card>
          <Icon name='envelope open outline' />
          <div>
            <h3>1. Invite Me</h3>
            <p>You'll have to invite me first to be able to use my features!</p>
          </div>
        </Card>
        <Card>
          <Icon name='search' />
          <div>
            <h3>2. Find a valid feed</h3>
            <p>An example of a valid feed would be <a href='https://www.gameinformer.com/news.xml' target='_blank' rel='noopener noreferrer'>https://www.gameinformer.com/news.xml</a></p>
          </div>
        </Card>
        <Card>
          <Icon name='check' />
          <div>
            <h3>3. Add it!</h3>
            <p>Use the rss.add command in your desired channel to add the feed!</p>
          </div>
        </Card>
      </Cards>
    </div>
  )
}

export default GetStarted
