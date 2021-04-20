// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Blueprint functions

/** Format object to pretty JSON */
Pulsar.registerFunction("objectToPrettyJson", (object: Object) => {
  return JSON.stringify(object, null, 2)
})

/** Generate style dictionary tree */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup: TokenGroup, allTokens: Array<Token>, allGroups: Array<TokenGroup>) => {
  let writeRoot = {}
  // Compute full data structure of the entire type-dependent tree
  let result = representTree(rootGroup, allTokens, allGroups, writeRoot)

  // Add top level entries which don't belong to any user-defined group
  for (let token of tokensOfGroup(rootGroup, allTokens)) {
    result[safeTokenName(token)] = representToken(token, allTokens, allGroups)
  }

  // Retrieve
  return {
    [`${typeLabel(rootGroup.tokenType)}`]: result,
  }
})

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Tree construction

/** Construct tree out of one specific group, independent of tree type */
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
  }

  return writeObject
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Representation

/** Represent a singular token as SD object */
function representToken(token: Token, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  switch (token.tokenType) {
    case "Color":
      return representColorToken(token as ColorToken, allTokens, allGroups)
    case "Border":
      return representBorderToken(token as BorderToken, allTokens, allGroups)
    case "Font":
      return representFontToken(token as FontToken, allTokens, allGroups)
    case "Gradient":
      return representGradientToken(token as GradientToken, allTokens, allGroups)
    case "Measure":
      return representMeasureToken(token as MeasureToken, allTokens, allGroups)
    case "Radius":
      return representRadiusToken(token as RadiusToken, allTokens, allGroups)
    case "Shadow":
      return representShadowToken(token as ShadowToken, allTokens, allGroups)
    case "Text":
      return representTextToken(token as TextToken, allTokens, allGroups)
    case "Typography":
      return representTypographyToken(token as TypographyToken, allTokens, allGroups)
  }
}

function representColorToken(token: ColorToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value: any
  if (token.value.referencedToken) {
    // Forms reference
    value = referenceWrapper(referenceName(token.value.referencedToken, allGroups))
  } else {
    // Raw value
    value = `#${token.value.hex}`
  }
  return tokenWrapper(token, value)
}

function representBorderToken(token: BorderToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  // TODO: Border value
  let value = ""
  return tokenWrapper(token, value)
}

function representFontToken(token: FontToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value: any
  if (token.value.referencedToken) {
    // Forms reference
    value = referenceWrapper(referenceName(token.value.referencedToken, allGroups))
  } else {
    // Raw value
    value = {
      family: {
        type: "string",
        value: token.value.family,
      },
      subfamily: {
        type: "string",
        value: token.value.subfamily,
      },
    }
  }
  return tokenWrapper(token, value)
}

function representGradientToken(token: GradientToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  // TODO: Gradient value
  let value = {}
  return tokenWrapper(token, value)
}

function representMeasureToken(token: MeasureToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value: any
  if (token.value.referencedToken) {
    // Forms reference
    value = referenceWrapper(referenceName(token.value.referencedToken, allGroups))
  } else {
    // Raw value
    value = {
      measure: {
        type: "size",
        value: token.value.measure,
      },
      unit: {
        type: "string",
        value: token.value.unit.toLowerCase(),
      },
    }
  }
  return tokenWrapper(token, value)
}

function representRadiusToken(token: RadiusToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  // TODO: Radius value
  let value = ""
  return tokenWrapper(token, value)
}

function representShadowToken(token: ShadowToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  // TODO: Shadow value
  let value = ""
  return tokenWrapper(token, value)
}

function representTextToken(token: TextToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  // TODO: Text value
  let value = ""
  return tokenWrapper(token, value)
}

function representTypographyToken(token: TypographyToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  // TODO: Typography value
  let value = ""
  return tokenWrapper(token, value)
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers

function referenceWrapper(reference: string) {
  return `{${reference}.value}`
}

function tokenWrapper(token: Token, value: any) {
  return {
    value: value,
    type: typeLabel(token.tokenType),
    comment: token.description.length > 0 ? token.description : undefined,
  }
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming

function referenceName(token: Token, allGroups: Array<TokenGroup>) {
  // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
  let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1)
  if (occurances.length === 0) {
    throw Error("JS: Unable to find token in any of the groups")
  }
  // Create full reference chain name. [g1].[g2].[g3].[g4].[token-name]
  let containingGroup = occurances[0]
  let tokenPart = safeTokenName(token)
  let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g))
  return [...groupParts, tokenPart].join(".")
}

function safeTokenName(token: Token) {
  // Replace spaces with dashes, also change anything non-alphanumeric char to it as well.
  // For example, ST&RK Industries will be changed to st-rk-industries
  return token.name.replace(/\W+/g, "-").toLowerCase()
}

function safeGroupName(group: TokenGroup) {
  // Replace spaces with dashes, also change anything non-alphanumeric char to it as well.
  // For example, ST&RK Industries will be changed to st-rk-industries
  return group.name.replace(/\W+/g, "-").toLowerCase()
}

function typeLabel(type: TokenType) {
  switch (type) {
    case "Border":
      return "border"
    case "Color":
      return "color"
    case "Font":
      return "font"
    case "Gradient":
      return "gradient"
    case "Measure":
      return "measure"
    case "Radius":
      return "radius"
    case "Shadow":
      return "shadow"
    case "Text":
      return "text"
    case "Typography":
      return "typography"
  }
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Lookup

function tokensOfGroup(containingGroup: TokenGroup, allTokens: Array<Token>): Array<Token> {
  return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1)
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
