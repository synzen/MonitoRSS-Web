import React from 'react'
import pages from '../../constants/pages'
import styled from 'styled-components'
import GitHubButton from 'react-github-btn'
import { Divider } from 'semantic-ui-react'
import colors from '../../constants/colors'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 30px 60px 30px;
`

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  column-gap: 20px;
  row-gap: 35px;
  text-align: center;
  width: 80vw;
  max-width: 1400px;
  margin-top: 20px;
  a {
    color: ${colors.discord.text};
  }
  h5, h3, h4 {
    color: ${colors.discord.white};
  }
`

const SupportUs = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  text-align: left;
`

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
`

function Footer () {
  return (
    <div>
      <Divider />
      <Wrapper>
        <FooterContainer>
          <SupportUs>
            <h3>Support Us!</h3>
            <p style={{ marginBottom: 0 }}>
              Has Discord.RSS helped you or your community? You can show your support by either becoming a Patron, or just a simple star on Github!
              <br /><br />
              <a
                target='_blank'
                href='https://www.patreon.com/discordrss'
                rel='noreferrer noopener'
              >
                <img
                  src='https://c5.patreon.com/external/logo/become_a_patron_button.png'
                  alt='Become a Patron'
                  width='185px'
                />
              </a>
              <br /><br />
              <GitHubButton
                href='https://github.com/synzen/discord.rss'
                target='_blank'
                rel='noreferrer noopener'
                data-icon='octicon-star'
                data-size='large'
                data-show-count='true'
                aria-label='Star synzen/discord.rss on GitHub'
              >
                Star
              </GitHubButton>
            </p>
          </SupportUs>
          <div>
            <h4>Information</h4>
            <Navigation>
              <Link to={pages.TERMS}>Terms & Conditions</Link>
              <Link to={pages.PRIVACY_POLICY}>Privacy Policy</Link>
              <Link to={pages.COOKIE_POLICY}>Cookie Policy</Link>
            </Navigation>
          </div>
          <div>
            <h4>Useful Links</h4>
            <Navigation>
              <a href='https://github.com/synzen/discord.rss' target='_blank' rel='noreferrer noopener'>GitHub</a>
              <a href='https://docs.discordrss.xyz' target='_blank' rel='noreferrer noopener'>Documentation</a>
              <a href='https://discord.gg/pudv7Rx' target='_blank' rel='noreferrer noopener'>Support Server</a>
            </Navigation>
          </div>
        </FooterContainer>
      </Wrapper>
    </div>
  )
}

export default Footer
