/**
 * @file RequestMiddleware.js
 */

// Action Types
import {CALL_API, CALL_API_PARAMS, CALL_API_SUCCESS, CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

/**
 * Default check respopnse status callback
 * @param response {Object}
 * @returns {boolean}
 */
function defaultCheckResponseStatus(response) {
    return response.status >= 200 && response.status < 300;
}

/**
 * Create RequestMiddleware
 * @param apiStatusModelNameSpace {string}
 * @param checkResponseStatus {Function}
 * @param beforeRequest {Function}
 * @param onRequest {Function}
 * @param onResponse {Function}
 * @returns {function({dispatch: *}): function(*): function(*=): Promise<*|undefined>}
 */
export default function createRequestMiddleware(
    apiStatusModelNameSpace, checkResponseStatus,
    beforeRequest, onRequest, onResponse
) {
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
         * @returns {*}
         */
        function handleHook(hook, hookAction) {
            if (hook && typeof hook === 'function') {
                return hook({dispatch, getState})(next)({
                    ...restOptions,
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
        function handleSuccessResponse(response) {
            next({
                [CALL_API_SUCCESS]: {
                    ...restOptions,
                    type: successType,
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
        function handleFailureResponse(response, error) {
            next({
                [CALL_API_FAILURE]: {
                    ...restOptions,
                    type: failureType,
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
        function handleResponse(response, error) {

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

            // Call api and get response
            const response = await api({
                ...restOptions,
                params
            });

            // Call onRequest
            handleHook(onRequest);

            // Call onResponse
            handleHook(onResponse, {
                response
            });

            // Handle response
            handleResponse(response);

        } catch (error) {

            // Call onResponse when error
            handleHook(onResponse, {
                response: error?.response,
                error
            });

            // Handle response when error
            handleResponse(error?.response, error);

        }

    };
}
