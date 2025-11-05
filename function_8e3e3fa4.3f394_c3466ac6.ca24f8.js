// Retrieve original HTTP response object from global
const resObj = context.global.get(msg._msgid + 'res');

if (resObj && resObj.res) {
    // Build HTTP success response
    resObj.res.status(200).send({
        status: "success",
        message: "AI Agent Workflow initialized successfully and ready!"
    });
}

// Stop flow after sending response
return null;
