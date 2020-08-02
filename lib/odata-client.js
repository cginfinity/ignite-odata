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
                querytop: config.querytop,
                queryskip: config.queryskip,
                queryfilter: config.queryfilter,
                queryorderby: config.queryorderby,
                queryselect: config.queryselect,
                reqbody: msg.payload,
                reqheaders: msg.headers
            }
            client(clientInfo)
                .then(response => {
                    msg.payload = response
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata client", odataClient);
};