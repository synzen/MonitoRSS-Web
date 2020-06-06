import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import colors from '../../constants/colors'

const Container = styled.div`
  h3 {
    color: white;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 1.4em;
    margin-bottom: ${props => props.hasSubheading ? '8px' : '20px'} !important;
  }
  p {
    margin-bottom: 20px !important;
    font-size: 1.15em;
    font-weight: 500;
    color: ${colors.discord.offwhite};
  }
`

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  > div:first-child {
    margin-right: ${props => props.hasSideComponent ? '30px' : 0};
  }
`

class PageHeader extends React.PureComponent {
  render () {
    return (
      <Container hasSubheading={!!this.props.subheading}>
        <Main hasSideComponent={!!this.props.sideComponent}>
          <div>
            {this.props.heading ? <h3>{this.props.heading}</h3> : null}
            {this.props.subheading ? <p>{this.props.subheading}</p> : null}
          </div>
          {this.props.sideComponent ? <div><h3>{this.props.sideComponent}</h3></div> : null}
        </Main>
      </Container>
    )
  }
}

PageHeader.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  sideComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
}

export default PageHeader
