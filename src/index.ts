/**
 * @file index.ts
 * @author Liangxiaojun
 */

// Models
import createApiStatus from './models/apiStatus';

// Middlewares
import createRequestMiddleware from './middlewares/RequestMiddleware';
import createSuccessResponseMiddleware from './middlewares/SuccessResponseMiddleware';
import createFailureResponseMiddleware from './middlewares/FailureResponseMiddleware';

// Statics
import {ApiStatus} from './statics/ApiStatus';
import {CALL_API, CALL_API_PARAMS} from './actionTypes/CallApiActionType';

// Vendors
import {isEmptyObject} from './util/Util';
import {useSelector} from 'react-vivy';

// Types
import {VivyApiPluginOption, VivyApiFunction, VivyApiMapObject, ApiAction} from './types';
import {VivyPlugin, VivyStoreDispatchAction} from 'vivy';
import {Dispatcher} from 'react-vivy';

/**
 * Default vivy-api options
 */
const DEFAULT_OPTIONS = {
    apiStatusModelNameSpace: 'apiStatus',
    checkResponseStatus: (response: Response) => response.status >= 200 && response.status < 300
};

let optionApiStatusModelNameSpace: string;

export {ApiStatus} from './statics/ApiStatus';
export * from './types';

/**
 * A hook to access the apis status.
 * @param arg
 */
export function useApiStatus(arg: string | ((state: any) => any)): string | undefined {

    const apiStatuses = useSelector(state => state?.[optionApiStatusModelNameSpace]);

    if (typeof arg === 'string') {

        if (arg?.includes('/')) {
            const result = arg?.split?.('/');
            if (result) {
                const [nameSpace, apiName] = result;
                return apiStatuses?.[nameSpace]?.[apiName];
            }
        }

        return apiStatuses?.[arg];

    }

    if (typeof arg === 'function') {
        return arg(apiStatuses);
    }

    return;

}

/**
 * A hook to access whether the apis status is request.
 * @param arg
 */
export function useIsApiRequest(arg: string | ((state: any) => any)): boolean {
    return useApiStatus(arg) === ApiStatus.REQUEST;
}

/**
 * A hook to access whether the apis status is success.
 * @param arg
 * @returns {boolean}
 */
export function useIsApiSuccess(arg: string | ((state: any) => any)): boolean {
    return useApiStatus(arg) === ApiStatus.SUCCESS;
}

/**
 * A hook to access whether the apis status is failure.
 * @param arg
 * @returns {boolean}
 */
export function useIsApiFailure(arg: string | ((state: any) => any)): boolean {
    return useApiStatus(arg) === ApiStatus.FAILURE;
}

/**
 * A hook to access the apis status.
 * @param api
 */
export function useStatus(api: Dispatcher): string | undefined {
    return api?.getStatus?.();
}

/**
 * A hook to access whether the apis status is request.
 * @param api
 */
export function useIsRequest(api: Dispatcher): boolean {
    return api?.isRequest?.();
}

/**
 * A hook to access whether the apis status is success.
 * @param api
 */
export function useIsSuccess(api: Dispatcher): boolean {
    return api?.isSuccess?.();
}

/**
 * A hook to access whether the apis status is failure.
 * @param api
 */
export function useIsFailure(api: Dispatcher): boolean {
    return api?.isFailure?.();
}

/**
 * Create Vivy api plugin
 * @param options
 * @constructor
 */
export default function VivyApi(options: VivyApiPluginOption = {}): VivyPlugin {

    const opts = {...DEFAULT_OPTIONS, ...options};

    const {
        apiStatusModelNameSpace,
        checkResponseStatus, checkCanceledResponse,
        responseHandler, successResponseHandler, failureResponseHandler,
        beforeRequest, onRequest,
        onResponse, onError,
    } = opts;

    optionApiStatusModelNameSpace = apiStatusModelNameSpace;

    return {
        extraMiddlewares: [
            createRequestMiddleware(
                apiStatusModelNameSpace, checkResponseStatus, checkCanceledResponse,
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
                store.dispatch[nameSpace] = <VivyStoreDispatchAction>{};
            }

            /**
             * Dispatch an api action
             * @param nameSpace
             * @param apiActionName
             */
            const getDispatchApi = (nameSpace: string, apiActionName: string) => (apiAction: ApiAction) => store.dispatch({
                type: CALL_API,
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
            Object.entries(apis as VivyApiMapObject).forEach(([apiActionName, api]) => {

                const apiActionFn: VivyApiFunction = (params = {}) =>
                    api(params)(getDispatchApi(nameSpace, apiActionName), store.dispatch, store.getState);

                apiActionFn.getStatus = () => useApiStatus(`${nameSpace}/${apiActionName}`);
                apiActionFn.isRequest = () => useIsApiRequest(`${nameSpace}/${apiActionName}`);
                apiActionFn.isSuccess = () => useIsApiSuccess(`${nameSpace}/${apiActionName}`);
                apiActionFn.isFailure = () => useIsApiFailure(`${nameSpace}/${apiActionName}`);

                store.modelActions[nameSpace][apiActionName]
                    = store.dispatch[nameSpace][apiActionName]
                    = apiActionFn;

                store.dispatch[apiStatusModelNameSpace].init({
                    nameSpace,
                    apiActionName
                });

            });

        }
    };

}
