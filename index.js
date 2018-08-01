const bodyParser = require('body-parser')
const express = require('express')
const reddit = require('./reddit')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Content-Length')
  res.setHeader('Access-Control-Allow-Credentials', true)
  if (req.method === 'OPTIONS') res.sendStatus(200)
  else next()
});


app.post('/', async (req, res) => {
  try {
    let token = await reddit.authorizationCodeToAccessToken(req)
    let user = await reddit.accessTokenToUser(token)
    let subscriptions = await reddit.accessTokenToUserSubscriptions(token)
    console.log(token)
    console.log(user)
    console.log(subscriptions)
    /*
    token = {
      access_token: '63001037523-3Ez0IuXAh6fO_HP9H4r9ppWvM1k',
      token_type: 'bearer',
      expires_in: 3600,
      scope: 'identity mysubreddits'
    }
    user = {
      name: 'Alasa-Lerin',
      id: 'sad8f6'
    }
    subscriptions = [{
      name: 'linuxhardware',
      id: '3gxbf',
      favorited: false,
      contributor: false
    }]
    */

    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    res.sendStatus(400)
  }
})

app.listen(3412)
console.log('listening on port 3412')
