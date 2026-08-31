interface Window {
    mochaDone: Promise<number>
}

const {chromium}: typeof import("playwright") = require("playwright")
const {resolve} = require("node:path")
const {pathToFileURL} = require("node:url")

const html = resolve(__dirname, "tests.html")

const run = async () => {
    const browser = await chromium.launch()

    try {
        const page = await browser.newPage()
        const pageErrors: Error[] = []
        page.on("pageerror", (error: Error) => pageErrors.push(error))

        await page.goto(pathToFileURL(html).href)

        const failures = await page.evaluate(async () => await Promise.race([
            window.mochaDone,
            new Promise<number>((_, reject) => setTimeout(
                () => reject(new Error("Mocha did not finish within 60 seconds")),
                60_000,
            )),
        ]))

        if (pageErrors.length) {
            throw new AggregateError(pageErrors, "Browser page errors occurred")
        }
        if (failures) {
            throw new Error(`Mocha reported ${failures} failed test(s)`)
        }
    } finally {
        await browser.close()
    }
}

run().catch(error => {
    console.error(error)
    process.exitCode = 1
})
