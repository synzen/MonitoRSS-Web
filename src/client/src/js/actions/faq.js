import axios from 'axios'
import { GET_FAQ } from 'js/constants/actions/faq'
import FetchStatusActions from './utils/FetchStatusActions'
import textParser from '../components/ControlPanel/utils/textParser'

export const {
  begin: getFaqBegin,
  success: getFaqSuccess,
  failure: getFaqFailure
} = new FetchStatusActions(GET_FAQ)

export function fetchFaq () {
  return async dispatch => {
    try {
      dispatch(getFaqBegin())
      const { data } = await axios.get('/api/faq')
      data.forEach((item) => {
        item.a = textParser.parseAllowLinks(item.a)
      })
      dispatch(getFaqSuccess(data))
    } catch (err) {
      dispatch(getFaqFailure(err))
    }
  }
}
