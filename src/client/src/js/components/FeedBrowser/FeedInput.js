import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Input, Button } from 'semantic-ui-react'

class FeedInput extends Component {
  constructor (props) {
    super()
    const sessionData = sessionStorage.getItem('feedbrowserData')

    this.state = {
      url: props.match.params.url ? decodeURIComponent(props.match.params.url) : sessionData ? JSON.parse(sessionData).prevUrl : ''
    }
  }

  handleGetArticles = () => this.props.getArticles(this.state.url)

  render () {
    return (
      <Input
        fluid
        placeholder='Enter a feed URL!'
        disabled={this.props.loading}
        action={<Button disabled={!this.state.url} content='Get' onClick={this.handleGetArticles} />}
        onKeyPress={e => e.key === 'Enter' ? this.handleGetArticles() : null}
        onChange={e => this.setState({ url: e.target.value })}
        value={this.state.url}
      />
    )
  }
}

FeedInput.propTypes = {
  match: PropTypes.object,
  loading: PropTypes.bool,
  getArticles: PropTypes.func
}

export default withRouter(FeedInput)
