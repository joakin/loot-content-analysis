var getConfig = require('hjs-webpack')

var config = getConfig({
  // entry point for the app
  in: 'browser/index.js',

  // Name or full path of output directory
  // commonly named `www` or `public`. This
  // is where your fully static site should
  // end up for simple deployment.
  out: 'examples',
  html: (context) => ({
    'index.html': context.defaultTemplate({
      title: 'Loot content analysis',
      publicPath: './'
    })
  })
})

module.exports = config
