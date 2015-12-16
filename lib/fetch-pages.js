const http = require('http')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const sanitize = require('sanitize-filename')
const mime = require('mime-types')

const BASE_URL = 'http://reading-web-research.wmflabs.org'

const endpoints = {
  slim: (title) => `wiki/${title}?full`,
  'slim-lead': (title) => `wiki/${title}`
}

module.exports = function fetchPages (config, dir) {
  const pages = config.pages
  return Promise.all(pages.map((p) => fetchPage(p, dir)))
}

function fetchPage (title, outputDir) {
  return new Promise((resolve, reject) =>
    mkdirp(path.join(outputDir, sanitize(title)), (err) => {
      if (err) return reject(err)
      Promise.all(Object.keys(endpoints).map((endpointName) =>
        fetchPageFromEndpoint(title, endpointName, endpoints[endpointName])
          .then((res) => storePage(title, endpointName, res, outputDir))
      ))
    })
  )
}

function fetchPageFromEndpoint (title, endpointName, endpoint) {
  console.log(`Fetch ${BASE_URL}/${endpoint(title)}`)
  return new Promise((resolve, reject) =>
    http.get(`${BASE_URL}/${endpoint(title)}`, resolve).on('error', reject))
}

function storePage (title, endpointName, response, outputDir) {
  return new Promise((resolve, reject) => {
    const ext = mime.extension(response.headers['content-type'])
    const filePath = path.join(outputDir, title, `${endpointName}.${ext}`)
    response.on('error', reject)
    const file = fs.createWriteStream(filePath)
    file.on('error', reject)
    response.pipe(file)
    response.on('end', () => {
      console.log(`Stored ${filePath}`)
      resolve()
    })
  })
}
