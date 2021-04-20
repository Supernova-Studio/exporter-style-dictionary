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

/**
 * Format object to pretty JSON
 */
Pulsar.registerFunction("objectToPrettyJson", (object) => {
    return JSON.stringify(object, null, 2);
});
/**
 * Generate style dictionary tree
 */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup, allTokens, allGroups) => {
    let writeRoot = {};
    let result = representTree(rootGroup, allTokens, allGroups, writeRoot);
    return result;
});
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
function representToken(token, allTokens, allGroups) {
    switch (token.tokenType) {
        case 'Color':
            return representColorToken(token, allTokens, allGroups);
    }
    throw Error(`JS: Unsupported token type ${token.tokenType}`);
}
function representColorToken(token, allTokens, allGroups) {
    return {
        "value": token.value.referencedToken ? referenceWrapper(referenceName(token, allGroups)) : `#${token.value.hex}`,
        "type": "color"
    };
}
function referenceWrapper(reference) {
    return `{${reference}}`;
}
function referenceName(token, allGroups) {
    // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
    let occurances = allGroups.filter(g => g.tokenIds.indexOf(token.id) !== -1);
    if (occurances.length === 0) {
        throw Error("JS: Unable to find token in any of the groups");
    }
    // Create full reference chain name. [g1].[g2].[g3].[g4].[token-name]
    let containingGroup = occurances[0];
    let tokenPart = safeTokenName(token);
    let groupParts = referenceGroupChain(containingGroup).map(g => safeGroupName(g));
    return [...groupParts, tokenPart].join(".");
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
function tokensOfGroup(containingGroup, allTokens) {
    return allTokens.filter(t => containingGroup.tokenIds.indexOf(t.id) !== -1);
}
function safeTokenName(token) {
    // Replace spaces with dashes, also change anything non-alphanumeric char to it as well. 
    // For example, ST&RK Industries will be changed to st-rk-industries
    return token.name.replace(/\W+/g, '-').toLowerCase();
}
function safeGroupName(group) {
    // Replace spaces with dashes, also change anything non-alphanumeric char to it as well. 
    // For example, ST&RK Industries will be changed to st-rk-industries
    return group.name.replace(/\W+/g, '-').toLowerCase();
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsZ0JBQWdCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLHVHQUF1RyxnQkFBZ0I7QUFDdkg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEVBQUUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbXB1dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIi8qKlxuICogRm9ybWF0IG9iamVjdCB0byBwcmV0dHkgSlNPTlxuICovXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcIm9iamVjdFRvUHJldHR5SnNvblwiLCAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMik7XG59KTtcbi8qKlxuICogR2VuZXJhdGUgc3R5bGUgZGljdGlvbmFyeSB0cmVlXG4gKi9cblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwiZ2VuZXJhdGVTdHlsZURpY3Rpb25hcnlUcmVlXCIsIChyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzKSA9PiB7XG4gICAgbGV0IHdyaXRlUm9vdCA9IHt9O1xuICAgIGxldCByZXN1bHQgPSByZXByZXNlbnRUcmVlKHJvb3RHcm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlUm9vdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuZnVuY3Rpb24gcmVwcmVzZW50VHJlZShyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZU9iamVjdCkge1xuICAgIC8vIFJlcHJlc2VudCBvbmUgbGV2ZWwgb2YgZ3JvdXBzIGFuZCB0b2tlbnMgaW5zaWRlIHRyZWUuIENyZWF0ZXMgc3Vib2JqZWN0cyBhbmQgdGhlbiBhbHNvIGluZm9ybWF0aW9uIGFib3V0IGVhY2ggdG9rZW5cbiAgICBmb3IgKGxldCBncm91cCBvZiByb290R3JvdXAuc3ViZ3JvdXBzKSB7XG4gICAgICAgIC8vIFdyaXRlIGJ1ZmZlclxuICAgICAgICBsZXQgd3JpdGVTdWJPYmplY3QgPSB7fTtcbiAgICAgICAgLy8gQWRkIGVhY2ggZW50cnkgZm9yIGVhY2ggc3ViZ3JvdXAsIGFuZCByZXByZXNlbnQgaXRzIHRyZWUgaW50byBpdFxuICAgICAgICB3cml0ZU9iamVjdFtzYWZlR3JvdXBOYW1lKGdyb3VwKV0gPSByZXByZXNlbnRUcmVlKGdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVTdWJPYmplY3QpO1xuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCB0b2tlbiwgd3JpdGluZyB0byB0aGUgc2FtZSB3cml0ZSByb290XG4gICAgICAgIGZvciAobGV0IHRva2VuIG9mIHRva2Vuc09mR3JvdXAoZ3JvdXAsIGFsbFRva2VucykpIHtcbiAgICAgICAgICAgIHdyaXRlU3ViT2JqZWN0W3NhZmVUb2tlbk5hbWUodG9rZW4pXSA9IHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIH1cbiAgICAgICAgcm9vdEdyb3VwLnRva2VuSWRzO1xuICAgIH1cbiAgICByZXR1cm4gd3JpdGVPYmplY3Q7XG59XG5mdW5jdGlvbiByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBzd2l0Y2ggKHRva2VuLnRva2VuVHlwZSkge1xuICAgICAgICBjYXNlICdDb2xvcic6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Q29sb3JUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgIH1cbiAgICB0aHJvdyBFcnJvcihgSlM6IFVuc3VwcG9ydGVkIHRva2VuIHR5cGUgJHt0b2tlbi50b2tlblR5cGV9YCk7XG59XG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIHJldHVybiB7XG4gICAgICAgIFwidmFsdWVcIjogdG9rZW4udmFsdWUucmVmZXJlbmNlZFRva2VuID8gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHRva2VuLCBhbGxHcm91cHMpKSA6IGAjJHt0b2tlbi52YWx1ZS5oZXh9YCxcbiAgICAgICAgXCJ0eXBlXCI6IFwiY29sb3JcIlxuICAgIH07XG59XG5mdW5jdGlvbiByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZSkge1xuICAgIHJldHVybiBgeyR7cmVmZXJlbmNlfX1gO1xufVxuZnVuY3Rpb24gcmVmZXJlbmNlTmFtZSh0b2tlbiwgYWxsR3JvdXBzKSB7XG4gICAgLy8gRmluZCB0aGUgZ3JvdXAgdG8gd2hpY2ggdG9rZW4gYmVsb25ncy4gVGhpcyBpcyByZWFsbHkgc3Vib3B0aW1hbCBhbmQgc2hvdWxkIGJlIHNvbHZlZCBieSB0aGUgU0RLIHRvIGp1c3QgcHJvdmlkZSB0aGUgZ3JvdXAgcmVmZXJlbmNlXG4gICAgbGV0IG9jY3VyYW5jZXMgPSBhbGxHcm91cHMuZmlsdGVyKGcgPT4gZy50b2tlbklkcy5pbmRleE9mKHRva2VuLmlkKSAhPT0gLTEpO1xuICAgIGlmIChvY2N1cmFuY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkpTOiBVbmFibGUgdG8gZmluZCB0b2tlbiBpbiBhbnkgb2YgdGhlIGdyb3Vwc1wiKTtcbiAgICB9XG4gICAgLy8gQ3JlYXRlIGZ1bGwgcmVmZXJlbmNlIGNoYWluIG5hbWUuIFtnMV0uW2cyXS5bZzNdLltnNF0uW3Rva2VuLW5hbWVdXG4gICAgbGV0IGNvbnRhaW5pbmdHcm91cCA9IG9jY3VyYW5jZXNbMF07XG4gICAgbGV0IHRva2VuUGFydCA9IHNhZmVUb2tlbk5hbWUodG9rZW4pO1xuICAgIGxldCBncm91cFBhcnRzID0gcmVmZXJlbmNlR3JvdXBDaGFpbihjb250YWluaW5nR3JvdXApLm1hcChnID0+IHNhZmVHcm91cE5hbWUoZykpO1xuICAgIHJldHVybiBbLi4uZ3JvdXBQYXJ0cywgdG9rZW5QYXJ0XS5qb2luKFwiLlwiKTtcbn1cbmZ1bmN0aW9uIHJlZmVyZW5jZUdyb3VwQ2hhaW4oY29udGFpbmluZ0dyb3VwKSB7XG4gICAgbGV0IGl0ZXJhdGVkR3JvdXAgPSBjb250YWluaW5nR3JvdXA7XG4gICAgbGV0IGNoYWluID0gW2NvbnRhaW5pbmdHcm91cF07XG4gICAgd2hpbGUgKGl0ZXJhdGVkR3JvdXAucGFyZW50KSB7XG4gICAgICAgIGNoYWluLnB1c2goaXRlcmF0ZWRHcm91cC5wYXJlbnQpO1xuICAgICAgICBpdGVyYXRlZEdyb3VwID0gaXRlcmF0ZWRHcm91cC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBjaGFpbi5yZXZlcnNlKCk7XG59XG5mdW5jdGlvbiB0b2tlbnNPZkdyb3VwKGNvbnRhaW5pbmdHcm91cCwgYWxsVG9rZW5zKSB7XG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIodCA9PiBjb250YWluaW5nR3JvdXAudG9rZW5JZHMuaW5kZXhPZih0LmlkKSAhPT0gLTEpO1xufVxuZnVuY3Rpb24gc2FmZVRva2VuTmFtZSh0b2tlbikge1xuICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC4gXG4gICAgLy8gRm9yIGV4YW1wbGUsIFNUJlJLIEluZHVzdHJpZXMgd2lsbCBiZSBjaGFuZ2VkIHRvIHN0LXJrLWluZHVzdHJpZXNcbiAgICByZXR1cm4gdG9rZW4ubmFtZS5yZXBsYWNlKC9cXFcrL2csICctJykudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIHNhZmVHcm91cE5hbWUoZ3JvdXApIHtcbiAgICAvLyBSZXBsYWNlIHNwYWNlcyB3aXRoIGRhc2hlcywgYWxzbyBjaGFuZ2UgYW55dGhpbmcgbm9uLWFscGhhbnVtZXJpYyBjaGFyIHRvIGl0IGFzIHdlbGwuIFxuICAgIC8vIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXG4gICAgcmV0dXJuIGdyb3VwLm5hbWUucmVwbGFjZSgvXFxXKy9nLCAnLScpLnRvTG93ZXJDYXNlKCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9