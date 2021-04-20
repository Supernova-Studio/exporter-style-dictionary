// Type definitions for Supernova Pulsar  1.0
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// TypeScript Version: 4.2
// Supernova Pulsar  Version: 1
// Note: Only temporary now, before we publish it on defotyped || private package

declare global {
  //
  // Main functions and access points
  //
  interface PulsarInterface {
    registerFunction(name: string, fn: (...args) => any)
    registerTransformer(
      name: string,
      fn: (transformedValue: any, ...args) => any
    )
    registerPayload(
      name: string,
      payload: string | number | object | Array<any> | Object
    )
  }

  const Pulsar: PulsarInterface

  //
  // Enums
  //
  type TokenType = 'Color' | 'Typography' | 'Radius' | 'Font' | 'Measure' | 'Shadow' | 'Border' | 'Gradient' | 'Text'
  
  type SourceType = 'Supernova' | 'Figma'

  type TextCase = 'Original' | 'Upper' | 'Lower' | 'Camel'

  type TextDecoration = 'None' | 'Underline' | 'Strikethrough'

  type Unit = 'Pixels' | 'Points' | 'Percent' | 'Ems'

  type BorderPosition = 'Inside' | 'Center' | 'Outside'

  type GradientType = 'Linear' | 'Radial' | 'Angular'

  //
  // Data Types
  // Subcategory: Design Token Shells
  //
  type Token = TokenValue & {}

  type ColorToken = Token & {
    value: ColorTokenValue
  }

  type TypographyToken = Token & {
    value: TypographyTokenValue
  }

  type RadiusToken = Token & {
    value: RadiusTokenValue
  }

  type ShadowToken = Token & {
    value: ShadowTokenValue
  }

  type MeasureToken = Token & {
    value: MeasureTokenValue
  }

  type BorderToken = Token & {
    value: BorderTokenValue
  }

  type GradientToken = Token & {
    value: GradientTokenValue
  }

  type TextToken = Token & {
    value: TextTokenValue
  }

  type FontToken = Token & {
    value: FontTokenValue
  }

  //
  // Data Types
  // Subcategory: Design Token Values
  //

  type TokenValue = {
    id: string
    name: string
    description: string
    tokenType: TokenType
    origin: SourceOrigin | null
  }

  type ColorTokenValue = {
    hex: string
    r: number
    g: number
    b: number
    a: number
    referencedToken: ColorToken | null
  }

  type TypographyTokenValue = {
    font: FontTokenValue
    fontSize: MeasureTokenValue
    textDecoration: TextDecoration
    textCase: TextCase
    letterSpacing: MeasureTokenValue
    lineHeight: MeasureTokenValue | null
    paragraphIndent: MeasureTokenValue
    referencedToken: TypographyToken | null
  }

  type RadiusTokenValue = {
    radius: MeasureTokenValue
    topLeft: MeasureTokenValue | null
    topRight: MeasureTokenValue | null
    bottomLeft: MeasureTokenValue | null
    bottomRight: MeasureTokenValue | null
    referencedToken: RadiusToken | null
  }

  type ShadowTokenValue = {
    color: ColorTokenValue
    x: MeasureTokenValue
    y: MeasureTokenValue
    radius: MeasureTokenValue
    spread: MeasureTokenValue
    opacity: number
    referencedToken: ShadowToken | null
  }

  type MeasureTokenValue = {
    unit: Unit
    measure: number
    referencedToken: MeasureToken | null
  }

  type FontTokenValue = {
    family: string
    subfamily: string
    referencedToken: FontToken | null
  }

  type BorderTokenValue = {
    color: ColorTokenValue
    width: MeasureTokenValue
    position: BorderPosition
    referencedToken: BorderToken | null
  }

  type GradientTokenValue = {
    to: {
      x: number
      y: number
    }
    from: {
      x: number
      y: number
    }
    type: GradientType
    aspectRatio: number
    stops: Array<GradientStopValue>
    referencedToken: GradientToken | null
  }

  type GradientStopValue = {
    position: number
    color: ColorTokenValue
  }

  type TextTokenValue = {
    text: string
    referencedToken: TextToken
  }

  //
  // Data Types
  // Subcategory: Groups
  //
  type TokenGroup = {
    id: string
    name: string
    description: string
    path: Array<string>
    subgroups: Array<TokenGroup>
    tokenType: TokenType
    isRoot: boolean
    childrenIds: Array<string>
    tokenIds: Array<string>
    parent: TokenGroup | null
  }

  //
  // Data Types
  // Subcategory: System
  //

  type Workspace = {
    id: string
    handle: string
    name: string
    color: string
  }

  type DesignSystem = {
    id: string
    workspaceId: string
    name: string
    description: string
    isPublic: boolean
  }

  type DesignSystemVersion = {
    id: string
    designSystemId: string
    name: string
    description: string
    version: string
    changeLog: string | null
    isReadOnly: boolean
  }

  //
  // Data Types
  // Subcategory: Support
  //

  type SourceOrigin = {
    source: SourceType
    id: string | null
    name: string | null
  }
} // declare global

export {}
