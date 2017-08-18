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
                let requestTemplates = this.serverless.service.custom.globalTemplates.request ? this.serverless.service.custom.globalTemplates.request.template : null;
                let responseTemplates = this.serverless.service.custom.globalTemplates.response ? this.serverless.service.custom.globalTemplates.response.template : null;
                let responseStatusCodes = this.serverless.service.custom.globalTemplates.response ? this.serverless.service.custom.globalTemplates.response.statusCodes : null;

                let functions = this.serverless.service.functions;
                if (functions) {
                    this.iterateProperties(functions, (fnKey, fn) => {
                        if (fn.events && fn.events.length > 0) {
                            fn.events.forEach((event) => {
                                this.iterateProperties(event, (evKey, event) => {
                                    if (evKey === 'http') {
                                        if (event.request && event.request.template){
                                            // user defined, ignore
                                        } else if (requestTemplates) {
                                            if (!event.request){
                                                event.request = {};
                                            }
                                            event.request.template = requestTemplates;
                                        }

                                        if (event.response && event.response.template){
                                            // user defined, ignore
                                        } else if (responseTemplates) {
                                            if (!event.response){
                                                event.response = {};
                                            }
                                            event.response.template = responseTemplates;
                                        }

                                        if (event.response && event.response.statusCodes){
                                            // user defined, ignore
                                        } else if (responseStatusCodes) {
                                            if (!event.response){
                                                event.response = {};
                                            }
                                            event.response.statusCodes = responseStatusCodes;
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            }
        } catch (e) {
            console.log('serverless-global-templates error: ' + e);
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