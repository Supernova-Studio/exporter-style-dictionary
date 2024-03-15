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

/** Represent full color token, including wrapping meta-information such as user description */
function representColorToken(token: ColorToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representColorTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full border token, including wrapping meta-information such as user description */
function representBorderToken(token: BorderToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representBorderTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full font token, including wrapping meta-information such as user description */
function representFontToken(token: FontToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representFontTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full gradient token, including wrapping meta-information such as user description */
function representGradientToken(token: GradientToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representGradientTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full measure token, including wrapping meta-information such as user description */
function representMeasureToken(token: MeasureToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representMeasureTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full radius token, including wrapping meta-information such as user description */
function representRadiusToken(token: RadiusToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representRadiusTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full shadow token, including wrapping meta-information such as user description */
function representShadowToken(token: ShadowToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  const layers: ShadowToken[] = (token as any).shadowLayers;
  if (layers?.length > 1) {
    // "shadow-token": { "value": [ {"color": ..}, {..
    let value = layers.reverse().map((layer) => representShadowTokenValue(layer.value, allTokens, allGroups))
    // "shadow-token": { "value": { "layer-1": { "color": ..}, "layer-2"..
    // let value = layers.reverse().reduce((acc, layer, i) => (acc[`layer-${i + 1}`] = representShadowTokenValue(layer.value, allTokens, allGroups), acc), {});
    return tokenWrapper(token, value)
  }
  let value = representShadowTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full text token, including wrapping meta-information such as user description */
function representTextToken(token: TextToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representTextTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

/** Represent full typography token, including wrapping meta-information such as user description */
function representTypographyToken(token: TypographyToken, allTokens: Array<Token>, allGroups: Array<TokenGroup>): Object {
  let value = representTypographyTokenValue(token.value, allTokens, allGroups)
  return tokenWrapper(token, value)
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Value Representation

/** Represent color token value either as reference or as plain representation */
function representColorTokenValue(value: ColorTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = `#${value.hex}`
  }
  return result
}

/** Represent radius token value either as reference or as plain representation */
function representRadiusTokenValue(value: RadiusTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      radius: {
        type: "measure",
        value: representMeasureTokenValue(value.radius, allTokens, allGroups),
      },
      topLeft: value.topLeft
        ? {
          type: "measure",
          value: representMeasureTokenValue(value.topLeft, allTokens, allGroups),
        }
        : undefined,
      topRight: value.topRight
        ? {
          type: "measure",
          value: representMeasureTokenValue(value.topRight, allTokens, allGroups),
        }
        : undefined,
      bottomLeft: value.bottomLeft
        ? {
          type: "measure",
          value: representMeasureTokenValue(value.bottomLeft, allTokens, allGroups),
        }
        : undefined,
      bottomRight: value.bottomRight
        ? {
          type: "measure",
          value: representMeasureTokenValue(value.bottomRight, allTokens, allGroups),
        }
        : undefined,
    }
  }
  return result
}

/** Represent measure token value either as reference or as plain representation */
function representMeasureTokenValue(value: MeasureTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      measure: {
        type: "size",
        value: value.measure,
      },
      unit: {
        type: "string",
        value: value.unit.toLowerCase(),
      },
    }
  }
  return result
}

/** Represent font token value either as reference or as plain representation */
function representFontTokenValue(value: FontTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      family: {
        type: "string",
        value: value.family,
      },
      subfamily: {
        type: "string",
        value: value.subfamily,
      },
    }
  }
  return result
}

/** Represent text token value either as reference or as plain representation */
function representTextTokenValue(value: TextTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = value.text
  }
  return result
}

/** Represent typography token value either as reference or as plain representation */
function representTypographyTokenValue(value: TypographyTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      font: {
        type: "font",
        value: representFontTokenValue(value.font, allTokens, allGroups),
      },
      fontSize: {
        type: "measure",
        value: representMeasureTokenValue(value.fontSize, allTokens, allGroups),
      },
      textDecoration: value.textDecoration,
      textCase: value.textCase,
      letterSpacing: {
        type: "measure",
        value: representMeasureTokenValue(value.letterSpacing, allTokens, allGroups),
      },
      paragraphIndent: {
        type: "measure",
        value: representMeasureTokenValue(value.paragraphIndent, allTokens, allGroups),
      },
      lineHeight: value.lineHeight
        ? {
          type: "measure",
          value: representMeasureTokenValue(value.lineHeight, allTokens, allGroups),
        }
        : undefined,
    }
  }

  return result
}

/** Represent border token value either as reference or as plain representation */
function representBorderTokenValue(value: BorderTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      color: {
        type: "color",
        value: representColorTokenValue(value.color, allTokens, allGroups),
      },
      width: {
        type: "measure",
        value: representMeasureTokenValue(value.width, allTokens, allGroups),
      },
      position: {
        type: "string",
        value: value.position,
      },
    }
  }

  return result
}

/** Represent shadow token value either as reference or as plain representation */
function representShadowTokenValue(value: ShadowTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      color: {
        type: "color",
        value: representColorTokenValue(value.color, allTokens, allGroups),
      },
      x: {
        type: "measure",
        value: representMeasureTokenValue(value.x, allTokens, allGroups),
      },
      y: {
        type: "measure",
        value: representMeasureTokenValue(value.y, allTokens, allGroups),
      },
      radius: {
        type: "measure",
        value: representMeasureTokenValue(value.radius, allTokens, allGroups),
      },
      spread: {
        type: "measure",
        value: representMeasureTokenValue(value.spread, allTokens, allGroups),
      },
      opacity: {
        type: "size",
        value: value.opacity,
      },
    }
  }

  return result
}

/** Represent gradient token value either as reference or as plain representation */
function representGradientTokenValue(value: GradientTokenValue, allTokens: Array<Token>, allGroups: Array<TokenGroup>): any {
  let result: any
  if (value.referencedToken) {
    // Forms reference
    result = referenceWrapper(referenceName(value.referencedToken, allGroups))
  } else {
    // Raw value
    result = {
      to: {
        type: "point",
        value: {
          x: {
            type: "size",
            value: value.to.x,
          },
          y: {
            type: "size",
            value: value.to.y,
          },
        },
      },
      from: {
        type: "point",
        value: {
          x: {
            type: "size",
            value: value.from.x,
          },
          y: {
            type: "size",
            value: value.from.y,
          },
        },
      },
      type: {
        type: "string",
        value: value.type,
      },
      aspectRatio: {
        type: "size",
        value: value.aspectRatio,
      },
      stops: {},
    }

    // Inject gradient stops
    let count = 0
    for (let stop of value.stops) {
      let stopObject = {
        type: "gradientStop",
        position: {
          type: "size",
          value: stop.position,
        },
        color: {
          type: "color",
          value: representColorTokenValue(stop.color, allTokens, allGroups),
        },
      }
      result.stops[`${count}`] = stopObject
      count++
    }
  }

  return result
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers

/** Retrieve wrapper to certain token (referenced by name) pointing to token value */
function referenceWrapper(reference: string) {
  return `{${reference}.value}`
}

/** Retrieve token wrapper containing its metadata and value information (used as container for each defined token) */
function tokenWrapper(token: Token, value: any) {
  return {
    value: value,
    type: typeLabel(token.tokenType),
    comment: token.description.length > 0 ? token.description : undefined,
  }
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming

/** Create full reference name representing token. Such name can, for example, look like: [g1].[g2].[g3].[g4].[token-name] */
function referenceName(token: Token, allGroups: Array<TokenGroup>) {
  // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
  let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1)
  if (occurances.length === 0) {
    throw Error("JS: Unable to find token in any of the groups")
  }
  let containingGroup = occurances[0]
  let tokenPart = safeTokenName(token)
  let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g))
  return [...groupParts, tokenPart].join(".")
}

/** Retrieve safe token name made out of normal token name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeTokenName(token: Token) {
  return token.name.replace(/\W+/g, "-").toLowerCase()
}

/** Retrieve safe group name made out of normal group name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeGroupName(group: TokenGroup) {
  return group.name.replace(/\W+/g, "-").toLowerCase()
}

/** Retrieve human-readable token type in unified fashion, used both as token type and as token master group */
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

/** Find all tokens that belong to a certain group and retrieve them as objects */
function tokensOfGroup(containingGroup: TokenGroup, allTokens: Array<Token>): Array<Token> {
  return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1 && (t as any)?.isVirtual !== true)
}

/** Retrieve chain of groups up to a specified group, ordered from parent to children */
function referenceGroupChain(containingGroup: TokenGroup): Array<TokenGroup> {
  let iteratedGroup = containingGroup
  let chain = [containingGroup]
  while (iteratedGroup.parent) {
    chain.push(iteratedGroup.parent)
    iteratedGroup = iteratedGroup.parent
  }

  return chain.reverse()
}
