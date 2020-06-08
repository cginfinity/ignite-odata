const { GetResponse } = require('../helpers/response');

module.exports = function (RED) {
    function odataOut(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        var node = this;

        this.on('input', function (msg) {

            GetResponse()
                .then(response => {
                    msg.payload.data = response
                    node.send(msg)
                });
        });
    }
    RED.nodes.registerType("odata out", odataOut);
};