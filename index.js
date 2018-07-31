const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const credentials = require('./credentials.json')

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


app.post('/', (req, res) => {

  authorizationToAccessToken(req, res).then(token => {
    /*
    { access_token: '63001037523-3Ez0IuXAh6fO_HP9H4r9ppWvM1k',
      token_type: 'bearer',
      expires_in: 3600,
      scope: 'mysubreddits' }
    */
  }).catch(err => {
    res.status(err.code).send(err)
  })
})

app.listen(3412)
console.log('listening on port 3412')

async function authorizationToAccessToken (req, res) {
  try {
    if (req.body.code && req.body.state && typeof req.body.code === 'string' && req.body.code.length < 1000) {
      let response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        `grant_type=authorization_code&code=${req.body.code}&redirect_uri=http://localhost:3000/signup/`,
        {headers: {authorization: 'Basic ' + Buffer.from(credentials.app_id + ':' + credentials.secret).toString('base64')}}
      )
      if (!response.data.error) return response.data
      else throw {error: response.data.error, code: 400}
    } else throw {error: 'malformed query string', code: 400}
  } catch (err) {
    if (!err.error) throw {error: 'unknown error', code: 418, err}
    else throw err
  }
}
