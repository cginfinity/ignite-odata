const { GetResponse } = require('../helpers/response');
const { GetMetadata } = require('../helpers/metadata');

module.exports = function (RED) {
    function odataOut(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            if (msg.requested === 'metadata') {
                msg.payload = GetMetadata(msg.model)
                node.send(msg)
            } else {
                info = {
                    complete_url: msg.req.url,
                    original_url: decodeURI(msg.req.url),
                    method: msg.req.method,
                    resource_path: decodeURI(msg.req._parsedUrl.pathname),
                    query_params: msg.req.query,
                    body: msg.req.body
                };
                if (msg.req.method == "GET") {
                    GetResponse(info, msg.payload)
                        .then(response => {
                            msg.payload = response;
                            node.send(msg)
                        });
                } else {
                    msg.payload = {};
                    node.send(msg)
                }
                // node.send(msg)
            }
        });
    }
    RED.nodes.registerType("odata out", odataOut);
};