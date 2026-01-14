'use strict'
const express = require('express')
const fetch = require('node-fetch')
const https = require('https')
const http = require('http')
const urljoin = require('url-join')

const router = express.Router()

function checkResponseStatus(res) {
  if (res.ok) {
    return res
  } else {
    throw new Error(`The HTTP status of the response: ${res.status} (${res.statusText})`)
  }
}

//send test case to Salvia
router.post('/test', async (req, res) => {
  const url = urljoin(process.env.SALVIA_API_URL, '/api/testcases')

  const agent = url.startsWith('https')
    ? new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
      })
    : new http.Agent()

  let response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      agent: agent,
    })

    checkResponseStatus(response)
    const data = await response.json()

    return res.status(200).json({ data: data })
  } catch (err) {
    console.log(err.message)
    res.status(response?.status ?? 500)
    return res.send(err.message)
  }
})

//get completed tests
router.get('/testcases', async (req, res) => {
  const url = urljoin(process.env.SALVIA_API_URL, '/api/testcases')

  const agent = url.startsWith('https')
    ? new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
      })
    : new http.Agent()

  let response

  try {
    response = await fetch(url, {
      agent: agent,
    })

    checkResponseStatus(response)
    const data = await response.json()

    return res.status(200).json(data)
  } catch (err) {
    console.log(err.message)
    res.status(response?.status ?? 500)
    return res.send(err.message)
  }
})

module.exports = router
