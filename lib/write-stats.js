const fs = require('fs')
const path = require('path')

module.exports = function writeStats (stats, dir, filename) {
  return new Promise((resolve, reject) =>
    fs.writeFile(path.join(dir, filename), JSON.stringify(stats, null, 2), 'utf8', (err) =>
      err ? reject(err) : resolve()))
}
