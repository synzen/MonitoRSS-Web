import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Icon } from 'semantic-ui-react'
import Section from './Section'
import Footer from './Footer'
import colors from '../../constants/colors'
import modal from '../utils/modal'
import pages from '../../constants/pages'
import PropTypes from 'prop-types'
import GitHubButton from 'react-github-btn'
import GetStarted from './GetStarted'
import SectionDescription from './common/SectionDescription'

const Header = styled.div`
  position: relative;
  background-color: #26262b;
  width: 100%;
  height: 750px;
  /* justify-content: center; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex-direction: column; */
  /* padding-top: 100px; */
  text-align: center;
  /* max-width: 1600px; */
  p {
    margin-bottom: 30px;
  }
  h1 {
    font-weight: bold;
  }
  > div {

    max-width: 1400px;
    
    padding: 0 30px;
    overflow: hidden;
    @media only screen and (min-width: 1270px) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  @media only screen and (min-width: 1270px) {
      height: 500px;
  }
`

const HeaderButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  > .ui.button {
    width: 200px;
    &:first-child {
      margin-right: 2em;
    }
  }
`

const ImageContainer = styled.div`
  margin-top: 50px;
  @media only screen and (min-width: 1270px) {
    margin-top: 0;
  }
  > img {
    max-width: 450px;
    width: 100%;
    height: 100%;
    box-shadow: 0 8px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
`

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

const ModalBody = styled.div`
  text-align: center;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-around;
  a {
    width: 100%;
    span {
      margin-right: 10px;
    }
    &:hover {
      text-decoration: none;
    }
    &:first-child {
      margin-right: 10px;
    }
  }
  
`

const modalProps = {
  footer: (
    <ModalFooter>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://discordapp.com/oauth2/authorize?client_id=268478587651358721&scope=bot&permissions=19456'
        onClick={e => modal.hide()}
      >
        <Button fluid>
          <span>With Role</span>
          <Icon name='external' />
        </Button>
      </a>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://discordapp.com/oauth2/authorize?client_id=268478587651358721&scope=bot'
        onClick={e => modal.hide()}
      >
        <Button fluid>
          <span>Without Role</span>
          <Icon name='external' />
        </Button>
      </a>
    </ModalFooter>)
}

const modalChildren = <ModalBody>You can choose whether you want a role attached to me by default.</ModalBody>

function Home (props) {
  return (
    <div>
      <Header>
        <div>
          <div>
            <h1>Get news delivered, automagically.</h1>
            <SectionDescription>
              Receive news from sources like YouTube, Reddit, Steam, or any site that supports RSS.
              <br />
              With a copious level of customization, you can design it to look just how you want it.
            </SectionDescription>
            <HeaderButtons>
              <Button basic onClick={e => props.history.push(pages.DASHBOARD)}>Control Panel</Button>
              <Button size='large' onClick={e => modal.show(modalProps, modalChildren)}>Invite Me!</Button>
            </HeaderButtons>
          </div>
          <ImageContainer>
            <img src='https://i.imgur.com/okaIBQv.png' alt='Sample Screenshot' />
          </ImageContainer>
        </div>
      </Header>
      <Section>
        <GetStarted />
      </Section>
      <Section>
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
      </Section>
      <Footer />
    </div>
  )
}

Home.propTypes = {
  history: PropTypes.object
}

export default withRouter(Home)
