/**
 * @file ResponseMiddleware.js
 */

// Action Types
import {CALL_API_SUCCESS, CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

/**
 * Create ResponseMiddleware
 * @param responseHandler {Function}
 * @returns {function({dispatch: *, getState: *}): function(*=): function(*=): (*)}
 */
export default function createFailureResponseMiddleware(responseHandler) {
    return ({dispatch, getState}) => next => action => {
        if (responseHandler && typeof responseHandler === 'function') {
            if (action?.hasOwnProperty(CALL_API_SUCCESS)) {
                responseHandler({dispatch, getState})(next)(action[CALL_API_SUCCESS]);
            } else if (action?.hasOwnProperty(CALL_API_FAILURE)) {
                responseHandler({dispatch, getState})(next)(action[CALL_API_FAILURE]);
            }
        } else {
            return next(action);
        }
    };
}
