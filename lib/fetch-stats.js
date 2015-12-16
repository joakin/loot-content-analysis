const fs = require('fs')

module.exports = function fetchStats (pages) {
  return Promise.all(pages.map(getStats))
}

function getStats (page) {
  return new Promise((resolve, reject) =>
    fs.stat(page.path, (err, stats) =>
      err ? reject(err) : resolve(stats))
  ).then((stats) => Object.assign({}, page, { size: stats.size }))
}
