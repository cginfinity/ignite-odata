const { GetQueries } = require('../helpers/resolvers');
const { GetEntity } = require('../helpers/functions');

module.exports = function (RED) {
    function odataIn(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.model = null;
        this.schema = null;
        if(config.edm){
            var edm = RED.nodes.getNode(config.edm);
            this.schema = edm.schema;
            this.model = edm.model;
        }
        this.on('input', function (msg) {
            msg.model ? msg.model = msg.model : msg.model = this.model;
            info = {
                body: msg.req.body,
                data_model:  msg.model,
                method: msg.req.method,
                headers: msg.req.headers,
                query_params: msg.req.query,
                original_url: decodeURI(msg.req.url),
                resource_path: decodeURI(msg.req._parsedUrl.pathname),
                schema: this.schema ? this.schema : ''
            };
            resource_path = info.resource_path.split('/');
            entity = resource_path[2];
            if (entity.includes("(") && entity.includes(")")) {
                entity = GetEntity(entity);
            }
            (entity === '$metadata' || entity === '') ? msg.requested = 'metadata' : msg.requested = entity;
            msg.provider = "ignite-odata";
            GetQueries(info)
                .then(queries => {
                    msg.payload = queries
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata in", odataIn);
};