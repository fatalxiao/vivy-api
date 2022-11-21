/**
 * @file SuccessResponseMiddleware.js
 */

// Action Types
import {CALL_API_SUCCESS} from '../actionTypes/CallApiActionType';

/**
 * Create SuccessResponseMiddleware
 * @param responseHandler {Function}
 * @param successResponseHandler {Function}
 * @returns {function({dispatch: *, getState: *}): function(*=): function(*=): (*)}
 */
export default function createSuccessResponseMiddleware(responseHandler, successResponseHandler) {
    return ({dispatch, getState}) => next => action => {
        if (action?.hasOwnProperty(CALL_API_SUCCESS)) {

            const nextAction = action[CALL_API_SUCCESS];

            if (responseHandler && typeof responseHandler === 'function') {
                responseHandler({dispatch, getState})(next)(nextAction);
            }

            if (successResponseHandler && typeof successResponseHandler === 'function') {
                successResponseHandler({dispatch, getState})(next)(nextAction);
            }

        } else {
            next(action);
        }
    };
}
