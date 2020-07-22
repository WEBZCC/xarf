// Original sourcee: https://github.com/ajv-validator/ajv-istanbul (index.js)
// see ./ajv-istanbul-LICENSE for original LICENSE

// modified to use up to date istanbul intrumenter by Frederik Petersen, fp@abusix.com, 2020

"use strict";

const beautify = require("js-beautify").js_beautify;
const { createInstrumenter } = require("istanbul-lib-instrument");
const instrumenter = createInstrumenter();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const codeDir = "./.ajv_istanbul";

module.exports = function (ajv) {
  fs.mkdirSync(codeDir, { recursive: true });
  compileAddedSchemas(ajv, "_refs");
  compileAddedSchemas(ajv, "_schemas");
  ajv._opts.processCode = instrument;
  return ajv;
};

function compileAddedSchemas(ajv, schemasKey) {
  for (var key in ajv[schemasKey]) ajv.getSchema(key);
}

function instrument(code) {
  var filePath = path.join(codeDir, "schema_gen" + uuidv4() + ".js");
  code = beautify(code, { indent_size: 2 });
  fs.writeFileSync(filePath, code);
  return instrumenter.instrumentSync(code, filePath);
}