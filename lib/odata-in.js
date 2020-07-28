const { GetQueries } = require('../helpers/resolvers');

module.exports = function (RED) {
    function odataIn(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            info = {
                body: msg.req.body,
                data_model: msg.model,
                method: msg.req.method,
                headers: msg.req.headers,
                query_params: msg.req.query,
                original_url: decodeURI(msg.req.url),
                resource_path: decodeURI(msg.req._parsedUrl.pathname)
            };
            resource_path = decodeURI(msg.req._parsedUrl.pathname).split('/');
            entity = resource_path[2]
            if (entity === '$metadata' || entity === '') {
                msg.requested = 'metadata'
            }
            GetQueries(info)
                .then(queries => {
                    msg.provider = "ignite-odata"
                    msg.payload = queries
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata in", odataIn);
};