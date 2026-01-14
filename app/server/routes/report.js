'use strict'
var express = require('express')
const fetch = require('node-fetch')
const https = require('https')
const http = require('http')
const urljoin = require('url-join')
const { createPDF, createJSONPDF } = require('./pdf_report')
const { formatLang } = require('./utils')

var router = express.Router()

/* GET JSON PDF report  */
router.get('/:id/jsonpdf', async (req, res) => {
  const id = req.params.id
  const lang = req.query.lang
  const reportId = req.query.reportId

  console.log('getJSONPDFReport:' + JSON.stringify({ id: id, reportId: reportId }))
  let response

  try {
    response = await getJSONReport(reportId)

    checkResponseStatus(response)

    const json = await response.json()

    createJSONPDF(res, json, lang)
  } catch (err) {
    console.log(err.message)
    res.status(response?.status ?? 500)
    return res.send(err.message)
  }
})

/* GET PDF report  */
router.get('/:id/pdf', async (req, res) => {
  const id = req.params.id
  const locale = formatLang(req.query.lang) || 'en'
  const reportId = req.query.reportId

  console.log('getPDFReport:' + JSON.stringify({ id: id, locale: locale }))

  let response

  try {
    response = await getTestRun(id)
    const data = await response.json()
    checkResponseStatus(response)

    const translationResponse = await getTranslation(reportId, locale)
    checkResponseStatus(translationResponse)
    data['json'] = await translationResponse.json()

    createPDF(res, data, locale)
  } catch (err) {
    console.log(err.message)
    res.status(response?.status ?? 500)
    return res.send(err.message)
  }
})

function checkResponseStatus(res) {
  if (res.ok) {
    return res
  } else {
    throw new Error(`The HTTP status of the response: ${res.status} (${res.statusText})`)
  }
}

async function getTestRun(id) {
  const url = urljoin(process.env.SALVIA_API_URL, 'api/testruns', id)

  const httpAgent = url.startsWith('https')
    ? new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
      })
    : new http.Agent()

  try {
    const res = await fetch(url, { agent: httpAgent })

    return res
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

//get JSON report from storage by reportId
async function getJSONReport(reportId) {
  const url = urljoin(process.env.SALVIA_FUNCTION_URL, 'api/jsonreport') + '?id=' + reportId

  const httpAgent = url.startsWith('https')
    ? new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
      })
    : new http.Agent()

  try {
    const res = await fetch(url, {
      agent: httpAgent,
      headers: { 'x-functions-key': process.env.SALVIA_FUNCTION_API_KEY },
    })

    return res
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

/*get report translated to specific language*/
async function getTranslation(id, locale) {
  //TODO: get translation by reportId
  const url =
    urljoin(process.env.SALVIA_FUNCTION_URL, 'api/translate') + '?id=' + id + '&locale=' + locale

  const httpAgent = url.startsWith('https')
    ? new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true,
      })
    : new http.Agent()

  try {
    const res = await fetch(url, {
      agent: httpAgent,
      headers: { 'x-functions-key': process.env.SALVIA_FUNCTION_API_KEY },
    })

    return res
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

module.exports = router
