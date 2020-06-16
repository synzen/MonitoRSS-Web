import React, { useEffect } from 'react'
import styled from 'styled-components'
import posed, { PoseGroup } from 'react-pose'
import colors from '../../constants/colors'
import { useSelector, useDispatch } from 'react-redux'
import { hideModal } from 'js/actions/modal'
// import { Scrollbars } from 'react-custom-scrollbars'
const TRANSITION_DURATION = 150

const Shade = posed.div({
  enter: { opacity: 1, transition: { duration: TRANSITION_DURATION } },
  exit: { opacity: 0, transition: { duration: TRANSITION_DURATION } }
})

const Modal = posed.div({
  enter: { scale: 1 },
  exit: { scale: 0.8 }
})

const StyledShade = styled(Shade)`
  background: rgba(0,0,0,0.85);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
`

const StyledModal = styled(Modal)`
  position: relative;
  /* width: auto; */
  color: ${colors.discord.text};
  margin-right: 1em;
  margin-left: 1em;
  ${props => props.isImage || props.fullWidth ? '' : 'max-width: 490px'};
  ${props => props.isImage ? '' : 'width: 100%'};
`

const ModalHeader = styled.div`
  position: relative;
  z-index: 10;
  padding: 1em;
  background-color: #36393f;
  border-top-left-radius: 0.75em;
  border-top-right-radius: 0.75em;
  box-shadow: 0 2px 0px 0 rgba(0,0,0,0.2);
  max-width: 490px;
  width: 100%;
`

const ModalFooter = styled.div`
  padding: 1em;
  background-color: ${props => props.transparent ? 'transparent' : colors.discord.darkButNotBlack};
  border-bottom-left-radius: 0.75em;
  border-bottom-right-radius: 0.75em;
  ${props => props.fullWidth ? '' : 'max-width: 490px'};
  width: 100%;
`

const ModalBody = styled.div`
  position: relative;
  background: ${props => props.transparent ? 'transparent' : '#36393f'};
  padding: 1em;
  max-height: ${props => props.isImage ? '100%' : 'calc(100vh - 250px)'};
  overflow-y: auto;
  border-top-left-radius: ${props => props.hasHeader ? 0 : '0.75em'};
  border-top-right-radius: ${props => props.hasHeader ? 0 : '0.75em'};
  border-bottom-left-radius: ${props => props.hasFooter ? 0 : '0.75em'};
  border-bottom-right-radius: ${props => props.hasFooter ? 0 : '0.75em'};
  > div {
    flex-grow: 1;
  }
`

const ModalHeaderWrapper = styled.div`
  color: ${colors.discord.text};
  h4 {
    color: white;
    margin-bottom: 3px;
  }
`

function DiscordModal () {
  const reduxModal = useSelector(state => state.modal)
  const reduxModalProps = reduxModal.props || {}
  const dispatch = useDispatch()

  const escape = (event) => {
    if (event.keyCode === 27 && reduxModal.open) {
      dispatch(hideModal())
    }
  }

  function popState (event) {
    if (reduxModal.open) {
      event.preventDefault()
      dispatch(hideModal())
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', escape, false)
    window.addEventListener('popstate', popState)
    return () => {
      document.removeEventListener('keydown', escape)
      window.removeEventListener('popstate', popState)
    }
  }, [reduxModal])

  return (
    <PoseGroup>
      {reduxModal.open && [
        <StyledShade
          key='shade' onClick={e => {
            if (e.target === e.currentTarget) {
              dispatch(hideModal())
            }
          }}
        >
          <StyledModal key='dialog' isImage={reduxModalProps.isImage} fullWidth={reduxModalProps.fullWidth}>
            {reduxModalProps.header
              ? <ModalHeader>{reduxModalProps.header}</ModalHeader>
              : reduxModalProps.title || reduxModalProps.subtitle
                ? (
                  <ModalHeader>
                    <ModalHeaderWrapper>
                      <h4>{reduxModalProps.title}</h4>
                      <p>{reduxModalProps.subtitle}</p>
                    </ModalHeaderWrapper>
                  </ModalHeader>
                )
                : null}
            {/* <Scrollbars> */}
            <ModalBody
              isImage={reduxModalProps.isImage}
              transparent={reduxModalProps.transparentBody}
              hasHeader={!!reduxModalProps.header || !!reduxModalProps.title || !!reduxModalProps.subtitle}
              hasFooter={!!reduxModalProps.footer}
            >
              <div>
                {reduxModal.children}
              </div>
            </ModalBody>
            {/* </Scrollbars> */}
            {reduxModalProps.footer
              ? (
                <ModalFooter
                  transparent={reduxModalProps.transparentFooter}
                  fullWidth={reduxModalProps.fullWidth}
                >
                  {reduxModalProps.footer}
                </ModalFooter>
              )
              : undefined}
          </StyledModal>
        </StyledShade>
      ]}
    </PoseGroup>
  )
}

export default DiscordModal
