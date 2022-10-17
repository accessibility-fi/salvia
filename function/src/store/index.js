
module.exports =  function (context, req) {

    const report = req.body.report;
    const id = req.body.id;

    context.log("Store report:" + id);


    try {

        context.bindings.jsonBlob = report

        context.res = {
            headers: {
                "content-type": "application/json"
            },
            body: { 'id': id }
        }

        context.done()


    } catch (error) {
        context.log.error("storeReporrtError:" + error.message);
        throw error;
    }
       
}
