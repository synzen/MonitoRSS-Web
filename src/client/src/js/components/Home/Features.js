import React from 'react'
import colors from '../../constants/colors'
import styled from 'styled-components'
import SectionDescription from './common/SectionDescription'
import { Icon } from 'semantic-ui-react'
import GitHubButton from 'react-github-btn'

const FeatureBoxes = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1200px;
  flex-wrap: wrap;
  margin: 0 auto;
`

const Feature = styled.div`
  max-width: 350px;
  width: 100%;
  max-height: 225px;
  height: 100%;
  display: flex;
  align-items: left;
  flex-direction: column;
  text-align: left;
  padding: 30px;

  > div {
    margin-top: 20px;
    > span {
      font-size: 24px;
      color: white;
    }
    > p {
      font-size: 16px;
      margin-top: 10px;
    }
  }
  i {
    font-size: 40px !important;
  }
  img {
    width: 40px;
    height: 100%;
  }
`

function Features () {
  return (
    <div>
      <h1>Features</h1>
      <SectionDescription>With a slew of customization features, you get to design exactly how you want your feed to look like.</SectionDescription>
      <FeatureBoxes>
        <Feature>
          <Icon name='filter' style={{ color: colors.discord.yellow }} />
          <div>
            <span>Filter Articles</span>
            <p>Use filters to filter out articles you don't want in your feed.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='at' style={{ color: colors.discord.blurple }} />
          <div>
            <span>Subscriptions</span>
            <p>Mention users when an article of their liking comes in with the use of filters.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='copy' alt='placeholders' style={{ color: '#99AAB5' }} />
          <div>
            <span>Property Placeholders</span>
            <p>Extract whatever information you want from the article's properties and use them.</p>
          </div>
        </Feature>

        <Feature>
          <Icon name='shield' style={{ color: colors.discord.green }} />
          <div>
            <span>RSS Reliability</span>
            <p>With the core logic behind D.RSS, you'll almost never miss an article.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='window maximize outline' style={{ color: '#A6BDF0' }} />
          <div>
            <span>Web Interface</span>
            <p>Easily manage and customize all your feeds through the control panel.</p>
          </div>
        </Feature>
        <Feature>
          <Icon name='github' />
          <div>
            <span style={{ marginRight: '10px' }}>Open Source
            </span>
            <GitHubButton
              href='https://github.com/synzen/discord.rss'
              data-icon='octicon-star'
              data-show-count='true'
              aria-label='Star synzen/discord.rss on GitHub'
            >
              Star
            </GitHubButton>
            <p>
              The source code is openly available for anyone to use and host. Spread the love!

            </p>
          </div>
        </Feature>
      </FeatureBoxes>
    </div>
  )
}

export default Features
