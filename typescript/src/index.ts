/**
 * Format object to pretty JSON
 */
Pulsar.registerFunction("objectToPrettyJson", function (object: Object) {
  return JSON.stringify(object, null, 2);
})

/**
 * Generate style dictionary tree
 */
Pulsar.registerFunction("generateStyleDictionaryTree", function (tokens: Token[], rootGroup: TokenGroup) {

  let writeRoot = {}
  let result = representTree(rootGroup, tokens, writeRoot)
  return result
})


function representTree(rootGroup: TokenGroup, tokens: Token[], writeObject: Object): Object {

  for (let group of rootGroup.subgroups) {
    let writeSubObject = {}
    writeObject[safeGroupName(group.name)] = representTree(group, tokens, writeSubObject)
  }

  return writeObject
}


function safeGroupName(groupName: string) {

  // Replace spaces with dashes, also change anything non-alphanumeric char to it as well. 
  // For example, ST&RK Industries will be changed to st-rk-industries
  return groupName.replace(/\W+/g, '-').toLowerCase()
}
