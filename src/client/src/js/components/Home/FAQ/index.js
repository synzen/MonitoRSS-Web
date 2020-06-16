import React, { useState, useEffect, useRef } from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PageHeader from '../../common/PageHeader'
import styled from 'styled-components'
import { Button, Input, Divider } from 'semantic-ui-react'
import colors from '../../../constants/colors'
import pages from '../../../constants/pages'
import SectionItemTitle from '../../common/SectionItemTitle'
import SectionSubtitle from '../../common/SectionSubtitle'
import { lighten, transparentize } from 'polished'
import Section from '../Main/common/Section'
import posed, { PoseGroup } from 'react-pose'
import PropTypes from 'prop-types'
import axios from 'axios'
import textParser from '../../ControlPanel/utils/textParser'

const Header = styled.div`
  position: relative;
  background-color: #26262b;
  width: 100%;
  height: 350px;
  padding: 0 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > div:first-child {
    padding-bottom: 10px;
  }
  > p {
    margin-bottom: 30px;
  }
  .ui.input {
    max-width: 700px;
    width: 100%;
  }
  .ui.dropdown {
    max-width: 700px;
    width: 100%;
  }
`

const QAWrapper = posed.div({
  enter: {
    opacity: 1,
    transition: {
      duration: 200
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 200
    }
  }
})

const SearchInputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`

const QAWrapperInner = styled.div`
  position: relative;
  display: flex;
  > div:last-child {
    width: 100%;
  }
`

const BlueSidebar = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  left: 0px;
  top: 0;
  width: 2px;
  margin-top: 7px;
  border-left-color: ${colors.discord.blurple};
  border-left-width: 3px;
  border-left-style: solid;
  height: 100%;
  z-index: 1000;
`

const SectionFAQ = styled.div`
  width: 100%;
  text-align: left;
  > div:first-child {
    > h2 {
      margin-bottom: 0;
    }
    display: flex;
    justify-content: space-between;
  }
  a {
    cursor: pointer;
    display: block;
    text-decoration-color: #7289da;
  }
`

const SectionFAQHeader = styled.div`
 h2 {
    margin: 0 20px 0 0;
 }
 > div:first-child {
    display: flex;
    align-items: center;
    > button {
      margin-right: 20px;
    }
 }
`

const AnswerStyles = styled.div`
  position: relative;
  padding-left: 15px;
  overflow: hidden;
  > span {
    font-size: 1.15em;
    line-height: 1.75em;
    > a {
      display: inline;
    }
  }
  label {
    margin-top: 25px;
  }
`

const Answer = posed(AnswerStyles)({
  expand: { height: 'auto', opacity: 1 },
  minimize: { height: 0, opacity: 0 }
})

const TagContainer = styled.div`
  > span {
    margin-right: 3px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const Tag = styled.span`
  display: inline-block;
  padding: 3px 5px;
  border-radius: 3px;
  color: ${transparentize(0.5, colors.discord.greyple)};
  border-style: solid;
  border-width: 1px;
  border-color: ${transparentize(0.5, colors.discord.greyple)};
  margin-right: 3px;
`

function FAQ (props) {
  const itemsPerPage = 10
  const inputRef = useRef()
  const [searchTerm, setSearch] = useState('')
  const [searchedTerm, setSearchedTerm] = useState('')
  const [topOffsets, setTopOffsets] = useState({})
  const faqDocuments = useSelector(state => state.faq)
  const [searchedDocuments, setSearchedDocuments] = useState()
  const [showDocuments, setShowDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState()
  const [page, setPage] = useState(0)
  const history = useHistory()
  const paramQuestion = props.match.params.question

  function getPageOfQuestion (docIndex) {
    if (docIndex === -1) {
      return 0
    }
    return Math.floor(docIndex / itemsPerPage)
  }

  function onSearchKeyDown (e) {
    const keycode = e.keyCode
    if (keycode === 13) {
      // Enter
      executeSearch()
    }
  }

  async function executeSearch () {
    inputRef.current.focus()
    if (!searchTerm) {
      return clearSearch()
    }
    const { data } = await axios.get(`/api/faq?search=${searchTerm}`)
    const formatted = data.map(doc => ({
      ...doc,
      a: textParser.parseAllowLinks(doc.a)
    }))
    setSearchedDocuments(formatted)
    setSearchedTerm(searchTerm)
    setSearch('')
    setPage(0)
  }

  function clearSearch () {
    setSearchedTerm('')
    setSearchedDocuments()
    setSelectedDocument()
    setPage(0)
    history.push(pages.FAQ)
  }

  function onClickDocument (document) {
    if (selectedDocument && selectedDocument.q === document.q) {
      return setSelectedDocument()
    }
    axios.post('/api/faq', {
      question: document.q
    }).catch(console.error)
    setSelectedDocument(document)
  }

  function prevPage () {
    if (page - 1 >= 0) {
      setPage(page - 1)
    }
  }

  function nextPage () {
    const lastItemIndex = (page + 1) * itemsPerPage
    if (lastItemIndex < items.length) {
      setPage(displayPage)
    }
  }

  // Focus on the input when loaded
  useEffect(() => {
    if (faqDocuments.length === 0) {
      return
    }
    inputRef.current.focus()
  }, [faqDocuments])

  // Set the selected question as active
  useEffect(() => {
    if (showDocuments.length === 0) {
      return
    }
    const selectedQuestionIndex = showDocuments.findIndex(item => item.qe === paramQuestion)
    if (selectedQuestionIndex === -1) {
      return
    }
    setSelectedDocument(showDocuments[selectedQuestionIndex])
    setPage(getPageOfQuestion(selectedQuestionIndex))
  }, [showDocuments, paramQuestion])

  // Determine what documents to show
  useEffect(() => {
    if (faqDocuments.length === 0) {
      return
    }
    if (searchedDocuments) {
      setShowDocuments(searchedDocuments)
    } else {
      setShowDocuments(faqDocuments)
    }
  }, [faqDocuments, searchedDocuments])

  // Scroll to selected item when the ref and scrollbar are defined
  useEffect(() => {
    if (showDocuments.length === 0) {
      return
    }
    if (props.scrollbar && selectedDocument && topOffsets[selectedDocument.qe]) {
      props.scrollbar.scrollTop(topOffsets[selectedDocument.qe])
    }
  }, [props.scrollbar, selectedDocument, topOffsets, showDocuments])

  // Scroll after searching an item
  useEffect(() => {
    if (showDocuments.length === 0) {
      return
    }
    if (searchTerm === '' && props.scrollbar && selectedDocument && topOffsets[selectedDocument.qe]) {
      props.scrollbar.scrollTop(topOffsets[selectedDocument.qe])
    }
  }, [searchTerm, props.scrollbar, selectedDocument, topOffsets, showDocuments])

  // Set document title
  useEffect(() => {
    if (selectedDocument) {
      document.title = `Discord.RSS - FAQ - ${selectedDocument.q}`
    } else {
      document.title = 'Discord.RSS - FAQ'
    }
  }, [selectedDocument])

  const addedTopOffset = false
  const items = showDocuments.map((item, index) => {
    const selected = selectedDocument && selectedDocument.qe === item.qe
    return (
      <QAWrapper
        key={item.q} ref={elem => {
          if (!topOffsets[item.qe]) topOffsets[item.qe] = elem.offsetTop
        }}
      >
        <QAWrapperInner>
          {/* <CopyIcon name='copy' /> */}
          <div>
            <Link to={selected ? pages.FAQ : `${pages.FAQ}/${item.qe}`} onClick={e => onClickDocument(item)}>
              <SectionItemTitle
                as='span'
                style={{
                  fontSize: '20px',
                  lineHeight: '35px',
                  fontWeight: selected ? 600 : 'normal',
                  color: selected ? lighten(0.125, colors.discord.blurple) : colors.discord.white

                }}
              >
                {item.q}
              </SectionItemTitle>
            </Link>
            <Answer pose={selected ? 'expand' : 'minimize'} initialPose='minimize'>
              <BlueSidebar show={selected} />
              <span>{item.a}</span>
              <SectionSubtitle>Keywords</SectionSubtitle>
              <TagContainer>
                {selectedDocument && selectedDocument.t.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
              </TagContainer>
            </Answer>
          </div>

        </QAWrapperInner>
        <Divider />
      </QAWrapper>
    )
  })

  if (addedTopOffset) setTopOffsets(topOffsets)

  const displayPage = page + 1
  const lastItem = displayPage * itemsPerPage
  return (
    <div>
      <Header>
        <PageHeader heading='Frequently Asked Questions' style={{ textAlign: 'center' }} />
        <p style={{ textAlign: 'center' }}>
          A labyrinth of information at your disposal.
        </p>
        <SearchInputWrapper>
          <Input
            ref={inputRef}
            disabled={faqDocuments.length === 0}
            action={<Button icon={searchedTerm && !searchTerm ? 'x' : 'search'} onClick={executeSearch} />}
            onKeyDown={e => onSearchKeyDown(e)}
            onChange={e => setSearch(e.target.value)}
            value={searchTerm}
          />
        </SearchInputWrapper>
        {/* <Dropdown multiple search selection options={allTagsOptions} /> */}
      </Header>
      <Section>
        <SectionFAQ pose='enter' key='faq'>
          <SectionFAQHeader>
            <div>
              <h2>{faqDocuments.length === 0
                ? 'Loading...'
                : searchedTerm
                  ? `${searchedDocuments.length} Search Results for "${searchedTerm}"`
                  : 'Top Questions'}
              </h2>
              {searchedTerm ? <Button basic icon='x' content='Clear' onClick={e => clearSearch()} /> : null}
            </div>
            <Button.Group>
              <Button size='large' icon='caret left' disabled={page === 0} onClick={prevPage} />
              <Button.Or text={displayPage} />
              <Button size='large' icon='caret right' disabled={lastItem >= items.length} onClick={nextPage} />
            </Button.Group>
          </SectionFAQHeader>
          <br />
          <PoseGroup flipMove>
            {items.slice(lastItem - itemsPerPage, lastItem)}
          </PoseGroup>
        </SectionFAQ>
        <span>Page {displayPage}/{1 + Math.floor(items.length / itemsPerPage)}</span>
      </Section>
    </div>
  )
}

FAQ.propTypes = {
  scrollbar: PropTypes.object,
  match: PropTypes.object
}

export default withRouter(FAQ)
