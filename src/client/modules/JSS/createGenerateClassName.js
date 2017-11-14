export default () => {
  let ruleCounter = 0

  return (rule, sheet) => {
    ruleCounter += 1

    if (process.env.NODE_ENV === 'production') {
      return `c${ruleCounter}`
    }

    if (sheet && sheet.options.name) {
      let name = sheet.options.name
      // Sanitize the string as will be used in development to prefix the generated
      // class name.
      name = name.replace(new RegExp(/[!"#$%&'()*+,./:; <=>?@[\\\]^`{|}~]/g), '-')

      return `${name}-${rule.key}-${ruleCounter}`
    }

    return `${rule.key}-${ruleCounter}`
  }
}
