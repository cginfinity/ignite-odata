const { GetQueries } = require('../helpers/resolvers');
const { GetResponse } = require('../helpers/response');
const { GetMetadata } = require('../helpers/metadata');

module.exports = function (RED) {
//Odata in node
    function odataIn(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            info = {
                data_model: msg.model,
                complete_url: msg.req.url,
                original_url: decodeURI(msg.req.url),
                method: msg.req.method,
                resource_path: decodeURI(msg.req._parsedUrl.pathname),
                query_params: msg.req.query,
                body: msg.req.body
            };
            //isolating service root and entity name
            resource_path = decodeURI(msg.req._parsedUrl.pathname).split('/');
            entity = resource_path[2]
            if (entity === '$metadata' || entity === '') {
                msg.requested = 'metadata'
            }
            GetQueries(info)
                .then(queries => {
                    msg.provider = "ignite-odata"
                    msg.payload.queries = queries
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata in", odataIn);
//Odata out node
    function odataOut(config) {
        RED.nodes.createNode(this, config);
        this.modelbox = config.modelbox
        var node = this;
        this.on('input', function (msg) {
            //add logic to checkbox to counter error
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
                GetResponse(info, msg.payload)
                    .then(response => {
                        msg.payload = response
                        node.send(msg)
                    });
            }
        });
    }
    RED.nodes.registerType("odata out", odataOut);
};