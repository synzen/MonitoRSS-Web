import { GET_STATS } from 'js/constants/actions/stats'

const initialState = {
  articlesDelivered: {
    data: 0,
    addedAt: new Date('June 2, 2020').toISOString()
  },
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
