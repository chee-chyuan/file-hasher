(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "../pkg/file_hasher.js":
/*!*****************************!*\
  !*** ../pkg/file_hasher.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module parse failed: Unexpected token (427:53)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n| async function init(input, maybe_memory) {\\n|     if (typeof input === 'undefined') {\\n>         input = new URL('file_hasher_bg.wasm', import.meta.url);\\n|     }\\n|     const imports = getImports();\");\n\n//# sourceURL=webpack:///../pkg/file_hasher.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var file_hasher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! file-hasher */ \"../pkg/file_hasher.js\");\n/* harmony import */ var file_hasher__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(file_hasher__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var js_sha256__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-sha256 */ \"./node_modules/js-sha256/src/sha256.js\");\n/* harmony import */ var js_sha256__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(js_sha256__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n// // create a form (20 rows)\n// const rowTitles = [\n//   \"1\",\n//   \"2\",\n//   \"3\",\n//   \"4\",\n//   \"5\",\n//   \"6\",\n//   \"7\",\n//   \"8\",\n//   \"9\",\n//   \"10\",\n//   \"11\",\n//   \"12\",\n//   \"13\",\n//   \"14\",\n//   \"15\",\n//   \"16\",\n//   \"17\",\n//   \"18\",\n//   \"19\",\n//   \"20\",\n// ];\n// const rowContent = [\n//   \"1\",\n//   \"2\",\n//   \"3\",\n//   \"4\",\n//   \"5\",\n//   \"6\",\n//   \"7\",\n//   \"8\",\n//   \"9\",\n//   \"10\",\n//   \"11\",\n//   \"12\",\n//   \"13\",\n//   \"14\",\n//   \"15\",\n//   \"16\",\n//   \"17\",\n//   \"18\",\n//   \"19\",\n//   \"20\",\n// ];\n\n// const run = () => {\n//   debugger;\n//   // create sha256 entry for each row_title and row_content\n//   // split each sha256 to 4 u64 numbers\n//   const rowTitlesU64 = rowTitles.map((x) => {\n//     const shaRes = sha256(x);\n//     return convertSha256HexToU64(shaRes);\n//   });\n//   const rowContentU64 = rowContent.map((x) => {\n//     const shaRes = sha256(x);\n//     return convertSha256HexToU64(shaRes);\n//   });\n\n//   // create selector\n//   const selectedRowIndex = 0;\n//   const rowSelector = Array(20).fill(0);\n//   rowSelector[selectedRowIndex] = 1; // selecting the first entry\n\n//   // generate a row hash\n//   const rowHashInBits = generate_row_hash(\n//     rowTitles[selectedRowIndex],\n//     rowContent[selectedRowIndex]\n//   );\n//   const rowHashHex = convertLEBitsToHex(rowHashInBits);\n\n//   const [fileCommitmentInBits, selectedRowInBits] =\n//     get_file_commitment_and_selected_row(\n//       rowTitlesU64,\n//       rowContentU64,\n//       rowSelector\n//     );\n//   const fileCommitmentHex = convertLEBitsToHex(fileCommitmentInBits);\n//   const selectedRowHex = convertLEBitsToHex(selectedRowInBits);\n\n//   const proof = generate_proof(rowTitlesU64, rowContentU64, rowSelector); // [u8]\n\n//   const fileCommitmentU64 = convertSha256HexToU64(fileCommitmentHex);\n//   const selectedRowU64 = convertSha256HexToU64(selectedRowHex);\n//   const verifyResult = verify_correct_selector(\n//     fileCommitmentU64,\n//     selectedRowU64,\n//     proof\n//   );\n// };\n\n// const convertSha256HexToU64 = (hash) => {\n//   if (hash.startsWith(\"0x\")) {\n//     hash = hash.slice(2);\n//   }\n\n//   let res = [];\n//   const partLength = 256 / 4;\n\n//   for (let i = 0; i < 4; i++) {\n//     let currentWord = hash.slice(i * partLength, (i + 1) * partLength);\n//     let x = parseInt(currentWord, 16);\n//     res.push(x);\n//   }\n\n//   return res;\n// };\n\n// const convertLEBitsToHex = (bitArray) => {\n//   let totalLength = bitArray.length;\n\n//   let hexString = \"\";\n//   const bitsInHex = 4;\n\n//   const currentCount = 0;\n//   for (let i = 0; i < totalLength; i++) {\n//     const powerOf = i % bitsInHex;\n//     currentCount += bitArray[i] ** powerOf;\n\n//     if (powerOf == bitsInHex - 1) {\n//       const hexChar = currentCount.toString(16);\n//       hexString.concat(hexChar);\n\n//       currentCount = 0;\n//     }\n//   }\n\n//   return hexString;\n// };\n\n// run();\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

}]);