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
    result = unwrapMeasureTokens(result);
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
function unwrapMeasureTokens(result) {
    var _a;
    const groupNames = [
        "dimension",
        "opacity",
        "size",
        "space",
        "font-size",
        "line-height",
        "letter-spacing",
        "paragraph-spacing",
        "border-width",
        "border-radius",
        "duration",
        "z-index"
    ];
    for (const groupName of groupNames) {
        const group = (_a = result[groupName]) === null || _a === void 0 ? void 0 : _a[groupName];
        if (group && !(group === null || group === void 0 ? void 0 : group.type)) {
            result[groupName] = group;
        }
    }
    return result;
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
    const isVirtualShadow = (t) => { var _a; return ((_a = t) === null || _a === void 0 ? void 0 : _a.isVirtual) === true && t.tokenType === 'Shadow'; };
    return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1 && !isVirtualShadow(t));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksK0JBQStCO0FBQzNDO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGFBQWEsWUFBWSxHQUFHO0FBQ3hEO0FBQ0EsNEJBQTRCLFdBQVcsYUFBYSxhQUFhO0FBQ2pFLGdGQUFnRixNQUFNLDJFQUEyRTtBQUNqSztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSw0QkFBNEIsTUFBTTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEVBQUUsVUFBVSxPQUFPO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFFBQVEsMEdBQTBHO0FBQ3RKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBCbHVlcHJpbnQgZnVuY3Rpb25zXG4vKiogRm9ybWF0IG9iamVjdCB0byBwcmV0dHkgSlNPTiAqL1xuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJvYmplY3RUb1ByZXR0eUpzb25cIiwgKG9iamVjdCkgPT4ge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpO1xufSk7XG4vKiogR2VuZXJhdGUgc3R5bGUgZGljdGlvbmFyeSB0cmVlICovXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcImdlbmVyYXRlU3R5bGVEaWN0aW9uYXJ5VHJlZVwiLCAocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3VwcykgPT4ge1xuICAgIGxldCB3cml0ZVJvb3QgPSB7fTtcbiAgICAvLyBDb21wdXRlIGZ1bGwgZGF0YSBzdHJ1Y3R1cmUgb2YgdGhlIGVudGlyZSB0eXBlLWRlcGVuZGVudCB0cmVlXG4gICAgbGV0IHJlc3VsdCA9IHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVSb290KTtcbiAgICAvLyBBZGQgdG9wIGxldmVsIGVudHJpZXMgd2hpY2ggZG9uJ3QgYmVsb25nIHRvIGFueSB1c2VyLWRlZmluZWQgZ3JvdXBcbiAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnNPZkdyb3VwKHJvb3RHcm91cCwgYWxsVG9rZW5zKSkge1xuICAgICAgICByZXN1bHRbc2FmZVRva2VuTmFtZSh0b2tlbildID0gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICB9XG4gICAgcmVzdWx0ID0gdW53cmFwTWVhc3VyZVRva2VucyhyZXN1bHQpO1xuICAgIC8vIFJldHJpZXZlXG4gICAgcmV0dXJuIHtcbiAgICAgICAgW2Ake3R5cGVMYWJlbChyb290R3JvdXAudG9rZW5UeXBlKX1gXTogcmVzdWx0LFxuICAgIH07XG59KTtcbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gVHJlZSBjb25zdHJ1Y3Rpb25cbi8qKiBDb25zdHJ1Y3QgdHJlZSBvdXQgb2Ygb25lIHNwZWNpZmljIGdyb3VwLCBpbmRlcGVuZGVudCBvZiB0cmVlIHR5cGUgKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVPYmplY3QpIHtcbiAgICAvLyBSZXByZXNlbnQgb25lIGxldmVsIG9mIGdyb3VwcyBhbmQgdG9rZW5zIGluc2lkZSB0cmVlLiBDcmVhdGVzIHN1Ym9iamVjdHMgYW5kIHRoZW4gYWxzbyBpbmZvcm1hdGlvbiBhYm91dCBlYWNoIHRva2VuXG4gICAgZm9yIChsZXQgZ3JvdXAgb2Ygcm9vdEdyb3VwLnN1Ymdyb3Vwcykge1xuICAgICAgICAvLyBXcml0ZSBidWZmZXJcbiAgICAgICAgbGV0IHdyaXRlU3ViT2JqZWN0ID0ge307XG4gICAgICAgIC8vIEFkZCBlYWNoIGVudHJ5IGZvciBlYWNoIHN1Ymdyb3VwLCBhbmQgcmVwcmVzZW50IGl0cyB0cmVlIGludG8gaXRcbiAgICAgICAgd3JpdGVPYmplY3Rbc2FmZUdyb3VwTmFtZShncm91cCldID0gcmVwcmVzZW50VHJlZShncm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlU3ViT2JqZWN0KTtcbiAgICAgICAgLy8gQWRkIGVhY2ggZW50cnkgZm9yIGVhY2ggdG9rZW4sIHdyaXRpbmcgdG8gdGhlIHNhbWUgd3JpdGUgcm9vdFxuICAgICAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnNPZkdyb3VwKGdyb3VwLCBhbGxUb2tlbnMpKSB7XG4gICAgICAgICAgICB3cml0ZVN1Yk9iamVjdFtzYWZlVG9rZW5OYW1lKHRva2VuKV0gPSByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB3cml0ZU9iamVjdDtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gVG9rZW4gUmVwcmVzZW50YXRpb25cbi8qKiBSZXByZXNlbnQgYSBzaW5ndWxhciB0b2tlbiBhcyBTRCBvYmplY3QgKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIHN3aXRjaCAodG9rZW4udG9rZW5UeXBlKSB7XG4gICAgICAgIGNhc2UgXCJDb2xvclwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkJvcmRlclwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEJvcmRlclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJGb250XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Rm9udFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEdyYWRpZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIk1lYXN1cmVcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlJhZGl1c1wiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFJhZGl1c1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRTaGFkb3dUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiVGV4dFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFRleHRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiVHlwb2dyYXBoeVwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIH1cbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBjb2xvciB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBib3JkZXIgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Qm9yZGVyVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Qm9yZGVyVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBmb250IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEZvbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRGb250VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCBncmFkaWVudCB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRHcmFkaWVudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudEdyYWRpZW50VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHVud3JhcE1lYXN1cmVUb2tlbnMocmVzdWx0KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGdyb3VwTmFtZXMgPSBbXG4gICAgICAgIFwiZGltZW5zaW9uXCIsXG4gICAgICAgIFwib3BhY2l0eVwiLFxuICAgICAgICBcInNpemVcIixcbiAgICAgICAgXCJzcGFjZVwiLFxuICAgICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICAgIFwibGV0dGVyLXNwYWNpbmdcIixcbiAgICAgICAgXCJwYXJhZ3JhcGgtc3BhY2luZ1wiLFxuICAgICAgICBcImJvcmRlci13aWR0aFwiLFxuICAgICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICAgICAgXCJkdXJhdGlvblwiLFxuICAgICAgICBcInotaW5kZXhcIlxuICAgIF07XG4gICAgZm9yIChjb25zdCBncm91cE5hbWUgb2YgZ3JvdXBOYW1lcykge1xuICAgICAgICBjb25zdCBncm91cCA9IChfYSA9IHJlc3VsdFtncm91cE5hbWVdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbZ3JvdXBOYW1lXTtcbiAgICAgICAgaWYgKGdyb3VwICYmICEoZ3JvdXAgPT09IG51bGwgfHwgZ3JvdXAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGdyb3VwLnR5cGUpKSB7XG4gICAgICAgICAgICByZXN1bHRbZ3JvdXBOYW1lXSA9IGdyb3VwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgbWVhc3VyZSB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgcmFkaXVzIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFJhZGl1c1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFJhZGl1c1Rva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgc2hhZG93IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFNoYWRvd1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGNvbnN0IGxheWVycyA9IHRva2VuLnNoYWRvd0xheWVycztcbiAgICBpZiAoKGxheWVycyA9PT0gbnVsbCB8fCBsYXllcnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxheWVycy5sZW5ndGgpID4gMSkge1xuICAgICAgICAvLyBcInNoYWRvdy10b2tlblwiOiB7IFwidmFsdWVcIjogWyB7XCJjb2xvclwiOiAuLn0sIHsuLlxuICAgICAgICBsZXQgdmFsdWUgPSBsYXllcnMucmV2ZXJzZSgpLm1hcCgobGF5ZXIpID0+IHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUobGF5ZXIudmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSk7XG4gICAgICAgIC8vIFwic2hhZG93LXRva2VuXCI6IHsgXCJ2YWx1ZVwiOiB7IFwibGF5ZXItMVwiOiB7IFwiY29sb3JcIjogLi59LCBcImxheWVyLTJcIi4uXG4gICAgICAgIC8vIGxldCB2YWx1ZSA9IGxheWVycy5yZXZlcnNlKCkucmVkdWNlKChhY2MsIGxheWVyLCBpKSA9PiAoYWNjW2BsYXllci0ke2kgKyAxfWBdID0gcmVwcmVzZW50U2hhZG93VG9rZW5WYWx1ZShsYXllci52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLCBhY2MpLCB7fSk7XG4gICAgICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbiAgICB9XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50U2hhZG93VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCB0ZXh0IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRleHRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRUZXh0VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8qKiBSZXByZXNlbnQgZnVsbCB0eXBvZ3JhcGh5IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRUeXBvZ3JhcGh5VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gVG9rZW4gVmFsdWUgUmVwcmVzZW50YXRpb25cbi8qKiBSZXByZXNlbnQgY29sb3IgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0gYCMke3ZhbHVlLmhleH1gO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCByYWRpdXMgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50UmFkaXVzVG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHJhZGl1czoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5yYWRpdXMsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b3BMZWZ0OiB2YWx1ZS50b3BMZWZ0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUudG9wTGVmdCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRvcFJpZ2h0OiB2YWx1ZS50b3BSaWdodFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnRvcFJpZ2h0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYm90dG9tTGVmdDogdmFsdWUuYm90dG9tTGVmdFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmJvdHRvbUxlZnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBib3R0b21SaWdodDogdmFsdWUuYm90dG9tUmlnaHRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5ib3R0b21SaWdodCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgbWVhc3VyZSB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIG1lYXN1cmU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUubWVhc3VyZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bml0OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudW5pdC50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgZm9udCB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRGb250VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGZhbWlseToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmZhbWlseSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJmYW1pbHk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5zdWJmYW1pbHksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCB0ZXh0IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRleHRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0gdmFsdWUudGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgdHlwb2dyYXBoeSB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUeXBvZ3JhcGh5VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImZvbnRcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Rm9udFRva2VuVmFsdWUodmFsdWUuZm9udCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmZvbnRTaXplLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGV4dERlY29yYXRpb246IHZhbHVlLnRleHREZWNvcmF0aW9uLFxuICAgICAgICAgICAgdGV4dENhc2U6IHZhbHVlLnRleHRDYXNlLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5sZXR0ZXJTcGFjaW5nLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyYWdyYXBoSW5kZW50OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnBhcmFncmFwaEluZGVudCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IHZhbHVlLmxpbmVIZWlnaHRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5saW5lSGVpZ2h0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBib3JkZXIgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Qm9yZGVyVG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJjb2xvclwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUodmFsdWUuY29sb3IsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS53aWR0aCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUucG9zaXRpb24sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBzaGFkb3cgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50U2hhZG93VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJjb2xvclwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUodmFsdWUuY29sb3IsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLngsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnksIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUucmFkaXVzLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3ByZWFkOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnNwcmVhZCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wYWNpdHk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUub3BhY2l0eSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IGdyYWRpZW50IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEdyYWRpZW50VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHRvOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb2ludFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnRvLngsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnRvLnksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmcm9tOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb2ludFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmZyb20ueCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuZnJvbS55LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnR5cGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNwZWN0UmF0aW86IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuYXNwZWN0UmF0aW8sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcHM6IHt9LFxuICAgICAgICB9O1xuICAgICAgICAvLyBJbmplY3QgZ3JhZGllbnQgc3RvcHNcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChsZXQgc3RvcCBvZiB2YWx1ZS5zdG9wcykge1xuICAgICAgICAgICAgbGV0IHN0b3BPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJncmFkaWVudFN0b3BcIixcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHN0b3AucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUoc3RvcC5jb2xvciwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzdWx0LnN0b3BzW2Ake2NvdW50fWBdID0gc3RvcE9iamVjdDtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gT2JqZWN0IHdyYXBwZXJzXG4vKiogUmV0cmlldmUgd3JhcHBlciB0byBjZXJ0YWluIHRva2VuIChyZWZlcmVuY2VkIGJ5IG5hbWUpIHBvaW50aW5nIHRvIHRva2VuIHZhbHVlICovXG5mdW5jdGlvbiByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZSkge1xuICAgIHJldHVybiBgeyR7cmVmZXJlbmNlfS52YWx1ZX1gO1xufVxuLyoqIFJldHJpZXZlIHRva2VuIHdyYXBwZXIgY29udGFpbmluZyBpdHMgbWV0YWRhdGEgYW5kIHZhbHVlIGluZm9ybWF0aW9uICh1c2VkIGFzIGNvbnRhaW5lciBmb3IgZWFjaCBkZWZpbmVkIHRva2VuKSAqL1xuZnVuY3Rpb24gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdHlwZTogdHlwZUxhYmVsKHRva2VuLnRva2VuVHlwZSksXG4gICAgICAgIGNvbW1lbnQ6IHRva2VuLmRlc2NyaXB0aW9uLmxlbmd0aCA+IDAgPyB0b2tlbi5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZCxcbiAgICB9O1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBOYW1pbmdcbi8qKiBDcmVhdGUgZnVsbCByZWZlcmVuY2UgbmFtZSByZXByZXNlbnRpbmcgdG9rZW4uIFN1Y2ggbmFtZSBjYW4sIGZvciBleGFtcGxlLCBsb29rIGxpa2U6IFtnMV0uW2cyXS5bZzNdLltnNF0uW3Rva2VuLW5hbWVdICovXG5mdW5jdGlvbiByZWZlcmVuY2VOYW1lKHRva2VuLCBhbGxHcm91cHMpIHtcbiAgICAvLyBGaW5kIHRoZSBncm91cCB0byB3aGljaCB0b2tlbiBiZWxvbmdzLiBUaGlzIGlzIHJlYWxseSBzdWJvcHRpbWFsIGFuZCBzaG91bGQgYmUgc29sdmVkIGJ5IHRoZSBTREsgdG8ganVzdCBwcm92aWRlIHRoZSBncm91cCByZWZlcmVuY2VcbiAgICBsZXQgb2NjdXJhbmNlcyA9IGFsbEdyb3Vwcy5maWx0ZXIoKGcpID0+IGcudG9rZW5JZHMuaW5kZXhPZih0b2tlbi5pZCkgIT09IC0xKTtcbiAgICBpZiAob2NjdXJhbmNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJKUzogVW5hYmxlIHRvIGZpbmQgdG9rZW4gaW4gYW55IG9mIHRoZSBncm91cHNcIik7XG4gICAgfVxuICAgIGxldCBjb250YWluaW5nR3JvdXAgPSBvY2N1cmFuY2VzWzBdO1xuICAgIGxldCB0b2tlblBhcnQgPSBzYWZlVG9rZW5OYW1lKHRva2VuKTtcbiAgICBsZXQgZ3JvdXBQYXJ0cyA9IHJlZmVyZW5jZUdyb3VwQ2hhaW4oY29udGFpbmluZ0dyb3VwKS5tYXAoKGcpID0+IHNhZmVHcm91cE5hbWUoZykpO1xuICAgIHJldHVybiBbLi4uZ3JvdXBQYXJ0cywgdG9rZW5QYXJ0XS5qb2luKFwiLlwiKTtcbn1cbi8qKiBSZXRyaWV2ZSBzYWZlIHRva2VuIG5hbWUgbWFkZSBvdXQgb2Ygbm9ybWFsIHRva2VuIG5hbWVcbiAqIFRoaXMgcmVwbGFjZSBzcGFjZXMgd2l0aCBkYXNoZXMsIGFsc28gY2hhbmdlIGFueXRoaW5nIG5vbi1hbHBoYW51bWVyaWMgY2hhciB0byBpdCBhcyB3ZWxsLlxuICogRm9yIGV4YW1wbGUsIFNUJlJLIEluZHVzdHJpZXMgd2lsbCBiZSBjaGFuZ2VkIHRvIHN0LXJrLWluZHVzdHJpZXNcbiAqL1xuZnVuY3Rpb24gc2FmZVRva2VuTmFtZSh0b2tlbikge1xuICAgIHJldHVybiB0b2tlbi5uYW1lLnJlcGxhY2UoL1xcVysvZywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG59XG4vKiogUmV0cmlldmUgc2FmZSBncm91cCBuYW1lIG1hZGUgb3V0IG9mIG5vcm1hbCBncm91cCBuYW1lXG4gKiBUaGlzIHJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC5cbiAqIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXG4gKi9cbmZ1bmN0aW9uIHNhZmVHcm91cE5hbWUoZ3JvdXApIHtcbiAgICByZXR1cm4gZ3JvdXAubmFtZS5yZXBsYWNlKC9cXFcrL2csIFwiLVwiKS50b0xvd2VyQ2FzZSgpO1xufVxuLyoqIFJldHJpZXZlIGh1bWFuLXJlYWRhYmxlIHRva2VuIHR5cGUgaW4gdW5pZmllZCBmYXNoaW9uLCB1c2VkIGJvdGggYXMgdG9rZW4gdHlwZSBhbmQgYXMgdG9rZW4gbWFzdGVyIGdyb3VwICovXG5mdW5jdGlvbiB0eXBlTGFiZWwodHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwiQm9yZGVyXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJib3JkZXJcIjtcbiAgICAgICAgY2FzZSBcIkNvbG9yXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJjb2xvclwiO1xuICAgICAgICBjYXNlIFwiRm9udFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZm9udFwiO1xuICAgICAgICBjYXNlIFwiR3JhZGllbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBcImdyYWRpZW50XCI7XG4gICAgICAgIGNhc2UgXCJNZWFzdXJlXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJtZWFzdXJlXCI7XG4gICAgICAgIGNhc2UgXCJSYWRpdXNcIjpcbiAgICAgICAgICAgIHJldHVybiBcInJhZGl1c1wiO1xuICAgICAgICBjYXNlIFwiU2hhZG93XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJzaGFkb3dcIjtcbiAgICAgICAgY2FzZSBcIlRleHRcIjpcbiAgICAgICAgICAgIHJldHVybiBcInRleHRcIjtcbiAgICAgICAgY2FzZSBcIlR5cG9ncmFwaHlcIjpcbiAgICAgICAgICAgIHJldHVybiBcInR5cG9ncmFwaHlcIjtcbiAgICB9XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIExvb2t1cFxuLyoqIEZpbmQgYWxsIHRva2VucyB0aGF0IGJlbG9uZyB0byBhIGNlcnRhaW4gZ3JvdXAgYW5kIHJldHJpZXZlIHRoZW0gYXMgb2JqZWN0cyAqL1xuZnVuY3Rpb24gdG9rZW5zT2ZHcm91cChjb250YWluaW5nR3JvdXAsIGFsbFRva2Vucykge1xuICAgIGNvbnN0IGlzVmlydHVhbFNoYWRvdyA9ICh0KSA9PiB7IHZhciBfYTsgcmV0dXJuICgoX2EgPSB0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaXNWaXJ0dWFsKSA9PT0gdHJ1ZSAmJiB0LnRva2VuVHlwZSA9PT0gJ1NoYWRvdyc7IH07XG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIoKHQpID0+IGNvbnRhaW5pbmdHcm91cC50b2tlbklkcy5pbmRleE9mKHQuaWQpICE9PSAtMSAmJiAhaXNWaXJ0dWFsU2hhZG93KHQpKTtcbn1cbi8qKiBSZXRyaWV2ZSBjaGFpbiBvZiBncm91cHMgdXAgdG8gYSBzcGVjaWZpZWQgZ3JvdXAsIG9yZGVyZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4gKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZUdyb3VwQ2hhaW4oY29udGFpbmluZ0dyb3VwKSB7XG4gICAgbGV0IGl0ZXJhdGVkR3JvdXAgPSBjb250YWluaW5nR3JvdXA7XG4gICAgbGV0IGNoYWluID0gW2NvbnRhaW5pbmdHcm91cF07XG4gICAgd2hpbGUgKGl0ZXJhdGVkR3JvdXAucGFyZW50KSB7XG4gICAgICAgIGNoYWluLnB1c2goaXRlcmF0ZWRHcm91cC5wYXJlbnQpO1xuICAgICAgICBpdGVyYXRlZEdyb3VwID0gaXRlcmF0ZWRHcm91cC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBjaGFpbi5yZXZlcnNlKCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9