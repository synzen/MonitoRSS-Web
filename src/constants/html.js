const fs = require('fs')
const path = require('path')
const htmlFile = fs.readFileSync(path.join(__dirname, '..', 'client/build', 'index.html')).toString()
const disabledFile = fs.readFileSync(path.join(__dirname, '..', 'client/disabled', 'disabled.html')).toString()
const DEFAULT_META_TITLE = 'Under Construction'
const DEFAULT_META_DESCRIPTION = 'Get news and notifications delivered from anywhere that supports RSS, whether it\'s Reddit, Youtube, or your favorite traditional news outlet.\n\nThis site is currently under construction.'

module.exports = {
  indexFile: htmlFile,
  disabledFile: disabledFile,
  metaTitle: DEFAULT_META_TITLE,
  metaDescription: DEFAULT_META_DESCRIPTION
}
