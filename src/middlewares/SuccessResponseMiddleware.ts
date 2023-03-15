/**
 * @file SuccessResponseMiddleware.ts
 * @author Liangxiaojun
 */

// Action Types
import {CALL_API_SUCCESS} from '../actionTypes/CallApiActionType';

// Types
import {Middleware} from 'vivy';

/**
 * Create SuccessResponseMiddleware
 * @param responseHandler
 * @param successResponseHandler
 */
export default function createSuccessResponseMiddleware(
    responseHandler?: Middleware, successResponseHandler?: Middleware
): Middleware {
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
