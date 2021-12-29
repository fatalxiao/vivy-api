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
 * @type {{checkResponseStatus: (function(*)), apiStatusModelNameSpace: string}}
 */
const DEFAULT_OPTIONS = {
    apiStatusModelNameSpace: 'apiStatus',
    checkResponseStatus: response => response.status >= 200 && response.status < 300
};

/**
 * Create Vivy api plugin
 * @param options {Object}
 * @returns {{onRegisterModel: onRegisterModel, extraModels: ({}|*)[], extraMiddlewares: ((function({dispatch?: *, getState?: *}): function(*): function(*=): *)|*|(function({dispatch: *}): function(*): function(*=): Promise<*|undefined>)|(function({dispatch: *, getState: *}): function(*=): function(*=): *))[]}}
 */
export default function VivyApi(options = {}) {

    const opts = {...DEFAULT_OPTIONS, ...options};

    const {
        apiStatusModelNameSpace,
        beforeRequest, onRequest, onResponse,
        checkResponseStatus, successResponseHandler, failureResponseHandler
    } = opts;

    // Create ModelApiActionMiddleware
    const ModelApiActionMiddleware = createModelApiActionMiddleware();

    return {
        extraMiddlewares: [
            ModelApiActionMiddleware,
            createRequestMiddleware(
                apiStatusModelNameSpace, checkResponseStatus,
                beforeRequest, onRequest, onResponse
            ),
            createSuccessResponseMiddleware(successResponseHandler),
            createFailureResponseMiddleware(failureResponseHandler)
        ],
        extraModels: [
            createApiStatus(apiStatusModelNameSpace)
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
