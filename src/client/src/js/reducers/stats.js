import { GET_STATS } from 'js/constants/actions/stats'

const initialState = {
  articlesSent: {
    data: 0,
    addedAt: new Date('June 2, 2020').toISOString()
  },
  feedCount: 0,
  totalGuilds: 0
}

function statsReducer (state = initialState, action) {
  switch (action.type) {
    case GET_STATS.SUCCESS: {
      const payload = action.payload
      return {
        articlesSent: {
          data: payload.articlesSent.data,
          addedAt: payload.articlesSent.addedAt || initialState.articlesSent.addedAt
        },
        feedCount: payload.feedCount,
        totalGuilds: payload.totalGuilds
      }
    }
    default:
      return state
  }
}

export default statsReducer
