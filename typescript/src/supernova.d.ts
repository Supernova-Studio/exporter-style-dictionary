// Type definitions for Supernova Pulsar SDK 1.0
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// TypeScript Version: 4.2
// Supernova Pulsar SDK version: 1

declare global {

  // Main functions
  interface PulsarInterface {
    registerFunction(name: string, fn: any)
    registerTransformer(name: string, fn: any)
    registerPayload(name: string, payload: string | number | object | Array<any> | Object)
  }

  const Pulsar: PulsarInterface

  // Enums
  enum TokenType {
    color = 'Color',
    typography = 'Typography',
    radius = 'Radius',
    font = 'Font',
    measure = 'Measure',
    shadow = 'Shadow',
    border = 'Border',
    gradient = 'Gradient',
    text = 'Text'
  }

  enum SourceType {
    supernova = 'Supernova',
    figma = 'Figma'
  }

  // Data Types
  type Token = {
    id: string
    name: string
    description: string
    tokenType: TokenType
    origin: SourceOrigin
  }

  type ColorToken = Token & {
    value: {
      hex: string
      r: number
      g: number
      b: number
      a: number
      referencedToken: ColorToken | null
    }
  }

  type SourceOrigin = {
    source: SourceType
    id: string | null
    name: string | null
  }

} // declare global

export { };