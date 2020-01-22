function arraysToObject (keyArray, valueArray) {
  var obj = {}
  for (let index = 0; index < keyArray.length; index++) {
    const elementKeyArray = keyArray[index]
    obj[elementKeyArray] = valueArray[index]
  }
  return obj
}

export { arraysToObject }
