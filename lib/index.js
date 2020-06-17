const { GetQueries } = require('../helpers/resolvers');
const { GetResponse } = require('../helpers/response');
const GetMetadata = require('../helpers/metadata');

module.exports = function (RED) {
//Odata in node
    function odataIn(config) {
        RED.nodes.createNode(this, config);
        this.model = config.model;
        this.mdchecked = config.mdchecked;
        var node = this;
        this.on('input', function (msg) {
            info = {
                complete_url: msg.req.url,
                original_url: decodeURI(msg.req.url),
                method: msg.req.method,
                resource_path: decodeURI(msg.req._parsedUrl.pathname),
                query_params: msg.req.query,
                body: msg.req.body
            };
            //isolating service root and entity name
            complete_url =decodeURI(msg.req._parsedUrl.pathname)
            resource_path = complete_url.split('/');
            entity = resource_path[2]

            msg.model = this.model;
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
        var node = this;
        this.on('input', function (msg) {
            info = {
                complete_url: msg.req.url,
                original_url: decodeURI(msg.req.url),
                method: msg.req.method,
                resource_path: decodeURI(msg.req._parsedUrl.pathname),
                query_params: msg.req.query,
                body: msg.req.body
            };
            if (msg.requested === 'metadata') {
               msg.payload = GetMetadata(msg.model)
               node.send(msg)
            } else {
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