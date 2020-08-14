module.exports = function (RED) {

    function edmNode(n) {
        RED.nodes.createNode(this,n);
        this.namespace = n.namespace;
        this.model = getmodel(n);
        this.on("input",function(msg) {
            this.send(msg);
        });
        function getmodel(namespace){
            var model = [];
            for(var i = 1;i<= 20;i++){
                if(n["model"+i]){
                    model.push(n["model"+i]);
                }
            }
            var modeldef = {
                namespace: n.namespace,
                entityTypes: {
                    
                },
                entitySets:{

                }
            };
            model.forEach(element => {
                var entity = RED.nodes.getNode(element);
                if(entity){
                    modeldef.entityTypes[entity.name] =  entity.model;
                    modeldef.entitySets[entity.name]  = {
                        "entityType": n.namespace + "." + entity.name
                    };
                }
            });
            return modeldef;
        }
    }
    RED.nodes.registerType("edm",edmNode);
};