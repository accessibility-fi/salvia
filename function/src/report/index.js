var fetch = require('node-fetch');
const https = require('https');

module.exports = async function (context, req) {

    const report = req.body.report;
    const domain = req.body.domain;
    const user = req.body.user;
    const viewport = req.body.viewport;
    const id = req.body.id;

    //save report to storage
    context.bindings.jsonBlob = report;

    const salviaAPI = process.env.SALVIA_API_URL + '/api/testcases';

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    context.log("saveQualwebReport domain:" + domain + " id:" + id);

    const body = {
        domain: domain,
        viewport: viewport,
        report: { data: report, reportId: id }//temporary send both to API, data  and id
    }

    // add user to request if not empty
    if (Object.keys(user).length > 0) body.user = user;

    try {
       
        const response = await fetch(salviaAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            agent: httpsAgent
        });

        context.log('saveQualwebReport status code:', response.status);

       const data = await response.json();

        if (!response.ok) throw new Error("Failed to save report:" + JSON.stringify(data));

        context.log("saveQualwebReport:" + JSON.stringify(data));

        context.res = {
            headers: {
                "content-type": "application/json"
            },
            body: {data: data}
        };
    

    } catch (error) {
        context.log("saveQualwebReporError:" + error.message);
        throw error;
    }
       
}
