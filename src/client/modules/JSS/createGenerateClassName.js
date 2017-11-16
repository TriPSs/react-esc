const isProduction = process.env.NODE_ENV === 'production'

export default () => {
  let ruleCounter = 0

  return (rule, sheet) => {
    ruleCounter += 1

    if (isProduction) {
      const firstChar = rule.key.charAt(0).toLowerCase()

      return `c${firstChar}${ruleCounter}`
    }

    if (sheet && sheet.options.name) {
      let name = sheet.options.name
      // Sanitize the string as will be used in development to prefix the generated class name.
      name = name.replace(new RegExp(/[!"#$%&'()*+,./:; <=>?@[\\\]^`{|}~]/g), '-')

      return `${name}-${rule.key}-${ruleCounter}`
    }

    return `${rule.key}-${ruleCounter}`
  }
}
