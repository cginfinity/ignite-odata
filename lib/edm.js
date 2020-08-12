module.exports = function (RED) {

    function edmNode(n) {
        RED.nodes.createNode(this,n);
        this.namespace = n.namespace;
        this.scope = n.scope;
        this.model = getmodel(n.namespace,n.scope);
        this.on("input",function(msg) {
            this.send(msg);
        });
        function getmodel(namespace, scope){
            var model = {
                namespace: namespace,
                entityTypes: {
                    
                },
                entitySets:{

                }
            };
            scope.forEach(element => {
                var entity = RED.nodes.getNode(element);
                if(entity){
                    model.entityTypes[entity.name] =  entity.model;
                    model.entitySets[entity.name]  = {
                        "entityType": namespace + "." + entity.name
                    };
                }
            });
            return model;
        }
    }
    RED.nodes.registerType("edm",edmNode);
};