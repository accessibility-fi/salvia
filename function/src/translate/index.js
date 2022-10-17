var { translateReport } = require('@qualweb/locale');

module.exports = function (context, req) {

    const locale = req.query.locale || "en";
    const id = req.query.id;

    context.log("Qualweb translate:" + JSON.stringify({ locale: locale, reportId: id }));

    try {

        const reports = context.bindings.jsonBlob //{url1: { }, url2: {}}

        
        let translatedReport = {};

        if (locale !== "en") {
            //iterate through all urls
            Object.keys(reports).map(url => {
                const translated = translateReport(reports[url], locale);
                //remove unnecessary dom element
                translated.system.page.dom = {};
                translatedReport[url] = translated;
            });
        }


        context.res = {
            headers: {
                "content-type": "application/json"
            },
            body: { data: locale === "en" ? reports: translatedReport }
        };


    } catch (error) {
        context.log("translateQualwebReporError:" + error.message);
        throw error;
    }

    context.done()
}
