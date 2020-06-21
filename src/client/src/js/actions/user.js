import axios from 'axios'
import {
  SET_USER, GET_BOT_USER
} from '../constants/actions/user'
import { fetchGuilds } from './guilds'
import { fetchBotConfig } from './botConfig'
import FetchStatusActions from './utils/FetchStatusActions'

export const {
  begin: setUserBegin,
  success: setUserSuccess,
  failure: setUserFailure
} = new FetchStatusActions(SET_USER)

export const {
  begin: getBotUserBegin,
  success: getBotUserSuccess,
  failure: getBotUserFailure
} = new FetchStatusActions(GET_BOT_USER)

export function fetchUser () {
  return async dispatch => {
    try {
      dispatch(setUserBegin())
      // Fetch the user first in case the token needs to be refreshed
      const { data } = await axios.get('/api/users/@me')
      dispatch(setUserSuccess(data))
    } catch (err) {
      dispatch(setUserFailure(err))
    }
  }
}

export function fetchBotUser () {
  return async dispatch => {
    dispatch(getBotUserBegin())
    const { data } = await axios.get('/api/users/@bot')
    dispatch(getBotUserSuccess(data))
    return data
  }
}
