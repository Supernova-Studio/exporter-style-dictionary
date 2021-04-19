// Type definitions for Supernova Pulsar  1.0
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// TypeScript Version: 4.2
// Supernova Pulsar  Version: 1

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
  enum TokenType {
    color = "Color",
    typography = "Typography",
    radius = "Radius",
    font = "Font",
    measure = "Measure",
    shadow = "Shadow",
    border = "Border",
    gradient = "Gradient",
    text = "Text",
  }

  enum SourceType {
    supernova = "Supernova",
    figma = "Figma",
  }

  enum TextCase {
    original = "Original",
    upper = "Upper",
    lower = "Lower",
    camel = "Camel",
  }

  enum TextDecoration {
    original = "None",
    underline = "Underline",
    strikethrough = "Strikethrough",
  }

  enum Unit {
    pixels = "Pixels",
    points = "Points",
    percent = "Percent",
    ems = "Ems",
  }

  enum BorderPosition {
    inside = "Inside",
    center = "Center",
    outside = "Outside",
  }

  enum GradientType {
    linear = "Linear",
    radial = "Radial",
    angular = "Angular",
  }

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
    value: TextTokenValue
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
