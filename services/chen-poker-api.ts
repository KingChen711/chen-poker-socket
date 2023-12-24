import axios from 'axios'

export const chenPokerApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`
})
