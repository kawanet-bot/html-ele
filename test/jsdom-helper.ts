import {after, describe} from "node:test"

const documentNotExist = ("undefined" === typeof document)

// The short-circuit keeps the bare `process` reference from being
// evaluated in browsers, where document exists and process may not.
export const skipDomTests = documentNotExist && !!process.env.NO_JSDOM

const DESCRIBE = skipDomTests ? describe.skip : describe

const setup = async () => {
    if (documentNotExist && !skipDomTests) {
        const {JSDOM} = await import("jsdom")
        if (!globalThis.document) {
            globalThis.document = new JSDOM().window.document
        }
    }
}

// node:test starts a before() hook but does not wait for it before building
// suites, so a suite that needs the DOM while it is being built has to wait
// here instead.
export const describeWithDOM = (title: string, fn: () => void | Promise<void>) => {
    setup().then(() => DESCRIBE(title, fn))
}

after(() => {
    if (documentNotExist && !skipDomTests) {
        delete (globalThis as {document?: Document}).document
    }
})
