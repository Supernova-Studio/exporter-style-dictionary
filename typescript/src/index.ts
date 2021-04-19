/**
 * Base function template
 */
Pulsar.registerFunction("objectToPrettyJsonString", function (object: Object) {
  return JSON.stringify(object, null, 2);
})

/**
 * Base function template
 */
Pulsar.registerFunction("generateStyleDictionaryTree", function (allTokens: BorderToken[]) {
  return "Hello from Typescript"
})