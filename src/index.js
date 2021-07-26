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
 * Default vivy-api options
 * @type {{checkResponseStatus: (function(*)), modelNameSpace: string}}
 */
const DEFAULT_OPTIONS = {
    modelNameSpace: 'apiStatus',
    checkResponseStatus: response => response.status >= 200 && response.status < 300
};

/**
 * Create Vivy api plugin
 * @param options
 * @returns {{}}
 */
export default function createVivyApiPlugin(options = {}) {

    const op = {...DEFAULT_OPTIONS, ...options};

    const {
        modelNameSpace,
        checkResponseStatus, successResponseHandler, failureResponseHandler
    } = op;

    // Create ModelApiActionMiddleware
    const ModelApiActionMiddleware = createModelApiActionMiddleware();

    return {
        extraMiddlewares: [
            ModelApiActionMiddleware,
            createRequestMiddleware(modelNameSpace, checkResponseStatus),
            createSuccessResponseMiddleware(successResponseHandler),
            createFailureResponseMiddleware(failureResponseHandler)
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

}
