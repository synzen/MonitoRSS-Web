/**
 * @param {import('node-fetch').Response} res
 */
async function getResponseError (res) {
  if (res.headers.get('content-type') === 'application/json') {
    return res.json()
  } else {
    return res.text()
  }
}

module.exports = getResponseError
