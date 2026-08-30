import {after, before} from "node:test"

const documentNotExist = ("undefined" === typeof document)

// The short-circuit keeps the bare `process` reference from being
// evaluated in browsers, where document exists and process may not.
export const skipDomTests = documentNotExist && !!process.env.NO_JSDOM

before(async () => {
    if (documentNotExist && !skipDomTests) {
        const {JSDOM} = await import("jsdom")
        globalThis.document = new JSDOM().window.document
    }
})

after(() => {
    if (documentNotExist && !skipDomTests) {
        delete (globalThis as {document?: Document}).document
    }
})
