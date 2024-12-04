const puppeteer = require("puppeteer")
const { Crawler } = require('@qualweb/crawler')


module.exports = async function (context, req) {
    
    const url = req.query.url
    
    const depth = Number(req.query.depth)
    const width = Number(req.query.width) ?? 20
    const isMobile = req.query.viewport === "mobile"
   
   
    let urls = []

    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: 'new'})

        const viewport = {
            // check https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#pagesetviewportviewport
            "isMobile": isMobile,
            "isLandscape": !isMobile,
            "width": isMobile ? 360 : 1920,
            "height": isMobile ? 800 : 1080,
            
        }

        const crawler = new Crawler(browser, url, viewport)

        const options = {
            maxDepth: depth, // max depth to search, 0 to search only the given domain. Default value = -1 (search everything)
            maxUrls: width, // max urls to find. Default value = -1 (search everything)
            timeout: 30, // how many seconds the domain should be crawled before it ends. Default value = -1 (never stops)
            maxParallelCrawls: 5, // max urls to crawl at the same time. Default value = 5
            logging: true // logs domain, current depth, urls found and time passed to the terminal
        }

        context.log("crawler:" + JSON.stringify({ url: url, depth: depth, width: width, options: options, viewport: viewport }))

        await crawler.crawl(options)

        await browser.close()

        urls = crawler.getResults()
       
        context.log("Crawler results:" + urls)
       

    } catch (error) {
        context.log(error)
        throw error
    }

    context.res = {
        body: { data: urls },
        headers: {
            "content-type": "application/json"
        }
    }
}