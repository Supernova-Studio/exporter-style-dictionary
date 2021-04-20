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
    let result = representTree(rootGroup, allTokens, allGroups, writeRoot);
    return result;
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
        rootGroup.tokenIds;
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
function representColorToken(token, allTokens, allGroups) {
    let value = token.value.referencedToken ? referenceWrapper(referenceName(token.value.referencedToken, allGroups)) : `#${token.value.hex}`;
    return tokenWrapper(token, value);
}
function representBorderToken(token, allTokens, allGroups) {
    // TODO: Border value
    let value = "";
    return tokenWrapper(token, value);
}
function representFontToken(token, allTokens, allGroups) {
    // TODO: Font value
    let value = "";
    return tokenWrapper(token, value);
}
function representGradientToken(token, allTokens, allGroups) {
    // TODO: Gradient value
    let value = "";
    return tokenWrapper(token, value);
}
function representMeasureToken(token, allTokens, allGroups) {
    // TODO: Measure value
    let value = "";
    return tokenWrapper(token, value);
}
function representRadiusToken(token, allTokens, allGroups) {
    // TODO: Radius value
    let value = "";
    return tokenWrapper(token, value);
}
function representShadowToken(token, allTokens, allGroups) {
    // TODO: Shadow value
    let value = "";
    return tokenWrapper(token, value);
}
function representTextToken(token, allTokens, allGroups) {
    // TODO: Text value
    let value = "";
    return tokenWrapper(token, value);
}
function representTypographyToken(token, allTokens, allGroups) {
    // TODO: Typography value
    let value = "";
    return tokenWrapper(token, value);
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers
function referenceWrapper(reference) {
    return `{${reference}.value}`;
}
function tokenWrapper(token, value) {
    return {
        value: value,
        type: typeLabel(token.tokenType),
        comment: token.description.length > 0 ? token.description : undefined,
    };
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming
function referenceName(token, allGroups) {
    // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
    let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1);
    if (occurances.length === 0) {
        throw Error("JS: Unable to find token in any of the groups");
    }
    // Create full reference chain name. [g1].[g2].[g3].[g4].[token-name]
    let containingGroup = occurances[0];
    let tokenPart = safeTokenName(token);
    let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g));
    return [...groupParts, tokenPart].join(".");
}
function safeTokenName(token) {
    // Replace spaces with dashes, also change anything non-alphanumeric char to it as well.
    // For example, ST&RK Industries will be changed to st-rk-industries
    return token.name.replace(/\W+/g, "-").toLowerCase();
}
function safeGroupName(group) {
    // Replace spaces with dashes, also change anything non-alphanumeric char to it as well.
    // For example, ST&RK Industries will be changed to st-rk-industries
    return group.name.replace(/\W+/g, "-").toLowerCase();
}
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
function tokensOfGroup(containingGroup, allTokens) {
    return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1);
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRIQUE0SCxnQkFBZ0I7QUFDNUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFLFVBQVUsT0FBTztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbXB1dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gQmx1ZXByaW50IGZ1bmN0aW9uc1xuLyoqIEZvcm1hdCBvYmplY3QgdG8gcHJldHR5IEpTT04gKi9cblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwib2JqZWN0VG9QcmV0dHlKc29uXCIsIChvYmplY3QpID0+IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKTtcbn0pO1xuLyoqIEdlbmVyYXRlIHN0eWxlIGRpY3Rpb25hcnkgdHJlZSAqL1xuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJnZW5lcmF0ZVN0eWxlRGljdGlvbmFyeVRyZWVcIiwgKHJvb3RHcm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpID0+IHtcbiAgICBsZXQgd3JpdGVSb290ID0ge307XG4gICAgbGV0IHJlc3VsdCA9IHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVSb290KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufSk7XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIFRyZWUgY29uc3RydWN0aW9uXG4vKiogQ29uc3RydWN0IHRyZWUgb3V0IG9mIG9uZSBzcGVjaWZpYyBncm91cCwgaW5kZXBlbmRlbnQgb2YgdHJlZSB0eXBlICovXG5mdW5jdGlvbiByZXByZXNlbnRUcmVlKHJvb3RHcm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlT2JqZWN0KSB7XG4gICAgLy8gUmVwcmVzZW50IG9uZSBsZXZlbCBvZiBncm91cHMgYW5kIHRva2VucyBpbnNpZGUgdHJlZS4gQ3JlYXRlcyBzdWJvYmplY3RzIGFuZCB0aGVuIGFsc28gaW5mb3JtYXRpb24gYWJvdXQgZWFjaCB0b2tlblxuICAgIGZvciAobGV0IGdyb3VwIG9mIHJvb3RHcm91cC5zdWJncm91cHMpIHtcbiAgICAgICAgLy8gV3JpdGUgYnVmZmVyXG4gICAgICAgIGxldCB3cml0ZVN1Yk9iamVjdCA9IHt9O1xuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCBzdWJncm91cCwgYW5kIHJlcHJlc2VudCBpdHMgdHJlZSBpbnRvIGl0XG4gICAgICAgIHdyaXRlT2JqZWN0W3NhZmVHcm91cE5hbWUoZ3JvdXApXSA9IHJlcHJlc2VudFRyZWUoZ3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZVN1Yk9iamVjdCk7XG4gICAgICAgIC8vIEFkZCBlYWNoIGVudHJ5IGZvciBlYWNoIHRva2VuLCB3cml0aW5nIHRvIHRoZSBzYW1lIHdyaXRlIHJvb3RcbiAgICAgICAgZm9yIChsZXQgdG9rZW4gb2YgdG9rZW5zT2ZHcm91cChncm91cCwgYWxsVG9rZW5zKSkge1xuICAgICAgICAgICAgd3JpdGVTdWJPYmplY3Rbc2FmZVRva2VuTmFtZSh0b2tlbildID0gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgfVxuICAgICAgICByb290R3JvdXAudG9rZW5JZHM7XG4gICAgfVxuICAgIHJldHVybiB3cml0ZU9iamVjdDtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gVG9rZW4gUmVwcmVzZW50YXRpb25cbi8qKiBSZXByZXNlbnQgYSBzaW5ndWxhciB0b2tlbiBhcyBTRCBvYmplY3QgKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIHN3aXRjaCAodG9rZW4udG9rZW5UeXBlKSB7XG4gICAgICAgIGNhc2UgXCJDb2xvclwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkJvcmRlclwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEJvcmRlclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJGb250XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Rm9udFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEdyYWRpZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIk1lYXN1cmVcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlJhZGl1c1wiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFJhZGl1c1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRTaGFkb3dUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiVGV4dFwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFRleHRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiVHlwb2dyYXBoeVwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gdG9rZW4udmFsdWUucmVmZXJlbmNlZFRva2VuID8gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHRva2VuLnZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSkgOiBgIyR7dG9rZW4udmFsdWUuaGV4fWA7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gcmVwcmVzZW50Qm9yZGVyVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgLy8gVE9ETzogQm9yZGVyIHZhbHVlXG4gICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiByZXByZXNlbnRGb250VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgLy8gVE9ETzogRm9udCB2YWx1ZVxuICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gcmVwcmVzZW50R3JhZGllbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICAvLyBUT0RPOiBHcmFkaWVudCB2YWx1ZVxuICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gcmVwcmVzZW50TWVhc3VyZVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIC8vIFRPRE86IE1lYXN1cmUgdmFsdWVcbiAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHJlcHJlc2VudFJhZGl1c1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIC8vIFRPRE86IFJhZGl1cyB2YWx1ZVxuICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gcmVwcmVzZW50U2hhZG93VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgLy8gVE9ETzogU2hhZG93IHZhbHVlXG4gICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiByZXByZXNlbnRUZXh0VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgLy8gVE9ETzogVGV4dCB2YWx1ZVxuICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuZnVuY3Rpb24gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIC8vIFRPRE86IFR5cG9ncmFwaHkgdmFsdWVcbiAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gT2JqZWN0IHdyYXBwZXJzXG5mdW5jdGlvbiByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZSkge1xuICAgIHJldHVybiBgeyR7cmVmZXJlbmNlfS52YWx1ZX1gO1xufVxuZnVuY3Rpb24gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdHlwZTogdHlwZUxhYmVsKHRva2VuLnRva2VuVHlwZSksXG4gICAgICAgIGNvbW1lbnQ6IHRva2VuLmRlc2NyaXB0aW9uLmxlbmd0aCA+IDAgPyB0b2tlbi5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZCxcbiAgICB9O1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBOYW1pbmdcbmZ1bmN0aW9uIHJlZmVyZW5jZU5hbWUodG9rZW4sIGFsbEdyb3Vwcykge1xuICAgIC8vIEZpbmQgdGhlIGdyb3VwIHRvIHdoaWNoIHRva2VuIGJlbG9uZ3MuIFRoaXMgaXMgcmVhbGx5IHN1Ym9wdGltYWwgYW5kIHNob3VsZCBiZSBzb2x2ZWQgYnkgdGhlIFNESyB0byBqdXN0IHByb3ZpZGUgdGhlIGdyb3VwIHJlZmVyZW5jZVxuICAgIGxldCBvY2N1cmFuY2VzID0gYWxsR3JvdXBzLmZpbHRlcigoZykgPT4gZy50b2tlbklkcy5pbmRleE9mKHRva2VuLmlkKSAhPT0gLTEpO1xuICAgIGlmIChvY2N1cmFuY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkpTOiBVbmFibGUgdG8gZmluZCB0b2tlbiBpbiBhbnkgb2YgdGhlIGdyb3Vwc1wiKTtcbiAgICB9XG4gICAgLy8gQ3JlYXRlIGZ1bGwgcmVmZXJlbmNlIGNoYWluIG5hbWUuIFtnMV0uW2cyXS5bZzNdLltnNF0uW3Rva2VuLW5hbWVdXG4gICAgbGV0IGNvbnRhaW5pbmdHcm91cCA9IG9jY3VyYW5jZXNbMF07XG4gICAgbGV0IHRva2VuUGFydCA9IHNhZmVUb2tlbk5hbWUodG9rZW4pO1xuICAgIGxldCBncm91cFBhcnRzID0gcmVmZXJlbmNlR3JvdXBDaGFpbihjb250YWluaW5nR3JvdXApLm1hcCgoZykgPT4gc2FmZUdyb3VwTmFtZShnKSk7XG4gICAgcmV0dXJuIFsuLi5ncm91cFBhcnRzLCB0b2tlblBhcnRdLmpvaW4oXCIuXCIpO1xufVxuZnVuY3Rpb24gc2FmZVRva2VuTmFtZSh0b2tlbikge1xuICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC5cbiAgICAvLyBGb3IgZXhhbXBsZSwgU1QmUksgSW5kdXN0cmllcyB3aWxsIGJlIGNoYW5nZWQgdG8gc3QtcmstaW5kdXN0cmllc1xuICAgIHJldHVybiB0b2tlbi5uYW1lLnJlcGxhY2UoL1xcVysvZywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5mdW5jdGlvbiBzYWZlR3JvdXBOYW1lKGdyb3VwKSB7XG4gICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCBkYXNoZXMsIGFsc28gY2hhbmdlIGFueXRoaW5nIG5vbi1hbHBoYW51bWVyaWMgY2hhciB0byBpdCBhcyB3ZWxsLlxuICAgIC8vIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXG4gICAgcmV0dXJuIGdyb3VwLm5hbWUucmVwbGFjZSgvXFxXKy9nLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIHR5cGVMYWJlbCh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJCb3JkZXJcIjpcbiAgICAgICAgICAgIHJldHVybiBcImJvcmRlclwiO1xuICAgICAgICBjYXNlIFwiQ29sb3JcIjpcbiAgICAgICAgICAgIHJldHVybiBcImNvbG9yXCI7XG4gICAgICAgIGNhc2UgXCJGb250XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJmb250XCI7XG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZ3JhZGllbnRcIjtcbiAgICAgICAgY2FzZSBcIk1lYXN1cmVcIjpcbiAgICAgICAgICAgIHJldHVybiBcIm1lYXN1cmVcIjtcbiAgICAgICAgY2FzZSBcIlJhZGl1c1wiOlxuICAgICAgICAgICAgcmV0dXJuIFwicmFkaXVzXCI7XG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcbiAgICAgICAgICAgIHJldHVybiBcInNoYWRvd1wiO1xuICAgICAgICBjYXNlIFwiVGV4dFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xuICAgICAgICBjYXNlIFwiVHlwb2dyYXBoeVwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidHlwb2dyYXBoeVwiO1xuICAgIH1cbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gTG9va3VwXG5mdW5jdGlvbiB0b2tlbnNPZkdyb3VwKGNvbnRhaW5pbmdHcm91cCwgYWxsVG9rZW5zKSB7XG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIoKHQpID0+IGNvbnRhaW5pbmdHcm91cC50b2tlbklkcy5pbmRleE9mKHQuaWQpICE9PSAtMSk7XG59XG5mdW5jdGlvbiByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkge1xuICAgIGxldCBpdGVyYXRlZEdyb3VwID0gY29udGFpbmluZ0dyb3VwO1xuICAgIGxldCBjaGFpbiA9IFtjb250YWluaW5nR3JvdXBdO1xuICAgIHdoaWxlIChpdGVyYXRlZEdyb3VwLnBhcmVudCkge1xuICAgICAgICBjaGFpbi5wdXNoKGl0ZXJhdGVkR3JvdXAucGFyZW50KTtcbiAgICAgICAgaXRlcmF0ZWRHcm91cCA9IGl0ZXJhdGVkR3JvdXAucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW4ucmV2ZXJzZSgpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==