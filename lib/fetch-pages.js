const http = require('http')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const sanitize = require('sanitize-filename')
const mime = require('mime-types')
const zlib = require('zlib')

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
          .then(([path, gzip]) => ({ title, path, gzip, endpoint: endpointName }))
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
  const ext = 'html' || mime.extension(response.headers['content-type'])
  const filePath = path.join(outputDir, sanitize(title), `${endpointName}.${ext}`)
  return Promise.all([
    new Promise((resolve, reject) => {
      response.on('error', reject)
      response.on('end', resolve)
    }),
    new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath)
      file.on('error', reject)
      response.on('end', () => resolve(filePath))
      response.pipe(file)
    }),
    new Promise((resolve, reject) => {
      const gzip = zlib.createGzip({ level: 6 })
      const compressedfile = fs.createWriteStream(filePath + '.gz')
      compressedfile.on('error', reject)
      gzip.on('end', () => resolve(filePath + '.gz'))
      response.pipe(gzip).pipe(compressedfile)
    })
  ]).then(([_, storedFile, storedCompressedFile]) => {
    console.log(`Stored ${filePath}`)
    return [storedFile, storedCompressedFile]
  })
}
