import { GET_FAQ } from 'js/constants/actions/faq'

const initialState = []

function faqReducer (state = initialState, action) {
  switch (action.type) {
    case GET_FAQ.SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default faqReducer
