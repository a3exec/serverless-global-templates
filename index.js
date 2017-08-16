'use strict';

class Plugin {
    iterateProperties(objectToIterate, eachFunction) {
        let keys = Object.keys(objectToIterate);
        keys.forEach(function (key) {
            eachFunction(key, objectToIterate[key]);
        });
    }

    assignRequestTemplate() {
        try {
            let globalTemplates = this.serverless.service.custom.globalTemplates;
            if (globalTemplates) {
                let requestTemplates = this.serverless.service.custom.globalTemplates.request;
                let functions = this.serverless.service.functions;

                if (functions) {
                    this.iterateProperties(functions, (fnKey, fn) => {
                        if (fn.events && fn.events.length > 0) {
                            fn.events.forEach((event) => {
                                this.iterateProperties(event, (evKey, event) => {
                                    event.request.template = requestTemplates;
                                });
                            });
                        }
                    });
                }
            }
        } catch (e) {
            // ignore
        }
    }

    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        this.hooks = {
            'webpack:compile': this.assignRequestTemplate.bind(this),
            'webpack:validate': this.assignRequestTemplate.bind(this),
            'before:deploy:createDeploymentArtifacts': this.assignRequestTemplate.bind(this),
            'before:offline:start': this.assignRequestTemplate.bind(this),
            'before:offline:start:init': this.assignRequestTemplate.bind(this)
        }
    }

}

module.exports = Plugin;