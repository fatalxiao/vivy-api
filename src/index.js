/**
 * @file index.js
 */

// Models
import createApiStatus from './models/apiStatus';

// Middlewares
import createModelApiActionMiddleware from './middlewares/ModelApiActionMiddleware';
import createRequestMiddleware from './middlewares/RequestMiddleware';
import createSuccessResponseMiddleware from './middlewares/SuccessResponseMiddleware';
import createFailureResponseMiddleware from './middlewares/FailureResponseMiddleware';

// Statics
export ApiStatus from './statics/ApiStatus';

/**
 * Create Vivy api plugin
 * @param options
 * @returns {{}}
 */
export default function createVivyApiPlugin(options = {}) {

    const {
        modelNameSpace,
        checkResponseStatus, successResponseHandler, failureResponseHandler
    } = options;

    // Create ModelApiActionMiddleware
    const ModelApiActionMiddleware = createModelApiActionMiddleware();

    return {
        extraMiddlewares: [
            ModelApiActionMiddleware,
            createRequestMiddleware(modelNameSpace, options?.checkResponseStatus),
            createSuccessResponseMiddleware(options?.successResponseHandler),
            createFailureResponseMiddleware(options?.failureResponseHandler)
        ],
        extraModels: [
            createApiStatus(modelNameSpace)
        ],
        onRegisterModel: model => {

            const {nameSpace, apis} = model;

            // Register api actions
            if (apis) {
                ModelApiActionMiddleware.register(nameSpace, apis || {});
            }

        }
    };

};
