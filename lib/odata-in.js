const { GetQueries } = require('../helpers/resolvers');

module.exports = function (RED) {
    function odataIn(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.model = null;
        this.schema = null;
        if(config.edm){
            var edm = RED.nodes.getNode(config.edm);
            this.schema = edm.schema
            this.model = edm.model;
        }
        this.on('input', function (msg) {
            info = {
                body: msg.req.body,
                data_model:  msg.model ? msg.model: this.model,
                method: msg.req.method,
                headers: msg.req.headers,
                query_params: msg.req.query,
                original_url: decodeURI(msg.req.url),
                resource_path: decodeURI(msg.req._parsedUrl.pathname),
                schema: this.schema ? this.schema : ''
            };
            resource_path = info.resource_path.split('/');
            entity = resource_path[2]
            if (entity === '$metadata' || entity === '') {
                msg.requested = 'metadata'
            }
            if (entity.includes("(") && entity.includes(")")) {
                entity_with_param = entity
                entity_with_param = entity_with_param.substring(0, entity_with_param.length - 1);
                entity_with_param = entity_with_param.split('(');
                entity = entity_with_param[0]
            }
            msg.odataEntity = entity
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