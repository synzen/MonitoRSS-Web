import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import TextArea from 'js/components/common/TextArea'
import PopInButton from 'js/components/ControlPanel/common/PopInButton'
import feedSelectors from 'js/selectors/feeds'
import { fetchEditFeed } from 'js/actions/feeds'

const MessageArea = styled.div`
  margin-bottom: 1.5em;
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  .ui.button {
    margin-left: 1em;
    margin-top: 1em;
  }
`

function TextSetting (props) {
  const { originalMessage, onUpdate: propsOnUpdate } = props
  const [value, setValue] = useState(null)
  const feed = useSelector(feedSelectors.activeFeed)
  const editing = useSelector(feedSelectors.feedEditing)
  const dispatch = useDispatch()
  const noChanges = value === originalMessage || value === undefined
  const textAreaVal = value || value === '' ? value : originalMessage

  const onUpdate = useCallback((newValue) => {
    if (newValue && newValue.length > 1950) {
      return
    }
    setValue(newValue)
    propsOnUpdate(newValue)
  }, [propsOnUpdate])

  useEffect(() => {
    onUpdate()
  }, [feed, onUpdate])

  const save = () => {
    if (value === null || value === originalMessage) {
      return
    }
    const data = {
      text: value
    }
    dispatch(fetchEditFeed(feed.guild, feed._id, data))
  }

  return (
    <MessageArea>
      <TextArea onChange={e => onUpdate(e.target.value)} placeholder={originalMessage} value={textAreaVal} lineCount={textAreaVal ? textAreaVal.split('\n').length : 0} />
      <ActionButtons>
        <PopInButton content='Reset' basic inverted onClick={e => onUpdate()} pose={editing ? 'exit' : noChanges ? 'exit' : 'enter'} />
        <Button disabled={editing || noChanges} content='Save' color='green' onClick={save} />
      </ActionButtons>
    </MessageArea>
  )
}

TextSetting.propTypes = {
  originalMessage: PropTypes.string,
  onUpdate: PropTypes.func
}

export default TextSetting
