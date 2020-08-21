import React from 'react'
import colors from '../../../constants/colors'
import styled from 'styled-components'
import SectionDescription from './common/SectionDescription'
import { Icon } from 'semantic-ui-react'
import GitHubButton from 'react-github-btn'

const FeatureBoxes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 400px));
  margin-top: 50px;
  column-gap: 50px;
  row-gap: 50px;
  justify-content: center;
`

const Feature = styled.div`
  max-height: 225px;
  height: 100%;
  text-align: left;
  > div {
    > span {
      font-size: 1.15em;
      color: white;
    }
    > p {
      font-size: 1.1em;
      margin-top: 12px;
    }
  }
  i {
    font-size: 40px !important;
    margin-bottom: 20px;
  }
  img {
    width: 40px;
    height: 100%;
  }
  h2 {
    font-size: 1.25em;
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

function Features () {
  return (
    <>
      <h1>Features</h1>
      <SectionDescription>With a slew of customization features, you get to design exactly how you want your feed to look like.</SectionDescription>
      <FeatureBoxes>
        <Feature>
          <Icon name='filter' style={{ color: colors.discord.yellow }} />
          <div>
            <h2>Filter Articles</h2>
            <p>Use filters to filter out articles you don't want in your feed.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='at' style={{ color: colors.discord.blurple }} />
          <div>
            <h2>Subscriptions</h2>
            <p>Mention users when an article of their liking comes in with the use of filters.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='copy' alt='placeholders' style={{ color: '#99AAB5' }} />
          <div>
            <h2>Property Placeholders</h2>
            <p>Extract whatever information you want from the article's properties and use them.</p>
          </div>
        </Feature>

        <Feature>
          <Icon name='shield' style={{ color: colors.discord.green }} />
          <div>
            <h2>RSS Reliability</h2>
            <p>With the core logic behind D.RSS, you'll almost never miss an article.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='window maximize outline' style={{ color: '#A6BDF0' }} />
          <div>
            <h2>Web Interface</h2>
            <p>Easily manage and customize all your feeds through the control panel.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='github' />
          <div>
            <h2 style={{ marginRight: '10px' }}>
              Open Source
            </h2>
            <p>
              The source code is openly available for anyone to use and host. Spread the love!
              <br />
              <br />
              <GitHubButton
                href='https://github.com/synzen/MonitoRSS'
                data-icon='octicon-star'
                data-show-count='true'
                aria-label='Star synzen/MonitoRSS on GitHub'
              >
                Star
              </GitHubButton>
            </p>
          </div>
        </Feature>
      </FeatureBoxes>
    </>
  )
}

export default Features
