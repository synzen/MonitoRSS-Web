import { GET_STATS } from 'js/constants/actions/stats'

const initialState = {
  articlesDelivered: 0,
  feedCount: 0,
  totalGuilds: 0
}

function statsReducer (state = initialState, action) {
  switch (action.type) {
    case GET_STATS.SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default statsReducer
