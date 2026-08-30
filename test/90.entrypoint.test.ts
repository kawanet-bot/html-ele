import type * as declared from "html-ele"
import {strict as assert} from "node:assert"
import {createRequire} from "node:module"
import {test} from "node:test"
import * as m from "../src/index.ts"

const require = createRequire(import.meta.url)

// tsc fails here when a name declared in the published .d.ts is missing
// from the runtime entry -- the surface check derives from the declarations.
const runtime: typeof declared = m
void runtime

test("import entry (.mjs)", () => {
    assert.equal(typeof m.ele, "function")
    assert.equal(typeof m.ELE, "function")
    assert.equal(typeof m.HTML, "function")
    assert.equal(typeof m.EN, "function")
})

test("require entry (.cjs)", () => {
    const m = require("html-ele")
    assert.equal(typeof m.ele, "function")
})

test("minified entry (.min.js)", () => {
    const cjs = require.resolve("html-ele")
    const m = require(cjs.replace(/\.cjs$/, ".min.js"))
    assert.equal(typeof m.ele, "function")
})
