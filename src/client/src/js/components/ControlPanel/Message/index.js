import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Divider, Sticky, ButtonGroup, Dropdown } from 'semantic-ui-react'
import styled from 'styled-components'
import MessageSettings from './TextSettings'
import EmbedSettings from './EmbedSettings/index'
import Preview from './Preview'
import SectionTitle from 'js/components/common/SectionTitle'
import PageHeader from 'js/components/common/PageHeader'
import Placeholders from './Placeholders'
import colors from 'js/constants/colors'
import { Scrollbars } from 'react-custom-scrollbars'
import feedSelectors from 'js/selectors/feeds'
import { Redirect } from 'react-router-dom'
import pages from 'js/constants/pages'
import { changePage } from 'js/actions/page'
import Loading from 'js/components/ControlPanel/common/Loading'
import { sendFeedMessage } from 'js/actions/feeds'
import { SEND_FEED_MESSAGE } from 'js/constants/actions/feeds'

const MAX_VIEWPORT_WIDTH_STICKY = 1850

const FullArea = styled.div`
  display: flex;
`

const SettingsArea = styled.div`
  padding: 20px;
  @media only screen and (min-width: 930px) {
    padding: 55px;
  }
  width: 100%;
  max-width: 840px;
`

const PreviewArea = styled.div`
  /* display: flex; */
  display: inline-block;
  align-items: center;
  /* height: 100%; */
  width: 700px;
  padding: 4em 0;
  flex: 1;
  /* margin-top: 7em; */
  justify-items: center;
`

const PreviewButtons = styled.div`
  display: flex;
  flex-direction: column;
  > div:first-child {
    margin-bottom: 10px;
    > button {
      width: 115px;
    }
  }
  @media only screen and (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    > div:first-child {
      margin-bottom: 0;
    }
  }
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menu {
    width: 100%;
  }
  .item {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

function Message () {
  const botConfig = useSelector(state => state.botConfig)
  const feed = useSelector(feedSelectors.activeFeed)
  const feedsFetching = useSelector(feedSelectors.feedsFetching)
  const channels = useSelector(state => state.channels)
  const sendingToDiscord = useSelector(state => state.loading[SEND_FEED_MESSAGE.BEGIN])
  const subscribers = useSelector(state => state.subscribers)
  const articleList = useSelector(state => state.articles.original)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [articleID, setArticleID] = useState()
  const [inputMessage, setInputMessage] = useState('')
  const [inputEmbeds, setInputEmbeds] = useState([])
  const [previewNew, setPreviewNew] = useState(true)
  const dispatch = useDispatch()
  const scrollReference = useRef()

  useEffect(() => {
    dispatch(changePage(pages.MESSAGE))
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  })

  if (feedsFetching) {
    return <Loading />
  } else if (!feed) {
    dispatch(changePage(pages.DASHBOARD))
    return <Redirect to={pages.DASHBOARD} />
  }

  const hasSubscribers = subscribers.find(s => s.feed === feed._id)
  const originalMessage = feed.text || botConfig.defaultText
  const messageToDisplay = inputMessage || originalMessage

  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)
  }

  const onMessageUpdate = (text) => {
    setInputMessage(text)
  }

  const onEmbedsUpdate = (embeds) => {
    setInputEmbeds(embeds)
  }

  const sendMessage = async (channelID) => {
    const article = articleList[articleID]
    await dispatch(sendFeedMessage(feed.guild, feed._id, article, channelID))
  }

  const PreviewSectionHead = (
    <>
      <SectionTitle heading='Preview' subheading='I can preview my settings right here?! Wow!' />
      <PreviewButtons>
        <ButtonGroup>
          <Button content='See Original' onClick={e => setPreviewNew(false)} disabled={!previewNew} />
          <Button content='See New' onClick={e => setPreviewNew(true)} disabled={previewNew} />
        </ButtonGroup>
        {feed.webhook
          ? <Button content='Send Original to Discord' loading={sendingToDiscord} onClick={e => sendMessage()} />
          : (
            <Dropdown button text='Send Original to Discord' loading={sendingToDiscord}>
              <Dropdown.Menu>
                <Dropdown.Menu scrolling>
                  {channels.map(channel => (
                    <Dropdown.Item
                      key={channel.id}
                      text={`#${channel.name}`}
                      value={channel.id}
                      onClick={e => sendMessage(channel.id)}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown.Menu>
            </Dropdown>
          )}

      </PreviewButtons>
    </>
  )

  return (
    <FullArea>
      <SettingsArea ref={scrollReference}>
        <PageHeader>
          <h2>Text/Embed Customization</h2>
          <p>Set a custom text and/or embed for your feed.</p>
        </PageHeader>
        <Divider />
        <SectionTitle heading='Placeholders' subheading='Below are the available placeholders for the selected article.' />
        <Placeholders updateArticleID={articleID => setArticleID(articleID)} />
        <Divider />
        <SectionTitle
          heading='Text' subheading={
            <span>
              <span>Remember that you can use the placeholders listed above. A special placeholder, {'{empty}'} can be used to create an empty message, but only if an embed is used. Regular formatting such as bold and etc. is also available.</span>
              {!hasSubscribers
                ? null
                : messageToDisplay === '' || messageToDisplay.includes('{subscriptions}') ? '' : <span style={{ color: colors.discord.yellow }}> Note that because the placeholder {'{subscriptions}'} is not in your message, feed subscribers will not be mentioned.</span>}
            </span>

          }
        />
        <MessageSettings originalMessage={originalMessage} onUpdate={onMessageUpdate} />
        <Divider />
        <EmbedSettings onUpdate={onEmbedsUpdate} />
        <Divider />
        {windowWidth >= MAX_VIEWPORT_WIDTH_STICKY
          ? null
          : (
            <>
              {PreviewSectionHead}
              <div style={{ marginTop: '20px' }}>
                <Preview embeds={previewNew ? inputEmbeds : feed.embeds} message={previewNew ? messageToDisplay : originalMessage} articleID={articleID} />
              </div>
              <Divider />
            </>
          )}
      </SettingsArea>
      {windowWidth < MAX_VIEWPORT_WIDTH_STICKY
        ? null
        : (
          <Sticky context={scrollReference} offset={55}>
            <PreviewArea stickied>
              {PreviewSectionHead}
              <div style={{ height: windowHeight - 55 - 70 - 150, marginTop: '20px' }}> {/* 55 is the topbar, 70 is the margin/padding, 150 is the rest of the space to leave */}
                <Scrollbars>
                  <Preview embeds={previewNew ? inputEmbeds : feed.embeds} message={previewNew ? messageToDisplay : originalMessage} articleID={articleID} />
                </Scrollbars>
              </div>
            </PreviewArea>
          </Sticky>)}
    </FullArea>
  )
}

export default Message
