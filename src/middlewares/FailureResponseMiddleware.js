/**
 * @file FailureResponseMiddleware.js
 */

import {CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

/**
 * Create FailureResponseMiddleware
 * @param failureResponseHandler {Function}
 * @returns {function({dispatch: *, getState: *}): function(*=): function(*=): (*)}
 */
export default function createFailureResponseMiddleware(failureResponseHandler) {
    return ({dispatch, getState}) => next => action => {

        if (action?.hasOwnProperty(CALL_API_FAILURE)) {
            if (failureResponseHandler && typeof failureResponseHandler === 'function') {
                return failureResponseHandler({dispatch, getState})(next)(action[CALL_API_FAILURE]);
            }
        }

        return next(action);

    };
}
