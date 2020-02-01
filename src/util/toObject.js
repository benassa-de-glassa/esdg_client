function arraysToObject (keyArray, valueArray) {
  // assumes to arrays of equal length
  // maps each item in the value array to the item in the keyarray of the same index
  var obj = {}
  for (let index = 0; index < keyArray.length; index++) {
    const elementKeyArray = keyArray[index]
    obj[elementKeyArray] = valueArray[index]
  }
  return obj
}

function addLabelAndValueKeysToObject(object) {
  // takes an object like: {key: value} and returns an object which looks like {value: value, key: key}
  var obj = {}
  for (const [key, value] of Object.entries(object)) {
    obj['key'] = key
    obj['value'] = value
  }
  return obj
}

function removeLabelAndValueKeysFromObject(object) {
  var obj = {}
  obj[object.key] = obj[object.value]
  return obj
}

export { arraysToObject, addLabelAndValueKeysToObject, removeLabelAndValueKeysFromObject}
