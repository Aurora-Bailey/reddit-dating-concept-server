const axios = require('axios')
const credentials = require('./credentials.json')

let version = 0.1

class Reddit {
  constructor () {

  }

  async authorizationCodeToAccessToken (req) {
    if (req.body.code && req.body.state && typeof req.body.code === 'string' && req.body.code.length < 1000) {
      let response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        `grant_type=authorization_code&code=${req.body.code}&redirect_uri=http://localhost:3000/signup/`,
        {headers: {authorization: 'Basic ' + Buffer.from(credentials.app_id + ':' + credentials.secret).toString('base64')}}
      )
      if (!response.data.error) return response.data
      else throw response.data
    } else throw {error: 'malformed_query_string'}
  }

  async accessTokenToUser (token) {
    let response = await axios.get(
      'https://oauth.reddit.com/api/v1/me',
      {headers: {"Authorization": token.token_type + ' ' + token.access_token, "User-Agent": (`node:${credentials.app_name}:${version} (by /u/${credentials.username})`.toLowerCase())}}
    )
    return response.data
  }

  async accessTokenToUserSubscriptions (token) {
    let maxPages = 20 // 2000 subreddits
    var subscriptions = []
    var after = null
    do {
      let qs = {}
      qs.limit = 100
      qs.count = subscriptions.length
      if (after) qs.after = after

      let response = await axios.get(
        'https://oauth.reddit.com/subreddits/mine/subscriber',
        {params: qs, headers: {"Authorization": token.token_type + ' ' + token.access_token, "User-Agent": (`node:${credentials.app_name}:${version} (by /u/${credentials.username})`.toLowerCase())}}
      )
      response.data.data.children.forEach(child => {subscriptions.push({name: child.data.display_name, id: child.data.id, favorited: child.data.user_has_favorited, contributor: child.data.user_is_contributor})})
      after = response.data.data.after
      maxPages--
    } while (after !== null && typeof after !== 'undefined' && maxPages > 0)

    return subscriptions
  }
}

module.exports = new Reddit()
