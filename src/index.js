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
import {useSelector} from 'react-vivy';

/**
 * Default vivy-api options
 * @type {{checkResponseStatus: (function(*)), apiStatusModelNameSpace: string}}
 */
const DEFAULT_OPTIONS = {
    apiStatusModelNameSpace: 'apiStatus',
    checkResponseStatus: response => response.status >= 200 && response.status < 300
};

let optionApiStatusModelNameSpace;

/**
 * Get apiStatus of api in model
 * @param arg
 * @returns {*}
 */
export function useApiStatus(arg) {

    const apiStatuses = useSelector(state => state[optionApiStatusModelNameSpace]);

    if (typeof arg === 'string') {

        if (arg.includes('/')) {
            const [nameSpace, apiName] = arg.split?.('/');
            return apiStatuses?.[nameSpace]?.[apiName];
        }

        return apiStatuses?.[arg];

    }

    if (typeof arg === 'function') {
        return arg(apiStatuses);
    }

}

/**
 * Create Vivy api plugin
 * @param options
 * @constructor
 */
export default function VivyApi(options = {}) {

    const opts = {...DEFAULT_OPTIONS, ...options};

    const {
        apiStatusModelNameSpace,
        beforeRequest, onRequest, onResponse, onError,
        checkResponseStatus, responseHandler, successResponseHandler, failureResponseHandler
    } = opts;

    optionApiStatusModelNameSpace = apiStatusModelNameSpace;

    return {
        extraMiddlewares: [
            createRequestMiddleware(
                apiStatusModelNameSpace, checkResponseStatus,
                beforeRequest, onRequest, onResponse, onError
            ),
            createSuccessResponseMiddleware(responseHandler, successResponseHandler),
            createFailureResponseMiddleware(responseHandler, failureResponseHandler)
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

            if (!store.dispatch[nameSpace]) {
                store.dispatch[nameSpace] = {};
            }

            /**
             * Dispatch an api action
             * @param nameSpace
             * @param apiActionName
             * @returns {function(*): *}
             */
            const dispatchApi = (nameSpace, apiActionName) => apiAction => store.dispatch({
                [CALL_API]: {
                    ...apiAction,
                    [CALL_API_PARAMS]: {
                        nameSpace,
                        apiActionName,
                        types: [
                            `${nameSpace}/${apiActionName}Request`,
                            `${nameSpace}/${apiActionName}Success`,
                            `${nameSpace}/${apiActionName}Failure`
                        ]
                    }
                }
            });

            // Register Redux actions
            Object.entries(apis).forEach(([apiActionName, api]) => {

                store.modelActions[nameSpace][apiActionName]
                    = store.dispatch[nameSpace][apiActionName]
                    = (params = {}) =>
                    api(params)(dispatchApi(nameSpace, apiActionName), store.dispatch, store.getState);

                store.dispatch[apiStatusModelNameSpace].init({
                    nameSpace,
                    apiActionName
                });

            });

        }
    };

}
