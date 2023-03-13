/**
 * @file RequestMiddleware.ts
 * @author Liangxiaojun
 */

// Action Types
import {CALL_API, CALL_API_PARAMS, CALL_API_SUCCESS, CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

// Types
import {Middleware} from 'vivy';

/**
 * Default check respopnse status callback
 * @param response
 */
function defaultCheckResponseStatus(response: Response): boolean {
    return response.status >= 200 && response.status < 300;
}

/**
 * Create RequestMiddleware
 * @param apiStatusModelNameSpace
 * @param checkResponseStatus
 * @param beforeRequest
 * @param onRequest
 * @param onResponse
 * @param onError
 */
export default function createRequestMiddleware(
    apiStatusModelNameSpace: string, checkResponseStatus: (response: Response | any) => boolean,
    beforeRequest?: Middleware, onRequest?: Middleware, onResponse?: Middleware, onError?: Middleware
): Middleware {
    return ({dispatch, getState}) => next => async action => {

        const options = action[CALL_API];

        // Not an api action
        if (typeof options === 'undefined') {
            return next(action);
        }

        const {[CALL_API_PARAMS]: callApiParams, api, params, ...restOptions} = options;
        const {nameSpace, apiActionName, types} = callApiParams;
        const [requestType, successType, failureType] = types;

        // Do request action
        next({
            ...restOptions,
            type: requestType,
            nameSpace,
            apiActionName,
            api,
            params
        });
        dispatch({
            type: `${apiStatusModelNameSpace}/request`,
            nameSpace,
            apiActionName
        });

        /**
         * Handle plugin hook.
         * @param hook
         * @param hookAction
         */
        function handleHook(hook?: Middleware, hookAction?: object) {
            if (hook && typeof hook === 'function') {
                return hook({dispatch, getState})(next)({
                    ...restOptions,
                    nameSpace,
                    apiActionName,
                    api,
                    params,
                    ...hookAction
                });
            }
        }

        /**
         * Handle seccess response
         * @param response
         */
        function handleSuccessResponse(response: Response | any) {
            next({
                type: CALL_API_SUCCESS,
                [CALL_API_SUCCESS]: {
                    ...restOptions,
                    type: successType,
                    nameSpace,
                    apiActionName,
                    api,
                    params,
                    response
                }
            });
            dispatch({
                type: `${apiStatusModelNameSpace}/success`,
                nameSpace,
                apiActionName
            });
        }

        /**
         * Handle failure response
         * @param response
         * @param error
         */
        function handleFailureResponse(response: Response | any, error?: Error) {
            next({
                type: CALL_API_FAILURE,
                [CALL_API_FAILURE]: {
                    ...restOptions,
                    type: failureType,
                    nameSpace,
                    apiActionName,
                    api,
                    params,
                    response,
                    error
                }
            });
            dispatch({
                type: `${apiStatusModelNameSpace}/failure`,
                nameSpace,
                apiActionName
            });
        }

        /**
         * Handle seccess / failure response
         * @param response
         * @param error
         */
        function handleResponse(response: Response | any, error?: Error) {

            if (error) {
                return handleFailureResponse(response, error);
            }

            if (
                checkResponseStatus && typeof checkResponseStatus === 'function' ?
                    checkResponseStatus(response)
                    :
                    defaultCheckResponseStatus(response)
            ) {
                handleSuccessResponse(response);
            } else {
                handleFailureResponse(response, error);
            }

        }

        try {

            // Call beforeRequest
            if (handleHook(beforeRequest) === false) {
                return;
            }

            // Call onRequest
            handleHook(onRequest);

            // Call api and get response
            const response = await api({
                ...restOptions,
                params
            });

            // Call onResponse
            handleHook(onResponse, {
                response
            });

            // Handle response
            handleResponse(response);

        } catch (error: any) {

            // Call onResponse when error
            handleHook(onResponse, {
                response: error?.response,
                error
            });

            // Call onResponse when error
            handleHook(onError, {
                error
            });

            // Handle response when error
            handleResponse(error?.response, error);

        }

    };
}
