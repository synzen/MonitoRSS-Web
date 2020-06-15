import axios from 'axios'
import { GET_STATS } from 'js/constants/actions/stats'
import FetchStatusActions from './utils/FetchStatusActions'

export const {
  begin: getStatsBegin,
  success: getStatsSuccess,
  failure: getStatsFailure
} = new FetchStatusActions(GET_STATS)

export function fetchStats () {
  return async dispatch => {
    try {
      dispatch(getStatsBegin())
      const { data } = await axios.get('/api/stats')
      console.log(data)
      dispatch(getStatsSuccess(data))
    } catch (err) {
      dispatch(getStatsFailure(err))
    }
  }
}
