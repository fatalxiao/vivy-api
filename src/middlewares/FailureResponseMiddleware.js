/**
 * @file FailureResponseMiddleware.js
 */

// Action Types
import {CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

/**
 * Create FailureResponseMiddleware
 * @param failureResponseHandler {Function}
 * @returns {function({dispatch: *, getState: *}): function(*=): function(*=): (*)}
 */
export default function createFailureResponseMiddleware(failureResponseHandler) {
    return ({dispatch, getState}) => next => action => {

        if (failureResponseHandler && typeof failureResponseHandler === 'function'
            && action?.hasOwnProperty(CALL_API_FAILURE)) {
            return failureResponseHandler({dispatch, getState})(next)(action[CALL_API_FAILURE]);
        }

        return next(action);

    };
}
