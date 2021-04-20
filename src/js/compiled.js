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
    return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLCtCQUErQjtBQUMzQztBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSw0QkFBNEIsTUFBTTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEVBQUUsVUFBVSxPQUFPO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIvLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIEJsdWVwcmludCBmdW5jdGlvbnNcbi8qKiBGb3JtYXQgb2JqZWN0IHRvIHByZXR0eSBKU09OICovXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcIm9iamVjdFRvUHJldHR5SnNvblwiLCAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMik7XG59KTtcbi8qKiBHZW5lcmF0ZSBzdHlsZSBkaWN0aW9uYXJ5IHRyZWUgKi9cblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwiZ2VuZXJhdGVTdHlsZURpY3Rpb25hcnlUcmVlXCIsIChyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzKSA9PiB7XG4gICAgbGV0IHdyaXRlUm9vdCA9IHt9O1xuICAgIC8vIENvbXB1dGUgZnVsbCBkYXRhIHN0cnVjdHVyZSBvZiB0aGUgZW50aXJlIHR5cGUtZGVwZW5kZW50IHRyZWVcbiAgICBsZXQgcmVzdWx0ID0gcmVwcmVzZW50VHJlZShyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZVJvb3QpO1xuICAgIC8vIEFkZCB0b3AgbGV2ZWwgZW50cmllcyB3aGljaCBkb24ndCBiZWxvbmcgdG8gYW55IHVzZXItZGVmaW5lZCBncm91cFxuICAgIGZvciAobGV0IHRva2VuIG9mIHRva2Vuc09mR3JvdXAocm9vdEdyb3VwLCBhbGxUb2tlbnMpKSB7XG4gICAgICAgIHJlc3VsdFtzYWZlVG9rZW5OYW1lKHRva2VuKV0gPSByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIH1cbiAgICAvLyBSZXRyaWV2ZVxuICAgIHJldHVybiB7XG4gICAgICAgIFtgJHt0eXBlTGFiZWwocm9vdEdyb3VwLnRva2VuVHlwZSl9YF06IHJlc3VsdCxcbiAgICB9O1xufSk7XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIFRyZWUgY29uc3RydWN0aW9uXG4vKiogQ29uc3RydWN0IHRyZWUgb3V0IG9mIG9uZSBzcGVjaWZpYyBncm91cCwgaW5kZXBlbmRlbnQgb2YgdHJlZSB0eXBlICovXG5mdW5jdGlvbiByZXByZXNlbnRUcmVlKHJvb3RHcm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlT2JqZWN0KSB7XG4gICAgLy8gUmVwcmVzZW50IG9uZSBsZXZlbCBvZiBncm91cHMgYW5kIHRva2VucyBpbnNpZGUgdHJlZS4gQ3JlYXRlcyBzdWJvYmplY3RzIGFuZCB0aGVuIGFsc28gaW5mb3JtYXRpb24gYWJvdXQgZWFjaCB0b2tlblxuICAgIGZvciAobGV0IGdyb3VwIG9mIHJvb3RHcm91cC5zdWJncm91cHMpIHtcbiAgICAgICAgLy8gV3JpdGUgYnVmZmVyXG4gICAgICAgIGxldCB3cml0ZVN1Yk9iamVjdCA9IHt9O1xuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCBzdWJncm91cCwgYW5kIHJlcHJlc2VudCBpdHMgdHJlZSBpbnRvIGl0XG4gICAgICAgIHdyaXRlT2JqZWN0W3NhZmVHcm91cE5hbWUoZ3JvdXApXSA9IHJlcHJlc2VudFRyZWUoZ3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZVN1Yk9iamVjdCk7XG4gICAgICAgIC8vIEFkZCBlYWNoIGVudHJ5IGZvciBlYWNoIHRva2VuLCB3cml0aW5nIHRvIHRoZSBzYW1lIHdyaXRlIHJvb3RcbiAgICAgICAgZm9yIChsZXQgdG9rZW4gb2YgdG9rZW5zT2ZHcm91cChncm91cCwgYWxsVG9rZW5zKSkge1xuICAgICAgICAgICAgd3JpdGVTdWJPYmplY3Rbc2FmZVRva2VuTmFtZSh0b2tlbildID0gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gd3JpdGVPYmplY3Q7XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIFRva2VuIFJlcHJlc2VudGF0aW9uXG4vKiogUmVwcmVzZW50IGEgc2luZ3VsYXIgdG9rZW4gYXMgU0Qgb2JqZWN0ICovXG5mdW5jdGlvbiByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBzd2l0Y2ggKHRva2VuLnRva2VuVHlwZSkge1xuICAgICAgICBjYXNlIFwiQ29sb3JcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRDb2xvclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJCb3JkZXJcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRCb3JkZXJUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiRm9udFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEZvbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiR3JhZGllbnRcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRHcmFkaWVudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJNZWFzdXJlXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50TWVhc3VyZVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJSYWRpdXNcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRSYWRpdXNUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiU2hhZG93XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50U2hhZG93VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlRleHRcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRUZXh0VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlR5cG9ncmFwaHlcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRUeXBvZ3JhcGh5VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICB9XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgY29sb3IgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Q29sb3JUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRDb2xvclRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgYm9yZGVyIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEJvcmRlclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudEJvcmRlclRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgZm9udCB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRGb250VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Rm9udFRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgZ3JhZGllbnQgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50R3JhZGllbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRHcmFkaWVudFRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgbWVhc3VyZSB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgcmFkaXVzIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFJhZGl1c1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFJhZGl1c1Rva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgc2hhZG93IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFNoYWRvd1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgdGV4dCB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUZXh0VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50VGV4dFRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgdHlwb2dyYXBoeSB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUeXBvZ3JhcGh5VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIFRva2VuIFZhbHVlIFJlcHJlc2VudGF0aW9uXG4vKiogUmVwcmVzZW50IGNvbG9yIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IGAjJHt2YWx1ZS5oZXh9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgcmFkaXVzIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFJhZGl1c1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUucmFkaXVzLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9wTGVmdDogdmFsdWUudG9wTGVmdFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnRvcExlZnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0b3BSaWdodDogdmFsdWUudG9wUmlnaHRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS50b3BSaWdodCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJvdHRvbUxlZnQ6IHZhbHVlLmJvdHRvbUxlZnRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5ib3R0b21MZWZ0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYm90dG9tUmlnaHQ6IHZhbHVlLmJvdHRvbVJpZ2h0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuYm90dG9tUmlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IG1lYXN1cmUgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBtZWFzdXJlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLm1lYXN1cmUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5pdDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IGZvbnQgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Rm9udFRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBmYW1pbHk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5mYW1pbHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3ViZmFtaWx5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuc3ViZmFtaWx5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgdGV4dCB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUZXh0VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHZhbHVlLnRleHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHR5cG9ncmFwaHkgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJmb250XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudEZvbnRUb2tlblZhbHVlKHZhbHVlLmZvbnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb250U2l6ZToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5mb250U2l6ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiB2YWx1ZS50ZXh0RGVjb3JhdGlvbixcbiAgICAgICAgICAgIHRleHRDYXNlOiB2YWx1ZS50ZXh0Q2FzZSxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUubGV0dGVyU3BhY2luZywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFncmFwaEluZGVudDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5wYXJhZ3JhcGhJbmRlbnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiB2YWx1ZS5saW5lSGVpZ2h0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUubGluZUhlaWdodCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgYm9yZGVyIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEJvcmRlclRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2lkdGg6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUud2lkdGgsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnBvc2l0aW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgc2hhZG93IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS54LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS55LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnJhZGl1cywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwcmVhZDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5zcHJlYWQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLm9wYWNpdHksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBncmFkaWVudCB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRHcmFkaWVudFRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICB0bzoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50by54LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50by55LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnJvbToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5mcm9tLngsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmZyb20ueSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50eXBlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmFzcGVjdFJhdGlvLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3BzOiB7fSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gSW5qZWN0IGdyYWRpZW50IHN0b3BzXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IHN0b3Agb2YgdmFsdWUuc3RvcHMpIHtcbiAgICAgICAgICAgIGxldCBzdG9wT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ3JhZGllbnRTdG9wXCIsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzdG9wLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHN0b3AuY29sb3IsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc3VsdC5zdG9wc1tgJHtjb3VudH1gXSA9IHN0b3BPYmplY3Q7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIE9iamVjdCB3cmFwcGVyc1xuLyoqIFJldHJpZXZlIHdyYXBwZXIgdG8gY2VydGFpbiB0b2tlbiAocmVmZXJlbmNlZCBieSBuYW1lKSBwb2ludGluZyB0byB0b2tlbiB2YWx1ZSAqL1xuZnVuY3Rpb24gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gYHske3JlZmVyZW5jZX0udmFsdWV9YDtcbn1cbi8qKiBSZXRyaWV2ZSB0b2tlbiB3cmFwcGVyIGNvbnRhaW5pbmcgaXRzIG1ldGFkYXRhIGFuZCB2YWx1ZSBpbmZvcm1hdGlvbiAodXNlZCBhcyBjb250YWluZXIgZm9yIGVhY2ggZGVmaW5lZCB0b2tlbikgKi9cbmZ1bmN0aW9uIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHR5cGU6IHR5cGVMYWJlbCh0b2tlbi50b2tlblR5cGUpLFxuICAgICAgICBjb21tZW50OiB0b2tlbi5kZXNjcmlwdGlvbi5sZW5ndGggPiAwID8gdG9rZW4uZGVzY3JpcHRpb24gOiB1bmRlZmluZWQsXG4gICAgfTtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gTmFtaW5nXG4vKiogQ3JlYXRlIGZ1bGwgcmVmZXJlbmNlIG5hbWUgcmVwcmVzZW50aW5nIHRva2VuLiBTdWNoIG5hbWUgY2FuLCBmb3IgZXhhbXBsZSwgbG9vayBsaWtlOiBbZzFdLltnMl0uW2czXS5bZzRdLlt0b2tlbi1uYW1lXSAqL1xuZnVuY3Rpb24gcmVmZXJlbmNlTmFtZSh0b2tlbiwgYWxsR3JvdXBzKSB7XG4gICAgLy8gRmluZCB0aGUgZ3JvdXAgdG8gd2hpY2ggdG9rZW4gYmVsb25ncy4gVGhpcyBpcyByZWFsbHkgc3Vib3B0aW1hbCBhbmQgc2hvdWxkIGJlIHNvbHZlZCBieSB0aGUgU0RLIHRvIGp1c3QgcHJvdmlkZSB0aGUgZ3JvdXAgcmVmZXJlbmNlXG4gICAgbGV0IG9jY3VyYW5jZXMgPSBhbGxHcm91cHMuZmlsdGVyKChnKSA9PiBnLnRva2VuSWRzLmluZGV4T2YodG9rZW4uaWQpICE9PSAtMSk7XG4gICAgaWYgKG9jY3VyYW5jZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiSlM6IFVuYWJsZSB0byBmaW5kIHRva2VuIGluIGFueSBvZiB0aGUgZ3JvdXBzXCIpO1xuICAgIH1cbiAgICBsZXQgY29udGFpbmluZ0dyb3VwID0gb2NjdXJhbmNlc1swXTtcbiAgICBsZXQgdG9rZW5QYXJ0ID0gc2FmZVRva2VuTmFtZSh0b2tlbik7XG4gICAgbGV0IGdyb3VwUGFydHMgPSByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkubWFwKChnKSA9PiBzYWZlR3JvdXBOYW1lKGcpKTtcbiAgICByZXR1cm4gWy4uLmdyb3VwUGFydHMsIHRva2VuUGFydF0uam9pbihcIi5cIik7XG59XG4vKiogUmV0cmlldmUgc2FmZSB0b2tlbiBuYW1lIG1hZGUgb3V0IG9mIG5vcm1hbCB0b2tlbiBuYW1lXG4gKiBUaGlzIHJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC5cbiAqIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXG4gKi9cbmZ1bmN0aW9uIHNhZmVUb2tlbk5hbWUodG9rZW4pIHtcbiAgICByZXR1cm4gdG9rZW4ubmFtZS5yZXBsYWNlKC9cXFcrL2csIFwiLVwiKS50b0xvd2VyQ2FzZSgpO1xufVxuLyoqIFJldHJpZXZlIHNhZmUgZ3JvdXAgbmFtZSBtYWRlIG91dCBvZiBub3JtYWwgZ3JvdXAgbmFtZVxuICogVGhpcyByZXBsYWNlIHNwYWNlcyB3aXRoIGRhc2hlcywgYWxzbyBjaGFuZ2UgYW55dGhpbmcgbm9uLWFscGhhbnVtZXJpYyBjaGFyIHRvIGl0IGFzIHdlbGwuXG4gKiBGb3IgZXhhbXBsZSwgU1QmUksgSW5kdXN0cmllcyB3aWxsIGJlIGNoYW5nZWQgdG8gc3QtcmstaW5kdXN0cmllc1xuICovXG5mdW5jdGlvbiBzYWZlR3JvdXBOYW1lKGdyb3VwKSB7XG4gICAgcmV0dXJuIGdyb3VwLm5hbWUucmVwbGFjZSgvXFxXKy9nLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbi8qKiBSZXRyaWV2ZSBodW1hbi1yZWFkYWJsZSB0b2tlbiB0eXBlIGluIHVuaWZpZWQgZmFzaGlvbiwgdXNlZCBib3RoIGFzIHRva2VuIHR5cGUgYW5kIGFzIHRva2VuIG1hc3RlciBncm91cCAqL1xuZnVuY3Rpb24gdHlwZUxhYmVsKHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcIkJvcmRlclwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiYm9yZGVyXCI7XG4gICAgICAgIGNhc2UgXCJDb2xvclwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiY29sb3JcIjtcbiAgICAgICAgY2FzZSBcIkZvbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBcImZvbnRcIjtcbiAgICAgICAgY2FzZSBcIkdyYWRpZW50XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJncmFkaWVudFwiO1xuICAgICAgICBjYXNlIFwiTWVhc3VyZVwiOlxuICAgICAgICAgICAgcmV0dXJuIFwibWVhc3VyZVwiO1xuICAgICAgICBjYXNlIFwiUmFkaXVzXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpdXNcIjtcbiAgICAgICAgY2FzZSBcIlNoYWRvd1wiOlxuICAgICAgICAgICAgcmV0dXJuIFwic2hhZG93XCI7XG4gICAgICAgIGNhc2UgXCJUZXh0XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJ0ZXh0XCI7XG4gICAgICAgIGNhc2UgXCJUeXBvZ3JhcGh5XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJ0eXBvZ3JhcGh5XCI7XG4gICAgfVxufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBMb29rdXBcbi8qKiBGaW5kIGFsbCB0b2tlbnMgdGhhdCBiZWxvbmcgdG8gYSBjZXJ0YWluIGdyb3VwIGFuZCByZXRyaWV2ZSB0aGVtIGFzIG9iamVjdHMgKi9cbmZ1bmN0aW9uIHRva2Vuc09mR3JvdXAoY29udGFpbmluZ0dyb3VwLCBhbGxUb2tlbnMpIHtcbiAgICByZXR1cm4gYWxsVG9rZW5zLmZpbHRlcigodCkgPT4gY29udGFpbmluZ0dyb3VwLnRva2VuSWRzLmluZGV4T2YodC5pZCkgIT09IC0xKTtcbn1cbi8qKiBSZXRyaWV2ZSBjaGFpbiBvZiBncm91cHMgdXAgdG8gYSBzcGVjaWZpZWQgZ3JvdXAsIG9yZGVyZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4gKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZUdyb3VwQ2hhaW4oY29udGFpbmluZ0dyb3VwKSB7XG4gICAgbGV0IGl0ZXJhdGVkR3JvdXAgPSBjb250YWluaW5nR3JvdXA7XG4gICAgbGV0IGNoYWluID0gW2NvbnRhaW5pbmdHcm91cF07XG4gICAgd2hpbGUgKGl0ZXJhdGVkR3JvdXAucGFyZW50KSB7XG4gICAgICAgIGNoYWluLnB1c2goaXRlcmF0ZWRHcm91cC5wYXJlbnQpO1xuICAgICAgICBpdGVyYXRlZEdyb3VwID0gaXRlcmF0ZWRHcm91cC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBjaGFpbi5yZXZlcnNlKCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9