const { QualWeb } = require('@qualweb/core')


module.exports = async function (context, req) {

    const domain = req.body.domain
    const urls = req.body.urls
    const viewport = req.body.viewport ?? "desktop"
    const isMobile = viewport === "mobile"
    
    context.log("Start Qualweb evaluation:" + JSON.stringify({ domain: domain, urls: urls, viewport: viewport }))

    const qualweb = new QualWeb()
    try {

        const clusterOptions = {
            maxConcurrency: 3, // Performs several urls evaluations at the same time - the higher the number given, more resources will be used. Default value = 1
            timeout: 120 * 1000, // Timeout for loading page. Default value = 30 seconds
            monitor: false // Displays urls information on the terminal. Default value = false
        };

        // check https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#puppeteerlaunchoptions
        const launchOptions = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],  headless: 'new'
        }
        await qualweb.start(clusterOptions, launchOptions)

        // QualWeb evaluation report

        const qualwebOptions = {
            "urls": urls,
            "log": {
                "console": true
            },
            "viewport": {
                "mobile": isMobile,
                "landscape": !isMobile,
                "resolution": { "width": isMobile ? 360 : 1920, "height": isMobile ? 800 : 1080 }
            },
            "execute": { "act": true, "wcag": false },
            "act-rules": { "levels": ["A", "AA"] }

        }

        context.log("QualWeb started:" + JSON.stringify(qualwebOptions))

        // Evaluates the given options - will only return after all urls have finished evaluating or resulted in an error
        const reports = await qualweb.evaluate(qualwebOptions)

        context.res = {
            headers: {
                "content-type": "application/json"
            },
            body: { data: reports }
        }


    } catch (error) {
        context.log(error)
        
        throw error
    }
    finally {
        // Stops the QualWeb core engine
        await qualweb.stop()
    }
       
}
