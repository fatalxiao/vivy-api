/**
 * @file FailureResponseMiddleware.js
 */

// Action Types
import {CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

/**
 * Create FailureResponseMiddleware
 * @param responseHandler {Function}
 * @param failureResponseHandler {Function}
 * @returns {function({dispatch: *, getState: *}): function(*=): function(*=): (*)}
 */
export default function createFailureResponseMiddleware(responseHandler, failureResponseHandler) {
    return ({dispatch, getState}) => next => action => {
        if (action?.hasOwnProperty(CALL_API_FAILURE)) {

            const nextAction = action[CALL_API_FAILURE];

            if (responseHandler && typeof responseHandler === 'function') {
                responseHandler({dispatch, getState})(next)(nextAction);
            }

            if (failureResponseHandler && typeof failureResponseHandler === 'function') {
                failureResponseHandler({dispatch, getState})(next)(nextAction);
            }

            next(nextAction);

        } else {
            next(action);
        }
    };
}
