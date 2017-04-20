var staticUrl = function (env, projectName) {
  var result = ''
  switch (env) {
    case 'production':
      result = ''
      break
    case 'dev':
      result = ''
      break
    default:
      result = ''
      break
  }
  return result
}

module.exports = staticUrl
