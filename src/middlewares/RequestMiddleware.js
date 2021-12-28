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
 * @returns {function({dispatch: *}): function(*): function(*=): Promise<*|undefined>}
 */
export default function createRequestMiddleware(apiStatusModelNameSpace, checkResponseStatus) {
    return ({dispatch}) => next => async action => {

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

            // Call api and get response
            const response = await api({
                ...restOptions,
                params
            });

            handleResponse(response);

        } catch (error) {
            handleResponse(error?.response, error);
        }

    };
}
