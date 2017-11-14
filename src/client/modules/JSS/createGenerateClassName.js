let generatorCounter = 0

// Returns a function which generates unique class names based on counters.
// When new generator function is created, rule counter is reset.
// We need to reset the rule counter for SSR for each request.
//
// It's an improved version of
// https://github.com/cssinjs/jss/blob/4e6a05dd3f7b6572fdd3ab216861d9e446c20331/src/utils/createGenerateClassName.js
export default () => {
  let ruleCounter = 0

  return (rule, sheet) => {
    ruleCounter += 1

    if (process.env.NODE_ENV === 'production') {
      return `c${ruleCounter}`
    }

    if (sheet && sheet.options.meta) {
      let meta = sheet.options.meta
      // Sanitize the string as will be used in development to prefix the generated
      // class name.
      meta = meta.replace(new RegExp(/[!"#$%&'()*+,./:; <=>?@[\\\]^`{|}~]/g), '-')

      return `${meta}-${rule.key}-${ruleCounter}`
    }

    return `${rule.key}-${ruleCounter}`
  }
}
