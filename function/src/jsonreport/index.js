
module.exports = function (context, req) {

    const id = req.query.id;
  

    context.log("getQualwebReport id:" + id);

      try {

        context.res = {
            headers: {
                "content-type": "application/json"
            },
            body: { data: context.bindings.jsonBlob }
        };

      } catch (error) {

            context.log.error("getQualwebReportError:" + error.message);
            throw error;
     }

    context.done()
}
