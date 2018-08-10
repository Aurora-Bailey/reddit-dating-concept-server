const bodyParser = require('body-parser')
const express = require('express')
const RedditAPI = require('./reddit-api')

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
    if (req.body.code && req.body.state && typeof req.body.code === 'string' && req.body.code.length < 100) {
      let InstanceRedditAPI = new RedditAPI()
      let authenticate = await InstanceRedditAPI.authenticate(req.body.code)
      let identity = await InstanceRedditAPI.identity()
      let subscriptions = await InstanceRedditAPI.subscriptions()
      /*
      identity = {
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
    } else throw {error: 'malformed_query_string'}

    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    res.sendStatus(400)
  }
})

app.listen(3412)
console.log('listening on port 3412')
