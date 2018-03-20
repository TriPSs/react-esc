export const capitalize = (word) => {
  return word.replace(/^./, (letter) => letter.toUpperCase())
}

export const hasOwnProperty = (object, prop) => Object.prototype.hasOwnProperty.call(object, prop)