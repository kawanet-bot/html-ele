import {ele} from "html-ele"
import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import "./jsdom-helper.ts"

describe("HTMLHtmlElement", () => {
    /**
     * As <html> element is the root element of HTML document,
     * it needs a special treatment when parsing.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html
     */
    it(`<html>`, () => {
        const HTML = ele("html")

        // language=HTML
        const node = (HTML`
            <html lang="ja" data-foo data-bar="Bar" data-buz="Buz" class="bar buz">
            <body>
            Hello, Velem!
            </body>
            </html>
        `)

        assert.equal(node.tagName, "HTML")
        assert.equal(node.getAttribute("lang"), "ja")
        assert.equal(node.getAttribute("not-found"), null)
        assert.equal(node.dataset.foo, "")
        assert.equal(node.dataset.bar, "Bar")
        assert.equal(node.classList.contains("bar"), true)
        assert.equal(node.querySelector("body")?.tagName, "BODY")
    })

    it(`<head>`, () => {
        const HEAD = ele("head")

        // language=HTML
        const node = (HEAD`
            <head class="foo"></head>
        `)

        assert.equal(node.tagName, "HEAD")
        assert.equal(node.className, "foo")
        assert.equal(node.outerHTML, `<head class="foo"></head>`)
        assert.equal(node.childElementCount, 0)
    })

    it(`<body>`, () => {
        const BODY = ele("body")

        // language=HTML
        const node = (BODY`
            <body class="bar"></body>
        `)

        assert.equal(node.tagName, "BODY")
        assert.equal(node.className, "bar")
        assert.equal(node.outerHTML, `<body class="bar"></body>`)
        assert.equal(node.childElementCount, 0)
    })

    /**
     * The fallback parser re-parses the raw attribute string with a probe tag.
     * Values written without quotes must survive that round trip unchanged.
     *
     * @see https://github.com/kawanet/html-ele/issues/16
     */
    it(`unquoted attribute values`, () => {
        const HTML = ele("html")

        // language=HTML
        const node = (HTML`<html lang=ja data-bar="Bar" class=foo><body>Hello</body></html>`)

        assert.equal(node.getAttribute("lang"), "ja")
        assert.equal(node.getAttribute("data-bar"), "Bar")
        assert.equal(node.getAttribute("class"), "foo")
    })

    it(`empty attribute value`, () => {
        const BODY = ele("body")

        // language=HTML
        const node = (BODY`<body class=bar data-empty=></body>`)

        assert.equal(node.getAttribute("data-empty"), "")
        assert.equal(node.outerHTML, `<body class="bar" data-empty=""></body>`)
    })

    it(`slash inside an unquoted attribute value`, () => {
        const BODY = ele("body")

        // language=HTML
        const node = (BODY`<body background=/img/bg.png data-u=http://e.com/a>Hello</body>`)

        assert.equal(node.getAttribute("background"), "/img/bg.png")
        assert.equal(node.getAttribute("data-u"), "http://e.com/a")
        assert.equal(node.textContent, "Hello")
    })

    /**
     * A "/" is an ordinary character within an attribute value, and a self-closing
     * marker anywhere else in the tag, where the HTML parser drops it.
     */
    it(`trailing slash in the source tag`, () => {
        const BODY = ele("body")

        // language=HTML
        assert.equal((BODY`<body class="a"/>`).outerHTML, `<body class="a"></body>`)
        // language=HTML
        assert.equal((BODY`<body class=a/>`).outerHTML, `<body class="a/"></body>`)
        // language=HTML
        assert.equal((BODY`<body data-x=/>`).outerHTML, `<body data-x="/"></body>`)
    })

    /**
     * The closing tag of <head> and <body> is optional in HTML, so the fallback
     * parser accepts the shorthand and keeps whatever follows as the content.
     */
    it(`omitted closing tag`, () => {
        const BODY = ele("body")

        // language=HTML
        assert.equal((BODY`<body class=a>Hello`).outerHTML, `<body class="a">Hello</body>`)

        const HEAD = ele("head")

        // language=HTML
        assert.equal((HEAD`<head><title>T</title>`).outerHTML, `<head><title>T</title></head>`)
    })
})
