/**
 * @file index.js
 */

// Models
import createApiStatus from './models/apiStatus';

// Middlewares
import createRequestMiddleware from './middlewares/RequestMiddleware';
import createSuccessResponseMiddleware from './middlewares/SuccessResponseMiddleware';
import createFailureResponseMiddleware from './middlewares/FailureResponseMiddleware';

// Statics
export ApiStatus from './statics/ApiStatus';
import {CALL_API, CALL_API_PARAMS} from './actionTypes/CallApiActionType';

// Vendors
import {isEmptyObject} from './util/Util';

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

    return {
        extraMiddlewares: [
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
        onRegisterModel: (model, store) => {

            if (!model || !store) {
                return;
            }

            const {nameSpace, apis} = model;

            if (!apis || isEmptyObject(apis)) {
                return;
            }

            if (!store.modelActions[nameSpace]) {
                store.modelActions[nameSpace] = {};
            }

            /**
             * Dispatch an api action
             * @param type {string}
             * @returns {(function(*): void)|*}
             */
            const dispatchApi = type => apiAction => {

                const [nameSpace, apiActionName] = type.split('/');

                store.dispatch({
                    [CALL_API]: {
                        ...apiAction,
                        [CALL_API_PARAMS]: {
                            nameSpace,
                            apiActionName,
                            types: [
                                `${type}Request`,
                                `${type}Success`,
                                `${type}Failure`
                            ]
                        }
                    }
                });

            };

            // Register Redux actions
            Object.entries(apis).forEach(([name, api]) => {
                store.modelActions[nameSpace][name] = store.dispatch[nameSpace][name] = params =>
                    api(params)(dispatchApi, store.dispatch, store.getState);
            });

        }
    };

}
