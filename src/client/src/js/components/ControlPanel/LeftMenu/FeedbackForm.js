import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import feedbackSelector from 'js/selectors/feedback'
import { fetchCreateFeedback } from 'js/actions/feedback'
import modal from 'js/components/utils/modal'

const FeedbackFormButton = () => {
  const [feedback, setFeedback] = useState('')
  const dispatch = useDispatch()
  const savingFeedback = useSelector(feedbackSelector.feedbackSaving)

  const submitFeedback = async () => {
    await dispatch(fetchCreateFeedback(feedback))
    setFeedback('')
    modal.hide()
  }

  return (
    <Form>
      <Form.Field>
        <textarea
          aria-label='Feedback'
          onChange={e => setFeedback(e.target.value)}
          value={feedback}
          placeholder='Input your feedback'
        />
      </Form.Field>
      <Form.Field>
        <Button
          content='Submit'
          type='submit'
          fluid
          disabled={!feedback.trim() || savingFeedback}
          loading={savingFeedback}
          onClick={submitFeedback}
        />
      </Form.Field>
    </Form>
  )
}

export default FeedbackFormButton
