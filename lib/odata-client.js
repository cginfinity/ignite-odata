const { client } = require('../helpers/odataClient');

module.exports = function (RED) {
    function odataClient(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            clientInfo = {
                method: config.method,
                rootURL: config.rootURL,
                resource: config.resource,
                reqbody: msg.payload,
                reqheaders: msg.headers
            }
            queryParams = {
                $top: config.querytop,
                $skip: config.queryskip,
                $filter: config.queryfilter,
                $orderby: config.queryorderby,
                $select: config.queryselect,
            }
            client(clientInfo, queryParams)
                .then(response => {
                    msg.payload = response
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata client", odataClient);
};