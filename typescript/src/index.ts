/**
 * Format object to pretty JSON
 */
Pulsar.registerFunction("objectToPrettyJson", (object: Object) => {
  return JSON.stringify(object, null, 2);
})

/**
 * Generate style dictionary tree
 */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup: TokenGroup, allTokens: Array<Token>, allGroups: Array<TokenGroup>) => {

  let writeRoot = {}
  let result = representTree(rootGroup, allTokens, allGroups, writeRoot)
  return result
})


function representTree(rootGroup: TokenGroup, allTokens: Array<Token>, allGroups: Array<TokenGroup>, writeObject: Object): Object {

  // Represent one level of groups and tokens inside tree. Creates subobjects and then also information about each token
  for (let group of rootGroup.subgroups) {

    // Write buffer
    let writeSubObject = {}

    // Add each entry for each subgroup, and represent its tree into it
    writeObject[safeGroupName(group)] = representTree(group, allTokens, allGroups, writeSubObject)

    // Add each entry for each token, writing to the same write root
    for (let token of tokensOfGroup(group, allTokens)) {
      writeSubObject[safeTokenName(token)] = representToken(token, allTokens, allGroups)
    }
    rootGroup.tokenIds
  }

  return writeObject
}


function representToken(token: Token, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {

  switch (token.tokenType) {
    case 'Color':
      return representColorToken(token as ColorToken, allTokens, allGroups) 
  }

  throw Error(`JS: Unsupported token type ${token.tokenType}`)
}

function representColorToken(token: ColorToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {

  return {
    "value": token.value.referencedToken ? referenceWrapper(referenceName(token.value.referencedToken, allGroups)) : `#${token.value.hex}`,
    "type": "color",
    "comment": token.description.length > 0 ? token.description : undefined
  }
}

function referenceWrapper(reference: string) {
  return `{${reference}.value}`
}

function referenceName(token: Token, allGroups: Array<TokenGroup>) {

  // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
  let occurances = allGroups.filter(g => g.tokenIds.indexOf(token.id) !== -1)
  if (occurances.length === 0) {
    throw Error("JS: Unable to find token in any of the groups")
  }
  // Create full reference chain name. [g1].[g2].[g3].[g4].[token-name]
  let containingGroup = occurances[0]
  let tokenPart = safeTokenName(token)
  let groupParts = referenceGroupChain(containingGroup).map(g => safeGroupName(g))
  return [...groupParts, tokenPart].join(".")
}


function referenceGroupChain(containingGroup: TokenGroup): Array<TokenGroup> {

  let iteratedGroup = containingGroup
  let chain = [containingGroup]
  while (iteratedGroup.parent) {
    chain.push(iteratedGroup.parent)
    iteratedGroup = iteratedGroup.parent
  }

  return chain.reverse()
}


function tokensOfGroup(containingGroup: TokenGroup, allTokens: Array<Token>): Array<Token> {

  return allTokens.filter(t => containingGroup.tokenIds.indexOf(t.id) !== -1)
}


function safeTokenName(token: Token) {

  // Replace spaces with dashes, also change anything non-alphanumeric char to it as well. 
  // For example, ST&RK Industries will be changed to st-rk-industries
  return token.name.replace(/\W+/g, '-').toLowerCase()
}


function safeGroupName(group: TokenGroup) {

  // Replace spaces with dashes, also change anything non-alphanumeric char to it as well. 
  // For example, ST&RK Industries will be changed to st-rk-industries
  return group.name.replace(/\W+/g, '-').toLowerCase()
}
