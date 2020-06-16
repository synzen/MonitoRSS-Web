import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import SectionDescription from './common/SectionDescription'
import { Button, Icon } from 'semantic-ui-react'
import pages from '../../../constants/pages'
import modal from '../../utils/modal'
import WhiteButton from './common/WhiteButton'

const Wrapper = styled.div`
  position: relative;
  background-color: #26262b;
  width: 100%;
  height: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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
  flex-wrap: wrap;  
  > .ui.button {
    width: 200px;
    margin: 10px 20px;
  }
`

const ImageContainer = styled.div`
  margin-top: 50px;
  @media only screen and (min-width: 1270px) {
    margin-top: 0;
  }
  > img {
    border-radius: 7px;
    max-width: 450px;
    width: 100%;
    height: 100%;
    box-shadow: 0 8px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
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

function Header () {
  const history = useHistory()
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

  return (
    <Wrapper>
      <div>
        <div>
          <h1>Get news delivered, automagically.</h1>
          <SectionDescription>
            Receive news from sources like YouTube, Reddit, Steam, or any site that supports RSS.
            <br />
            With a copious level of customization, you can design it to look just how you want it.
          </SectionDescription>
          <HeaderButtons>
            <WhiteButton basic onClick={e => history.push(pages.DASHBOARD)}>Control Panel</WhiteButton>
            <Button size='large' onClick={e => modal.show(modalProps, modalChildren)}>Invite Me!</Button>
          </HeaderButtons>
        </div>
        <ImageContainer>
          <img src='https://i.imgur.com/okaIBQv.png' alt='Sample Screenshot' />
        </ImageContainer>
      </div>
    </Wrapper>
  )
}

export default Header
