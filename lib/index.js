const { GetQueries } = require('../helpers/resolvers');
const { GetResponse } = require('../helpers/response');

module.exports = function (RED) {
    function odataIn(config) {
        RED.nodes.createNode(this, config);
        // this.name = config.name;
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
            GetQueries(info)
                .then(queries => {
                    msg.provider = "ignite-odata"
                    msg.payload.queries = queries
                    // msg.payload.info = info
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata in", odataIn);

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
            data= msg.payload
            GetResponse(info, data)
                .then(response => {
                    msg.payload = response
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata out", odataOut);
};