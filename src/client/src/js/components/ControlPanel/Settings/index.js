import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PageHeader from 'js/components/common/PageHeader'
import colors from 'js/constants/colors'
import SectionSubtitle from 'js/components/common/SectionSubtitle'
import PopInButton from '../common/PopInButton'
import SectionTitle from 'js/components/common/SectionTitle'
import { Input, Divider, Button } from 'semantic-ui-react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import fileDownload from 'js-file-download'
import Date from './Date'
import guildSelectors from 'js/selectors/guilds'
import { fetchEditGuild } from 'js/actions/guilds'
import { Redirect } from 'react-router-dom'
import pages from 'js/constants/pages'
import { changePage } from 'js/actions/page'

const Container = styled.div`
  padding: 20px;
  @media only screen and (min-width: 930px) {
    padding: 55px;
  }
  width: 100%;
  max-width: 840px;
`

const InputDescription = styled.div`
  margin-top: 8px;
  color: ${colors.discord.subtext};
`

const LargeDivider = styled(Divider)`
  margin-top: 40px !important;
  margin-bottom: 40px !important;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  .ui.button {
    margin-left: 1em;
  }
`

const BackupButtonContainer = styled.div`
  display: flex;
  .ui.button:first-child {
    margin-right: 1em;
  }
`

function ServerSettings () {
  const [invalidTimezone, setInvalidTimezone] = useState(false)
  const [updatedValues, setUpdatedValues] = useState({})
  const [autoSave, setAutoSave] = useState(false)
  const guild = useSelector(guildSelectors.activeGuild)
  const botConfig = useSelector(state => state.botConfig)
  const editing = useSelector(guildSelectors.editing)
  const subscribers = useSelector(state => state.subscribers)
  const feeds = useSelector(state => state.feeds)
  const dispatch = useDispatch()
  const unsaved = Object.keys(updatedValues).length > 0
  const profile = guild ? guild.profile : null

  const downloadBackup = () => {
    const data = {
      profile,
      feeds,
      subscribers
    }
    fileDownload(JSON.stringify(data, null, 2), `${guild.id}.json`)
  }

  const getOriginalPropertyValue = (property) => {
    if (!profile || profile[property] === undefined) {
      return botConfig[property]
    } else {
      return profile[property]
    }
  }

  const matchesOriginalProperty = (property, value) => {
    if (value === '') {
      if (!profile || profile[property] === undefined) {
        return true
      } else {
        return false
      }
    } else {
      return value === getOriginalPropertyValue(property)
    }
  }
  const setValue = (property, value) => {
    if (matchesOriginalProperty(property, value)) {
      const valuesCopy = { ...updatedValues }
      delete valuesCopy[property]
      setUpdatedValues(valuesCopy)
    } else {
      setUpdatedValues({
        ...updatedValues,
        [property]: value
      })
    }
  }

  const save = useCallback(async () => {
    if (!unsaved) {
      return
    }
    const toSend = {
      ...updatedValues
    }
    for (const property in updatedValues) {
      const userVal = updatedValues[property]
      if (userVal === botConfig[property]) {
        toSend[property] = ''
      }
    }
    await dispatch(fetchEditGuild(guild.id, toSend))
    resetValues()
  }, [unsaved, updatedValues, guild, botConfig, dispatch])

  const resetValues = () => {
    setUpdatedValues({})
  }

  useEffect(() => {
    dispatch(changePage(pages.SERVER_SETTINGS))
  }, [dispatch])

  useEffect(() => {
    const tz = updatedValues.timezone
    if (!tz) {
      setInvalidTimezone(false)
      return
    }
    setInvalidTimezone(!moment.tz.zone(tz))
  }, [updatedValues.timezone])

  useEffect(() => {
    if (autoSave) {
      save()
      setAutoSave(false)
    }
  }, [autoSave, save])

  if (!guild) {
    dispatch(changePage(pages.DASHBOARD))
    return <Redirect to={pages.DASHBOARD} />
  }

  const originalPrefix = getOriginalPropertyValue('prefix')
  const originalTimezone = getOriginalPropertyValue('timezone')
  const originalDateFormat = getOriginalPropertyValue('dateFormat')
  const prefixValue = updatedValues.prefix === undefined ? originalPrefix : updatedValues.prefix
  const timezoneValue = updatedValues.timezone === undefined ? originalTimezone : updatedValues.timezone
  const dateFormatValue = updatedValues.dateFormat === undefined ? originalDateFormat : updatedValues.dateFormat
  // const dateLanguageValue = updatedValues.dateLanguage === undefined ? getOriginalPropertyValue('dateLanguage') : updatedValues.dateLanguage

  return (
    <Container>
      <PageHeader heading='Server Settings' subheading='These settings will apply to all the feeds in this server.' />
      <Divider />
      <SectionTitle heading='Dates' subheading='These settings will all apply to the {date} placeholder. If no {date} placeholders are used in any feeds, these settings will have no effect.' />
      <SectionSubtitle>Preview</SectionSubtitle>
      <Date botConfig={botConfig} timezone={timezoneValue} dateFormat={dateFormatValue} invalidTimezone={invalidTimezone} />
      <br />
      <br />
      <SectionSubtitle>Timezone</SectionSubtitle>
      <Input
        fluid
        onChange={e => setValue('timezone', e.target.value)}
        error={invalidTimezone}
        value={timezoneValue}
        placeholder={originalTimezone}
        onKeyPress={e => e.key === 'Enter' ? save() : null}
        action={
          <Button
            content='Set to Default'
            onClick={e => {
              setValue('timezone', '')
              setAutoSave(true)
            }}
            disabled={(!profile || profile.timezone === undefined || profile.timezone === botConfig.timezone)}
          />
        }
      />
      <InputDescription>This will change the timezone of the {'{date}'} placeholder to the one you specify. <a href='https://en.wikipedia.org/wiki/List_of_tz_database_time_zones' target='_blank' rel='noopener noreferrer'>See here for a list of valid timezones under the "TZ database name" column.</a></InputDescription>
      <br />
      {/* <SectionSubtitle>Date Language</SectionSubtitle>
      <Dropdown selection fluid options={botConfig.dateLanguageList.map(lang => { return { text: lang, value: lang } })} value={dateLanguageValue} onChange={(e, data) => setValue('dateLanguage', data.value)} />
      <InputDescription>Only a certain number of languages are manually supported for dates. To request your language to be supported, please contact the developer on the support server.</InputDescription>
      <br /> */}
      <SectionSubtitle>Date Format</SectionSubtitle>
      <Input
        fluid
        value={dateFormatValue}
        onChange={e => setValue('dateFormat', e.target.value)}
        placeholder={getOriginalPropertyValue('dateFormat')}
        onKeyPress={e => e.key === 'Enter' ? save() : null}
        action={
          <Button
            content='Set to Default'
            onClick={e => {
              setValue('dateFormat', '')
              setAutoSave(true)
            }}
            disabled={(!profile || profile.dateFormat === undefined || profile.dateFormat === botConfig.dateFormat)}
          />
        }
      />
      <InputDescription>This will dictate how the {'{date}'} placeholder will be formatted. <a href='https://momentjs.com/docs/#/displaying/' target='_blank' rel='noopener noreferrer'>See here on how to customize your date formats.</a>.</InputDescription>
      <LargeDivider />
      <SectionTitle heading='Command Prefix' subheading='If specified, this prefix will replace the default prefix used before all commands. This setting can only be configured through the Discord command "prefix" at this time.' />
      <Input fluid onChange={e => setValue('prefix', e.target.value)} value={prefixValue} disabled />
      <LargeDivider />
      <SectionTitle heading='Alerts' subheading='Set up direct messaging to specific users when a feed has problems. This setting can only be configured through the Discord command "alert" at this time.' />
      <LargeDivider />
      <SectionTitle heading='Backup' subheading='Download a copy of all your server feeds and settings for safekeeping. This is HIGHLY recommended in case there is data loss, or if you wish to import/overwrite your settings at a later point. Restorations can be done by requesting through the support server.' />
      <BackupButtonContainer>
        <Button basic content='Download Backup' onClick={downloadBackup} />
        <Button basic content='Send Backup to Discord' disabled onClick={downloadBackup} />
      </BackupButtonContainer>
      <LargeDivider />
      <ButtonContainer>
        <PopInButton content='Reset' basic inverted pose={editing ? 'exit' : unsaved ? 'enter' : 'exit'} onClick={resetValues} />
        <Button content='Save' color='green' disabled={invalidTimezone || !unsaved || editing} onClick={save} />
      </ButtonContainer>
    </Container>
  )
}

export default ServerSettings
