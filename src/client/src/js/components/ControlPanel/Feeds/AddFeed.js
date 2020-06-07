import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SectionTitle from 'js/components/common/SectionTitle'
import SectionSubtitle from 'js/components/common/SectionSubtitle'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Dropdown, Input } from 'semantic-ui-react'
import { isMobile } from 'react-device-detect'
import { addGuildFeed } from 'js/actions/feeds'
import guildSelectors from 'js/selectors/guilds'
import feedSelectors from 'js/selectors/feeds'

const AddFeedInputs = styled.div`
  > div {
    margin-bottom: 1em;
  }
  > div:last-child {
    margin-top: 1.5em;
    margin-bottom: 0;
    display: flex;
    justify-content: flex-end;
  }
`

function AddFeed (props) {
  const guild = useSelector(guildSelectors.activeGuild)
  const adding = useSelector(feedSelectors.feedAdding)
  const [url, setURL] = useState('')
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState('')
  const dispatch = useDispatch()
  const { channelDropdownOptions, limit } = props

  const add = async () => {
    const data = {
      url,
      channel
    }
    if (title) {
      data.title = title
    }
    await dispatch(addGuildFeed(guild.id, data))
    setURL('')
    setTitle('')
    setChannel('')
  }

  return (
    <div>
      <SectionTitle
        heading='Add'
        subheading={
          limit !== 0
            ? (
              <div>
                Add a new feed. You may have a maximum of {limit} feeds. Need more? <a href='https://www.patreon.com/discordrss' target='_blank' rel='noopener noreferrer'>Help support Discord.RSS by becoming a supporter!</a>
              </div>
            )
            : ''
        }
      />
      <AddFeedInputs>
        <div>
          <SectionSubtitle>URL</SectionSubtitle>
          <Input fluid onChange={e => setURL(e.target.value)} value={url} placeholder='Feed URL' onKeyPress={e => e.key === 'Enter' ? add() : null} />
        </div>
        <div>
          <SectionSubtitle>Channel</SectionSubtitle>
          <Dropdown selection fluid options={channelDropdownOptions} search={!isMobile} disabled={channelDropdownOptions.length === 0} onChange={(e, data) => setChannel(data.value)} value={channel} placeholder='Select a channel' onKeyPress={e => e.key === 'Enter' ? add() : null} />
        </div>
        <div>
          <SectionSubtitle>Title (Optional)</SectionSubtitle>
          <Input fluid onChange={e => setTitle(e.target.value)} value={title} placeholder='This will be automatically resolved if left blank' onKeyPress={e => e.key === 'Enter' ? add() : null} />
        </div>
        <div>
          <Button content='Add' color='green' disabled={!url || !channel || adding} onClick={add} />
        </div>
      </AddFeedInputs>
    </div>
  )
}

AddFeed.propTypes = {
  channelDropdownOptions: PropTypes.array,
  limit: PropTypes.number
}

export default AddFeed
