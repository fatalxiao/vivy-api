/**
 * @file ModelApiActionMiddleware.js
 */

// Action Types
import {CALL_API, CALL_API_PARAMS} from '../actionTypes/CallApiActionType';

/**
 * ModelApiActionMiddleware creater
 * @returns {function({dispatch?: *, getState?: *}): function(*): function(*=): (*)}
 */
export default function createModelApiActionMiddleware() {

    // async api actions
    const asyncApiActions = {};

    /**
     * ModelApiActionMiddleware
     * @param dispatch {Function}
     * @param getState {Function}
     * @returns {function(*): function(*=): (*)}
     * @constructor
     */
    function ModelApiActionMiddleware({dispatch, getState}) {

        /**
         * Dispatch an api action
         * @param type {string}
         * @returns {(function(*): void)|*}
         */
        const dispatchApi = type => apiAction => {

            const [nameSpace, apiActionName] = type.split('/');

            dispatch({
                [CALL_API]: {
                    ...apiAction,
                    [CALL_API_PARAMS]: {
                        nameSpace,
                        apiActionName,
                        types: [
                            `${type}Request`,
                            `${type}Success`,
                            `${type}Failure`
                        ]
                    }
                }
            });

        };

        return next => action => {

            // match type in async api actions
            if (asyncApiActions?.hasOwnProperty(action?.type)) {
                return asyncApiActions[action.type]?.(action)?.(dispatchApi(action.type), dispatch, getState);
            }

            return next(action);

        };

    }

    /**
     * Register async api actions
     * @param nameSpace {string}
     * @param apis {Object}
     */
    ModelApiActionMiddleware.register = (nameSpace, apis) => Object.keys(apis).forEach(type =>
        asyncApiActions[`${nameSpace}/${type}`] = apis[type]
    );

    return ModelApiActionMiddleware;

}
