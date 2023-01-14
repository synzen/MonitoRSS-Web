import styled from 'styled-components'

const Wrapper = styled.div`
  background: ${props => props.warn ? 'rgba(250,166,26,.3)' : props.error ? 'rgba(237, 66, 69, 0.1)' : 'rgba(114,137,218,.3)'};
  border: ${props => props.warn ? '2px solid rgba(250,166,26,.75)' : props.error ? '2px solid rgb(237, 66, 69)' : '2px solid rgba(114,137,218,.75)'};
  border-radius: 5px;
  line-height: 24px;
  margin: 20px 0;
  padding: 10px;
  font-weight: 500;
  font-size: 1.15em;
  color: hsla(0,0%,100%,.9);
`

export default Wrapper
