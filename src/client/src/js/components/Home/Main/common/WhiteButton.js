import styled from 'styled-components'
import colors from 'js/constants/colors'
import { Button } from 'semantic-ui-react'

const WhiteButton = styled(Button)`
  border-color: ${colors.discord.offwhite} !important;
  color: ${colors.discord.offwhite} !important;
  &:focus, &:active {
    color: ${colors.discord.offwhite} !important;
  }
  &:focus {
    background: rgba(220, 221, 222, .1) !important;
  }
  width: 100%;
  height: 100%;
  /* cursor: pointer; */
`

export default WhiteButton
