/**
 * @file SuccessResponseMiddleware.js
 */

import {CALL_API_SUCCESS} from '../actionTypes/CallApiActionType';

/**
 * Create SuccessResponseMiddleware
 * @param successResponseHandler {Function}
 * @returns {function({dispatch: *, getState: *}): function(*=): function(*=): (*)}
 */
export default function createSuccessResponseMiddleware(successResponseHandler) {
    return ({dispatch, getState}) => next => action => {

        if (action?.hasOwnProperty(CALL_API_SUCCESS)) {
            if (successResponseHandler && typeof successResponseHandler === 'function') {
                return successResponseHandler({dispatch, getState})(next)(action[CALL_API_SUCCESS]);
            }
        }

        return next(action);

    };
}
