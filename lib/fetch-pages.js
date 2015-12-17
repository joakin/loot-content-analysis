const http = require('http')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const sanitize = require('sanitize-filename')
const mime = require('mime-types')

module.exports = function fetchPages (config, dir) {
  const pages = config.pages
  return Promise.all(pages.map((p) => fetchPage(p, dir, config)))
}

function fetchPage (title, outputDir, config) {
  return new Promise((resolve, reject) =>
    mkdirp(path.join(outputDir, sanitize(title)), (err) => {
      if (err) return reject(err)
      resolve(Promise.all(Object.keys(config.endpoints).map((endpointName) =>
        fetchPageFromEndpoint(title, endpointName, config.server, config.endpoints[endpointName])
          .then((res) => storePage(title, endpointName, res, outputDir))
          .then((path) => ({ title, path, endpoint: endpointName }))
      )))
    })
  )
}

function fetchPageFromEndpoint (title, endpointName, server, endpoint) {
  console.log(`Fetch ${server}/${endpoint(title)}`)
  return new Promise((resolve, reject) =>
    http.get(`${server}/${endpoint(title)}`, resolve).on('error', reject))
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
      resolve(filePath)
    })
  })
}
