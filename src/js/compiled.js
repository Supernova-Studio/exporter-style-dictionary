/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Blueprint functions
/** Format object to pretty JSON */
Pulsar.registerFunction("objectToPrettyJson", (object) => {
    return JSON.stringify(object, null, 2);
});
/** Generate style dictionary tree */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup, allTokens, allGroups) => {
    let writeRoot = {};
    // Compute full data structure of the entire type-dependent tree
    let result = representTree(rootGroup, allTokens, allGroups, writeRoot);
    // Add top level entries which don't belong to any user-defined group
    for (let token of tokensOfGroup(rootGroup, allTokens)) {
        result[safeTokenName(token)] = representToken(token, allTokens, allGroups);
    }
    // Retrieve
    return {
        [`${typeLabel(rootGroup.tokenType)}`]: result,
    };
});
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Tree construction
/** Construct tree out of one specific group, independent of tree type */
function representTree(rootGroup, allTokens, allGroups, writeObject) {
    // Represent one level of groups and tokens inside tree. Creates subobjects and then also information about each token
    for (let group of rootGroup.subgroups) {
        // Write buffer
        let writeSubObject = {};
        // Add each entry for each subgroup, and represent its tree into it
        writeObject[safeGroupName(group)] = representTree(group, allTokens, allGroups, writeSubObject);
        // Add each entry for each token, writing to the same write root
        for (let token of tokensOfGroup(group, allTokens)) {
            writeSubObject[safeTokenName(token)] = representToken(token, allTokens, allGroups);
        }
    }
    return writeObject;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Representation
/** Represent a singular token as SD object */
function representToken(token, allTokens, allGroups) {
    switch (token.tokenType) {
        case "Color":
            return representColorToken(token, allTokens, allGroups);
        case "Border":
            return representBorderToken(token, allTokens, allGroups);
        case "Font":
            return representFontToken(token, allTokens, allGroups);
        case "Gradient":
            return representGradientToken(token, allTokens, allGroups);
        case "Measure":
            return representMeasureToken(token, allTokens, allGroups);
        case "Radius":
            return representRadiusToken(token, allTokens, allGroups);
        case "Shadow":
            return representShadowToken(token, allTokens, allGroups);
        case "Text":
            return representTextToken(token, allTokens, allGroups);
        case "Typography":
            return representTypographyToken(token, allTokens, allGroups);
    }
}
/** Represent full color token, including wrapping meta-information such as user description */
function representColorToken(token, allTokens, allGroups) {
    let value = representColorTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full border token, including wrapping meta-information such as user description */
function representBorderToken(token, allTokens, allGroups) {
    let value = representBorderTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full font token, including wrapping meta-information such as user description */
function representFontToken(token, allTokens, allGroups) {
    let value = representFontTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full gradient token, including wrapping meta-information such as user description */
function representGradientToken(token, allTokens, allGroups) {
    let value = representGradientTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full measure token, including wrapping meta-information such as user description */
function representMeasureToken(token, allTokens, allGroups) {
    let value = representMeasureTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full radius token, including wrapping meta-information such as user description */
function representRadiusToken(token, allTokens, allGroups) {
    let value = representRadiusTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full shadow token, including wrapping meta-information such as user description */
function representShadowToken(token, allTokens, allGroups) {
    const layers = token.shadowLayers;
    if ((layers === null || layers === void 0 ? void 0 : layers.length) > 1) {
        // "shadow-token": { "value": [ {"color": ..}, {..
        let value = layers.reverse().map((layer) => representShadowTokenValue(layer.value, allTokens, allGroups));
        // "shadow-token": { "value": { "layer-1": { "color": ..}, "layer-2"..
        // let value = layers.reverse().reduce((acc, layer, i) => (acc[`layer-${i + 1}`] = representShadowTokenValue(layer.value, allTokens, allGroups), acc), {});
        return tokenWrapper(token, value);
    }
    let value = representShadowTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full text token, including wrapping meta-information such as user description */
function representTextToken(token, allTokens, allGroups) {
    let value = representTextTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full typography token, including wrapping meta-information such as user description */
function representTypographyToken(token, allTokens, allGroups) {
    let value = representTypographyTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Value Representation
/** Represent color token value either as reference or as plain representation */
function representColorTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = `#${value.hex}`;
    }
    return result;
}
/** Represent radius token value either as reference or as plain representation */
function representRadiusTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
    }
    return result;
}
/** Represent measure token value either as reference or as plain representation */
function representMeasureTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
    }
    return result;
}
/** Represent font token value either as reference or as plain representation */
function representFontTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
    }
    return result;
}
/** Represent text token value either as reference or as plain representation */
function representTextTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.text;
    }
    return result;
}
/** Represent typography token value either as reference or as plain representation */
function representTypographyTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
    }
    return result;
}
/** Represent border token value either as reference or as plain representation */
function representBorderTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
    }
    return result;
}
/** Represent shadow token value either as reference or as plain representation */
function representShadowTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
    }
    return result;
}
/** Represent gradient token value either as reference or as plain representation */
function representGradientTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
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
        };
        // Inject gradient stops
        let count = 0;
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
            };
            result.stops[`${count}`] = stopObject;
            count++;
        }
    }
    return result;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers
/** Retrieve wrapper to certain token (referenced by name) pointing to token value */
function referenceWrapper(reference) {
    return `{${reference}.value}`;
}
/** Retrieve token wrapper containing its metadata and value information (used as container for each defined token) */
function tokenWrapper(token, value) {
    return {
        value: value,
        type: typeLabel(token.tokenType),
        comment: token.description.length > 0 ? token.description : undefined,
    };
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming
/** Create full reference name representing token. Such name can, for example, look like: [g1].[g2].[g3].[g4].[token-name] */
function referenceName(token, allGroups) {
    // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
    let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1);
    if (occurances.length === 0) {
        throw Error("JS: Unable to find token in any of the groups");
    }
    let containingGroup = occurances[0];
    let tokenPart = safeTokenName(token);
    let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g));
    return [...groupParts, tokenPart].join(".");
}
/** Retrieve safe token name made out of normal token name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeTokenName(token) {
    return token.name.replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve safe group name made out of normal group name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeGroupName(group) {
    return group.name.replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve human-readable token type in unified fashion, used both as token type and as token master group */
function typeLabel(type) {
    switch (type) {
        case "Border":
            return "border";
        case "Color":
            return "color";
        case "Font":
            return "font";
        case "Gradient":
            return "gradient";
        case "Measure":
            return "measure";
        case "Radius":
            return "radius";
        case "Shadow":
            return "shadow";
        case "Text":
            return "text";
        case "Typography":
            return "typography";
    }
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Lookup
/** Find all tokens that belong to a certain group and retrieve them as objects */
function tokensOfGroup(containingGroup, allTokens) {
    return allTokens.filter((t) => { var _a; return containingGroup.tokenIds.indexOf(t.id) !== -1 && ((_a = t) === null || _a === void 0 ? void 0 : _a.isVirtual) !== true; });
}
/** Retrieve chain of groups up to a specified group, ordered from parent to children */
function referenceGroupChain(containingGroup) {
    let iteratedGroup = containingGroup;
    let chain = [containingGroup];
    while (iteratedGroup.parent) {
        chain.push(iteratedGroup.parent);
        iteratedGroup = iteratedGroup.parent;
    }
    return chain.reverse();
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLCtCQUErQjtBQUMzQztBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixhQUFhLFlBQVksR0FBRztBQUN4RDtBQUNBLDRCQUE0QixXQUFXLGFBQWEsYUFBYTtBQUNqRSxnRkFBZ0YsTUFBTSwyRUFBMkU7QUFDaks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsNEJBQTRCLE1BQU07QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFLFVBQVUsT0FBTztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRLCtIQUErSCxFQUFFO0FBQzdLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gQmx1ZXByaW50IGZ1bmN0aW9uc1xuLyoqIEZvcm1hdCBvYmplY3QgdG8gcHJldHR5IEpTT04gKi9cblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwib2JqZWN0VG9QcmV0dHlKc29uXCIsIChvYmplY3QpID0+IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKTtcbn0pO1xuLyoqIEdlbmVyYXRlIHN0eWxlIGRpY3Rpb25hcnkgdHJlZSAqL1xuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJnZW5lcmF0ZVN0eWxlRGljdGlvbmFyeVRyZWVcIiwgKHJvb3RHcm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpID0+IHtcbiAgICBsZXQgd3JpdGVSb290ID0ge307XG4gICAgLy8gQ29tcHV0ZSBmdWxsIGRhdGEgc3RydWN0dXJlIG9mIHRoZSBlbnRpcmUgdHlwZS1kZXBlbmRlbnQgdHJlZVxuICAgIGxldCByZXN1bHQgPSByZXByZXNlbnRUcmVlKHJvb3RHcm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlUm9vdCk7XG4gICAgLy8gQWRkIHRvcCBsZXZlbCBlbnRyaWVzIHdoaWNoIGRvbid0IGJlbG9uZyB0byBhbnkgdXNlci1kZWZpbmVkIGdyb3VwXG4gICAgZm9yIChsZXQgdG9rZW4gb2YgdG9rZW5zT2ZHcm91cChyb290R3JvdXAsIGFsbFRva2VucykpIHtcbiAgICAgICAgcmVzdWx0W3NhZmVUb2tlbk5hbWUodG9rZW4pXSA9IHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgfVxuICAgIC8vIFJldHJpZXZlXG4gICAgcmV0dXJuIHtcbiAgICAgICAgW2Ake3R5cGVMYWJlbChyb290R3JvdXAudG9rZW5UeXBlKX1gXTogcmVzdWx0LFxuICAgIH07XG59KTtcbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gVHJlZSBjb25zdHJ1Y3Rpb25cbi8qKiBDb25zdHJ1Y3QgdHJlZSBvdXQgb2Ygb25lIHNwZWNpZmljIGdyb3VwLCBpbmRlcGVuZGVudCBvZiB0cmVlIHR5cGUgKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVPYmplY3QpIHtcbiAgICAvLyBSZXByZXNlbnQgb25lIGxldmVsIG9mIGdyb3VwcyBhbmQgdG9rZW5zIGluc2lkZSB0cmVlLiBDcmVhdGVzIHN1Ym9iamVjdHMgYW5kIHRoZW4gYWxzbyBpbmZvcm1hdGlvbiBhYm91dCBlYWNoIHRva2VuXG4gICAgZm9yIChsZXQgZ3JvdXAgb2Ygcm9vdEdyb3VwLnN1Ymdyb3Vwcykge1xuICAgICAgICAvLyBXcml0ZSBidWZmZXJcbiAgICAgICAgbGV0IHdyaXRlU3ViT2JqZWN0ID0ge307XG4gICAgICAgIC8vIEFkZCBlYWNoIGVudHJ5IGZvciBlYWNoIHN1Ymdyb3VwLCBhbmQgcmVwcmVzZW50IGl0cyB0cmVlIGludG8gaXRcbiAgICAgICAgd3JpdGVPYmplY3Rbc2FmZUdyb3VwTmFtZShncm91cCldID0gcmVwcmVzZW50VHJlZShncm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlU3ViT2JqZWN0KTtcbiAgICAgICAgLy8gQWRkIGVhY2ggZW50cnkgZm9yIGVhY2ggdG9rZW4sIHdyaXRpbmcgdG8gdGhlIHNhbWUgd3JpdGUgcm9vdFxuICAgICAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnNPZkdyb3VwKGdyb3VwLCBhbGxUb2tlbnMpKSB7XG4gICAgICAgICAgICB3cml0ZVN1Yk9iamVjdFtzYWZlVG9rZW5OYW1lKHRva2VuKV0gPSByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB3cml0ZU9iamVjdDtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gVG9rZW4gUmVwcmVzZW50YXRpb25cbi8qKiBSZXByZXNlbnQgYSBzaW5ndWxhciB0b2tlbiBhcyBTRCBvYmplY3QgKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIHN3aXRjaCAodG9rZW4udG9rZW5UeXBlKSB7XG4gICAgICAgIGNhc2UgXCJDb2xvclwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkJvcmRlclwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEJvcmRlclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJGb250XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Rm9udFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEdyYWRpZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIk1lYXN1cmVcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlJhZGl1c1wiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFJhZGl1c1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRTaGFkb3dUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiVGV4dFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFRleHRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiVHlwb2dyYXBoeVwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIH1cbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBjb2xvciB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBib3JkZXIgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Qm9yZGVyVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Qm9yZGVyVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBmb250IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEZvbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRGb250VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBncmFkaWVudCB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRHcmFkaWVudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudEdyYWRpZW50VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBtZWFzdXJlIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudE1lYXN1cmVUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCByYWRpdXMgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50UmFkaXVzVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50UmFkaXVzVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBzaGFkb3cgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50U2hhZG93VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdG9rZW4uc2hhZG93TGF5ZXJzO1xuICAgIGlmICgobGF5ZXJzID09PSBudWxsIHx8IGxheWVycyA9PT0gdm9pZCAwID8gdm9pZCAwIDogbGF5ZXJzLmxlbmd0aCkgPiAxKSB7XG4gICAgICAgIC8vIFwic2hhZG93LXRva2VuXCI6IHsgXCJ2YWx1ZVwiOiBbIHtcImNvbG9yXCI6IC4ufSwgey4uXG4gICAgICAgIGxldCB2YWx1ZSA9IGxheWVycy5yZXZlcnNlKCkubWFwKChsYXllcikgPT4gcmVwcmVzZW50U2hhZG93VG9rZW5WYWx1ZShsYXllci52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpKTtcbiAgICAgICAgLy8gXCJzaGFkb3ctdG9rZW5cIjogeyBcInZhbHVlXCI6IHsgXCJsYXllci0xXCI6IHsgXCJjb2xvclwiOiAuLn0sIFwibGF5ZXItMlwiLi5cbiAgICAgICAgLy8gbGV0IHZhbHVlID0gbGF5ZXJzLnJldmVyc2UoKS5yZWR1Y2UoKGFjYywgbGF5ZXIsIGkpID0+IChhY2NbYGxheWVyLSR7aSArIDF9YF0gPSByZXByZXNlbnRTaGFkb3dUb2tlblZhbHVlKGxheWVyLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksIGFjYyksIHt9KTtcbiAgICAgICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xuICAgIH1cbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRTaGFkb3dUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHRleHQgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VGV4dFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFRleHRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHR5cG9ncmFwaHkgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBUb2tlbiBWYWx1ZSBSZXByZXNlbnRhdGlvblxuLyoqIFJlcHJlc2VudCBjb2xvciB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSBgIyR7dmFsdWUuaGV4fWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHJhZGl1cyB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRSYWRpdXNUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnJhZGl1cywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvcExlZnQ6IHZhbHVlLnRvcExlZnRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS50b3BMZWZ0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdG9wUmlnaHQ6IHZhbHVlLnRvcFJpZ2h0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUudG9wUmlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBib3R0b21MZWZ0OiB2YWx1ZS5ib3R0b21MZWZ0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuYm90dG9tTGVmdCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJvdHRvbVJpZ2h0OiB2YWx1ZS5ib3R0b21SaWdodFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmJvdHRvbVJpZ2h0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBtZWFzdXJlIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgbWVhc3VyZToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5tZWFzdXJlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuaXQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS51bml0LnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBmb250IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEZvbnRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgZmFtaWx5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuZmFtaWx5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1YmZhbWlseToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnN1YmZhbWlseSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHRleHQgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VGV4dFRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB2YWx1ZS50ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCB0eXBvZ3JhcGh5IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgZm9udDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZm9udFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRGb250VG9rZW5WYWx1ZSh2YWx1ZS5mb250LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9udFNpemU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuZm9udFNpemUsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogdmFsdWUudGV4dERlY29yYXRpb24sXG4gICAgICAgICAgICB0ZXh0Q2FzZTogdmFsdWUudGV4dENhc2UsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmxldHRlclNwYWNpbmcsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJhZ3JhcGhJbmRlbnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUucGFyYWdyYXBoSW5kZW50LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluZUhlaWdodDogdmFsdWUubGluZUhlaWdodFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmxpbmVIZWlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IGJvcmRlciB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRCb3JkZXJUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbG9yXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh2YWx1ZS5jb2xvciwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLndpZHRoLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5wb3NpdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHNoYWRvdyB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRTaGFkb3dUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbG9yXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh2YWx1ZS5jb2xvciwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUueCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUueSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhZGl1czoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5yYWRpdXMsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcHJlYWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuc3ByZWFkLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5vcGFjaXR5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgZ3JhZGllbnQgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50R3JhZGllbnRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgdG86IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudG8ueCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudG8ueSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZyb206IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuZnJvbS54LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5mcm9tLnksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudHlwZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhc3BlY3RSYXRpbzoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5hc3BlY3RSYXRpbyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wczoge30sXG4gICAgICAgIH07XG4gICAgICAgIC8vIEluamVjdCBncmFkaWVudCBzdG9wc1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBzdG9wIG9mIHZhbHVlLnN0b3BzKSB7XG4gICAgICAgICAgICBsZXQgc3RvcE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdyYWRpZW50U3RvcFwiLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc3RvcC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZShzdG9wLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXN1bHQuc3RvcHNbYCR7Y291bnR9YF0gPSBzdG9wT2JqZWN0O1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBPYmplY3Qgd3JhcHBlcnNcbi8qKiBSZXRyaWV2ZSB3cmFwcGVyIHRvIGNlcnRhaW4gdG9rZW4gKHJlZmVyZW5jZWQgYnkgbmFtZSkgcG9pbnRpbmcgdG8gdG9rZW4gdmFsdWUgKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIGB7JHtyZWZlcmVuY2V9LnZhbHVlfWA7XG59XG4vKiogUmV0cmlldmUgdG9rZW4gd3JhcHBlciBjb250YWluaW5nIGl0cyBtZXRhZGF0YSBhbmQgdmFsdWUgaW5mb3JtYXRpb24gKHVzZWQgYXMgY29udGFpbmVyIGZvciBlYWNoIGRlZmluZWQgdG9rZW4pICovXG5mdW5jdGlvbiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB0eXBlOiB0eXBlTGFiZWwodG9rZW4udG9rZW5UeXBlKSxcbiAgICAgICAgY29tbWVudDogdG9rZW4uZGVzY3JpcHRpb24ubGVuZ3RoID4gMCA/IHRva2VuLmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkLFxuICAgIH07XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIE5hbWluZ1xuLyoqIENyZWF0ZSBmdWxsIHJlZmVyZW5jZSBuYW1lIHJlcHJlc2VudGluZyB0b2tlbi4gU3VjaCBuYW1lIGNhbiwgZm9yIGV4YW1wbGUsIGxvb2sgbGlrZTogW2cxXS5bZzJdLltnM10uW2c0XS5bdG9rZW4tbmFtZV0gKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZU5hbWUodG9rZW4sIGFsbEdyb3Vwcykge1xuICAgIC8vIEZpbmQgdGhlIGdyb3VwIHRvIHdoaWNoIHRva2VuIGJlbG9uZ3MuIFRoaXMgaXMgcmVhbGx5IHN1Ym9wdGltYWwgYW5kIHNob3VsZCBiZSBzb2x2ZWQgYnkgdGhlIFNESyB0byBqdXN0IHByb3ZpZGUgdGhlIGdyb3VwIHJlZmVyZW5jZVxuICAgIGxldCBvY2N1cmFuY2VzID0gYWxsR3JvdXBzLmZpbHRlcigoZykgPT4gZy50b2tlbklkcy5pbmRleE9mKHRva2VuLmlkKSAhPT0gLTEpO1xuICAgIGlmIChvY2N1cmFuY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkpTOiBVbmFibGUgdG8gZmluZCB0b2tlbiBpbiBhbnkgb2YgdGhlIGdyb3Vwc1wiKTtcbiAgICB9XG4gICAgbGV0IGNvbnRhaW5pbmdHcm91cCA9IG9jY3VyYW5jZXNbMF07XG4gICAgbGV0IHRva2VuUGFydCA9IHNhZmVUb2tlbk5hbWUodG9rZW4pO1xuICAgIGxldCBncm91cFBhcnRzID0gcmVmZXJlbmNlR3JvdXBDaGFpbihjb250YWluaW5nR3JvdXApLm1hcCgoZykgPT4gc2FmZUdyb3VwTmFtZShnKSk7XG4gICAgcmV0dXJuIFsuLi5ncm91cFBhcnRzLCB0b2tlblBhcnRdLmpvaW4oXCIuXCIpO1xufVxuLyoqIFJldHJpZXZlIHNhZmUgdG9rZW4gbmFtZSBtYWRlIG91dCBvZiBub3JtYWwgdG9rZW4gbmFtZVxuICogVGhpcyByZXBsYWNlIHNwYWNlcyB3aXRoIGRhc2hlcywgYWxzbyBjaGFuZ2UgYW55dGhpbmcgbm9uLWFscGhhbnVtZXJpYyBjaGFyIHRvIGl0IGFzIHdlbGwuXG4gKiBGb3IgZXhhbXBsZSwgU1QmUksgSW5kdXN0cmllcyB3aWxsIGJlIGNoYW5nZWQgdG8gc3QtcmstaW5kdXN0cmllc1xuICovXG5mdW5jdGlvbiBzYWZlVG9rZW5OYW1lKHRva2VuKSB7XG4gICAgcmV0dXJuIHRva2VuLm5hbWUucmVwbGFjZSgvXFxXKy9nLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbi8qKiBSZXRyaWV2ZSBzYWZlIGdyb3VwIG5hbWUgbWFkZSBvdXQgb2Ygbm9ybWFsIGdyb3VwIG5hbWVcbiAqIFRoaXMgcmVwbGFjZSBzcGFjZXMgd2l0aCBkYXNoZXMsIGFsc28gY2hhbmdlIGFueXRoaW5nIG5vbi1hbHBoYW51bWVyaWMgY2hhciB0byBpdCBhcyB3ZWxsLlxuICogRm9yIGV4YW1wbGUsIFNUJlJLIEluZHVzdHJpZXMgd2lsbCBiZSBjaGFuZ2VkIHRvIHN0LXJrLWluZHVzdHJpZXNcbiAqL1xuZnVuY3Rpb24gc2FmZUdyb3VwTmFtZShncm91cCkge1xuICAgIHJldHVybiBncm91cC5uYW1lLnJlcGxhY2UoL1xcVysvZywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG59XG4vKiogUmV0cmlldmUgaHVtYW4tcmVhZGFibGUgdG9rZW4gdHlwZSBpbiB1bmlmaWVkIGZhc2hpb24sIHVzZWQgYm90aCBhcyB0b2tlbiB0eXBlIGFuZCBhcyB0b2tlbiBtYXN0ZXIgZ3JvdXAgKi9cbmZ1bmN0aW9uIHR5cGVMYWJlbCh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJCb3JkZXJcIjpcbiAgICAgICAgICAgIHJldHVybiBcImJvcmRlclwiO1xuICAgICAgICBjYXNlIFwiQ29sb3JcIjpcbiAgICAgICAgICAgIHJldHVybiBcImNvbG9yXCI7XG4gICAgICAgIGNhc2UgXCJGb250XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJmb250XCI7XG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZ3JhZGllbnRcIjtcbiAgICAgICAgY2FzZSBcIk1lYXN1cmVcIjpcbiAgICAgICAgICAgIHJldHVybiBcIm1lYXN1cmVcIjtcbiAgICAgICAgY2FzZSBcIlJhZGl1c1wiOlxuICAgICAgICAgICAgcmV0dXJuIFwicmFkaXVzXCI7XG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcbiAgICAgICAgICAgIHJldHVybiBcInNoYWRvd1wiO1xuICAgICAgICBjYXNlIFwiVGV4dFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xuICAgICAgICBjYXNlIFwiVHlwb2dyYXBoeVwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidHlwb2dyYXBoeVwiO1xuICAgIH1cbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gTG9va3VwXG4vKiogRmluZCBhbGwgdG9rZW5zIHRoYXQgYmVsb25nIHRvIGEgY2VydGFpbiBncm91cCBhbmQgcmV0cmlldmUgdGhlbSBhcyBvYmplY3RzICovXG5mdW5jdGlvbiB0b2tlbnNPZkdyb3VwKGNvbnRhaW5pbmdHcm91cCwgYWxsVG9rZW5zKSB7XG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIoKHQpID0+IHsgdmFyIF9hOyByZXR1cm4gY29udGFpbmluZ0dyb3VwLnRva2VuSWRzLmluZGV4T2YodC5pZCkgIT09IC0xICYmICgoX2EgPSB0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaXNWaXJ0dWFsKSAhPT0gdHJ1ZTsgfSk7XG59XG4vKiogUmV0cmlldmUgY2hhaW4gb2YgZ3JvdXBzIHVwIHRvIGEgc3BlY2lmaWVkIGdyb3VwLCBvcmRlcmVkIGZyb20gcGFyZW50IHRvIGNoaWxkcmVuICovXG5mdW5jdGlvbiByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkge1xuICAgIGxldCBpdGVyYXRlZEdyb3VwID0gY29udGFpbmluZ0dyb3VwO1xuICAgIGxldCBjaGFpbiA9IFtjb250YWluaW5nR3JvdXBdO1xuICAgIHdoaWxlIChpdGVyYXRlZEdyb3VwLnBhcmVudCkge1xuICAgICAgICBjaGFpbi5wdXNoKGl0ZXJhdGVkR3JvdXAucGFyZW50KTtcbiAgICAgICAgaXRlcmF0ZWRHcm91cCA9IGl0ZXJhdGVkR3JvdXAucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW4ucmV2ZXJzZSgpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==