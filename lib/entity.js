module.exports = function (RED) {
    "use strict";

    function SwitchNode(n) {
        RED.nodes.createNode(this, n);
        this.rules = n.rules;
        this.name = n.name;
        this.key = n.key;
        this.model = getmodel(n.name, n.rules, n.key);

        this.on('input', function (msg) {

        });

        this.on('close', function () {

        });
        function getmodel(name, rules, key) {
            var model = {

            };
            for (var i = 0; i < rules.length; i++) {
                model[rules[i].v] = {
                    "type": rules[i].t,
                    "key": rules[i].v == key
                };
            }
            return model;
        }
    }

    RED.nodes.registerType("entity", SwitchNode);
}
