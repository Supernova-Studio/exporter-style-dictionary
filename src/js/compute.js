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
        "value": token.value.referencedToken ? referenceWrapper(referenceName(token.value.referencedToken, allGroups)) : `#${token.value.hex}`,
        "type": "color",
        "comment": token.description.length > 0 ? token.description : undefined
    };
}
function referenceWrapper(reference) {
    return `{${reference}.value}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsZ0JBQWdCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLDZIQUE2SCxnQkFBZ0I7QUFDN0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsRUFBRSxVQUFVLE9BQU87QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21wdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIvKipcbiAqIEZvcm1hdCBvYmplY3QgdG8gcHJldHR5IEpTT05cbiAqL1xuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJvYmplY3RUb1ByZXR0eUpzb25cIiwgKG9iamVjdCkgPT4ge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpO1xufSk7XG4vKipcbiAqIEdlbmVyYXRlIHN0eWxlIGRpY3Rpb25hcnkgdHJlZVxuICovXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcImdlbmVyYXRlU3R5bGVEaWN0aW9uYXJ5VHJlZVwiLCAocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3VwcykgPT4ge1xuICAgIGxldCB3cml0ZVJvb3QgPSB7fTtcbiAgICBsZXQgcmVzdWx0ID0gcmVwcmVzZW50VHJlZShyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZVJvb3QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59KTtcbmZ1bmN0aW9uIHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVPYmplY3QpIHtcbiAgICAvLyBSZXByZXNlbnQgb25lIGxldmVsIG9mIGdyb3VwcyBhbmQgdG9rZW5zIGluc2lkZSB0cmVlLiBDcmVhdGVzIHN1Ym9iamVjdHMgYW5kIHRoZW4gYWxzbyBpbmZvcm1hdGlvbiBhYm91dCBlYWNoIHRva2VuXG4gICAgZm9yIChsZXQgZ3JvdXAgb2Ygcm9vdEdyb3VwLnN1Ymdyb3Vwcykge1xuICAgICAgICAvLyBXcml0ZSBidWZmZXJcbiAgICAgICAgbGV0IHdyaXRlU3ViT2JqZWN0ID0ge307XG4gICAgICAgIC8vIEFkZCBlYWNoIGVudHJ5IGZvciBlYWNoIHN1Ymdyb3VwLCBhbmQgcmVwcmVzZW50IGl0cyB0cmVlIGludG8gaXRcbiAgICAgICAgd3JpdGVPYmplY3Rbc2FmZUdyb3VwTmFtZShncm91cCldID0gcmVwcmVzZW50VHJlZShncm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlU3ViT2JqZWN0KTtcbiAgICAgICAgLy8gQWRkIGVhY2ggZW50cnkgZm9yIGVhY2ggdG9rZW4sIHdyaXRpbmcgdG8gdGhlIHNhbWUgd3JpdGUgcm9vdFxuICAgICAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnNPZkdyb3VwKGdyb3VwLCBhbGxUb2tlbnMpKSB7XG4gICAgICAgICAgICB3cml0ZVN1Yk9iamVjdFtzYWZlVG9rZW5OYW1lKHRva2VuKV0gPSByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICB9XG4gICAgICAgIHJvb3RHcm91cC50b2tlbklkcztcbiAgICB9XG4gICAgcmV0dXJuIHdyaXRlT2JqZWN0O1xufVxuZnVuY3Rpb24gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgc3dpdGNoICh0b2tlbi50b2tlblR5cGUpIHtcbiAgICAgICAgY2FzZSAnQ29sb3InOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICB9XG4gICAgdGhyb3cgRXJyb3IoYEpTOiBVbnN1cHBvcnRlZCB0b2tlbiB0eXBlICR7dG9rZW4udG9rZW5UeXBlfWApO1xufVxuZnVuY3Rpb24gcmVwcmVzZW50Q29sb3JUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBcInZhbHVlXCI6IHRva2VuLnZhbHVlLnJlZmVyZW5jZWRUb2tlbiA/IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh0b2tlbi52YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpIDogYCMke3Rva2VuLnZhbHVlLmhleH1gLFxuICAgICAgICBcInR5cGVcIjogXCJjb2xvclwiLFxuICAgICAgICBcImNvbW1lbnRcIjogdG9rZW4uZGVzY3JpcHRpb24ubGVuZ3RoID4gMCA/IHRva2VuLmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIGB7JHtyZWZlcmVuY2V9LnZhbHVlfWA7XG59XG5mdW5jdGlvbiByZWZlcmVuY2VOYW1lKHRva2VuLCBhbGxHcm91cHMpIHtcbiAgICAvLyBGaW5kIHRoZSBncm91cCB0byB3aGljaCB0b2tlbiBiZWxvbmdzLiBUaGlzIGlzIHJlYWxseSBzdWJvcHRpbWFsIGFuZCBzaG91bGQgYmUgc29sdmVkIGJ5IHRoZSBTREsgdG8ganVzdCBwcm92aWRlIHRoZSBncm91cCByZWZlcmVuY2VcbiAgICBsZXQgb2NjdXJhbmNlcyA9IGFsbEdyb3Vwcy5maWx0ZXIoZyA9PiBnLnRva2VuSWRzLmluZGV4T2YodG9rZW4uaWQpICE9PSAtMSk7XG4gICAgaWYgKG9jY3VyYW5jZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiSlM6IFVuYWJsZSB0byBmaW5kIHRva2VuIGluIGFueSBvZiB0aGUgZ3JvdXBzXCIpO1xuICAgIH1cbiAgICAvLyBDcmVhdGUgZnVsbCByZWZlcmVuY2UgY2hhaW4gbmFtZS4gW2cxXS5bZzJdLltnM10uW2c0XS5bdG9rZW4tbmFtZV1cbiAgICBsZXQgY29udGFpbmluZ0dyb3VwID0gb2NjdXJhbmNlc1swXTtcbiAgICBsZXQgdG9rZW5QYXJ0ID0gc2FmZVRva2VuTmFtZSh0b2tlbik7XG4gICAgbGV0IGdyb3VwUGFydHMgPSByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkubWFwKGcgPT4gc2FmZUdyb3VwTmFtZShnKSk7XG4gICAgcmV0dXJuIFsuLi5ncm91cFBhcnRzLCB0b2tlblBhcnRdLmpvaW4oXCIuXCIpO1xufVxuZnVuY3Rpb24gcmVmZXJlbmNlR3JvdXBDaGFpbihjb250YWluaW5nR3JvdXApIHtcbiAgICBsZXQgaXRlcmF0ZWRHcm91cCA9IGNvbnRhaW5pbmdHcm91cDtcbiAgICBsZXQgY2hhaW4gPSBbY29udGFpbmluZ0dyb3VwXTtcbiAgICB3aGlsZSAoaXRlcmF0ZWRHcm91cC5wYXJlbnQpIHtcbiAgICAgICAgY2hhaW4ucHVzaChpdGVyYXRlZEdyb3VwLnBhcmVudCk7XG4gICAgICAgIGl0ZXJhdGVkR3JvdXAgPSBpdGVyYXRlZEdyb3VwLnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIGNoYWluLnJldmVyc2UoKTtcbn1cbmZ1bmN0aW9uIHRva2Vuc09mR3JvdXAoY29udGFpbmluZ0dyb3VwLCBhbGxUb2tlbnMpIHtcbiAgICByZXR1cm4gYWxsVG9rZW5zLmZpbHRlcih0ID0+IGNvbnRhaW5pbmdHcm91cC50b2tlbklkcy5pbmRleE9mKHQuaWQpICE9PSAtMSk7XG59XG5mdW5jdGlvbiBzYWZlVG9rZW5OYW1lKHRva2VuKSB7XG4gICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCBkYXNoZXMsIGFsc28gY2hhbmdlIGFueXRoaW5nIG5vbi1hbHBoYW51bWVyaWMgY2hhciB0byBpdCBhcyB3ZWxsLiBcbiAgICAvLyBGb3IgZXhhbXBsZSwgU1QmUksgSW5kdXN0cmllcyB3aWxsIGJlIGNoYW5nZWQgdG8gc3QtcmstaW5kdXN0cmllc1xuICAgIHJldHVybiB0b2tlbi5uYW1lLnJlcGxhY2UoL1xcVysvZywgJy0nKS50b0xvd2VyQ2FzZSgpO1xufVxuZnVuY3Rpb24gc2FmZUdyb3VwTmFtZShncm91cCkge1xuICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC4gXG4gICAgLy8gRm9yIGV4YW1wbGUsIFNUJlJLIEluZHVzdHJpZXMgd2lsbCBiZSBjaGFuZ2VkIHRvIHN0LXJrLWluZHVzdHJpZXNcbiAgICByZXR1cm4gZ3JvdXAubmFtZS5yZXBsYWNlKC9cXFcrL2csICctJykudG9Mb3dlckNhc2UoKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=