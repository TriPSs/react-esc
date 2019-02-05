// Non-breaking space is specifically handled inside the replacer function here:

export default str => (
  str && str.replace(/[ \n\r\t\f\xA0]+/g, function (spaces) {
    return spaces === '\t' ? '\t' : spaces.replace(/(^|\xA0+)[^\xA0]+/g, '$1 ')
  })
)
