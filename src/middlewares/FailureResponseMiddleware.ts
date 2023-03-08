/**
 * @file FailureResponseMiddleware.ts
 */

// Action Types
import {CALL_API_FAILURE} from '../actionTypes/CallApiActionType';

// Types
import {Middleware} from 'vivy';

/**
 * Create FailureResponseMiddleware
 * @param responseHandler
 * @param failureResponseHandler
 */
export default function createFailureResponseMiddleware(
    responseHandler: Middleware, failureResponseHandler: Middleware
): Middleware {
    return ({dispatch, getState}) => next => action => {
        if (action?.hasOwnProperty(CALL_API_FAILURE)) {

            const nextAction = action[CALL_API_FAILURE];

            if (responseHandler && typeof responseHandler === 'function') {
                responseHandler({dispatch, getState})(next)(nextAction);
            }

            if (failureResponseHandler && typeof failureResponseHandler === 'function') {
                failureResponseHandler({dispatch, getState})(next)(nextAction);
            }

        } else {
            next(action);
        }
    };
}
