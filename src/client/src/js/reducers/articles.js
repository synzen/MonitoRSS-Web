import {
  GET_ARTICLES
} from '../constants/actions/feeds'

const initialState = {
  original: [],
  placeholders: []
}

function articlesReducer (state = initialState, action) {
  switch (action.type) {
    case GET_ARTICLES.SUCCESS:
      return {
        original: action.payload.articles,
        placeholders: action.payload.placeholderArticles
      }
    default:
      return state
  }
}

export default articlesReducer
