const { client } = require('../helpers/client');
const { GetQueryParamString } = require('../helpers/functions');

module.exports = function (RED) {
    function odataClient(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            queryParams = {
                $top: config.querytop,
                $skip: config.queryskip,
                $filter: config.queryfilter,
                $orderby: config.queryorderby,
                $select: config.queryselect,
                $count: config.querycount,
                $search: config.querysearch
            };
            queryParamString = GetQueryParamString(queryParams);
            resourcePath = config.rootURL + config.resource;
            clientInfo = {
                method: config.method,
                reqUrl: msg.reqUrl ? msg.reqUrl : (queryParamString !== '') ? resourcePath + '?' + queryParamString : resourcePath,
                reqbody: msg.payload ? msg.payload : {},
                reqheaders: msg.reqHeaders ? msg.reqHeaders : {}
            }
            client(clientInfo)
                .then(response => {
                    msg.payload = response;
                    node.send(msg);
                });
        });
    }
    RED.nodes.registerType("odata client", odataClient);
};