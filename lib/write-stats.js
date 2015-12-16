const fs = require('fs')
const path = require('path')

module.exports = function writeStats (stats, dir) {
  return new Promise((resolve, reject) =>
    fs.writeFile(path.join(dir, 'stats.json'), JSON.stringify(stats, null, 2), 'utf8', (err) =>
      err ? reject(err) : resolve()))
}
