const fs = require('fs')

module.exports = function fetchStats (pages, prop) {
  return Promise.all(pages.map((page) => getStats(page, prop)))
}

function getStats (page, prop) {
  return stat(page[prop])
    .then((stats) => Object.assign({}, page, { size: stats.size }))
}

function stat (p) {
  return new Promise((resolve, reject) =>
    fs.stat(p, (err, stats) =>
      err ? reject(err) : resolve(stats)))
}
