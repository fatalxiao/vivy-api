/**
 * @file apiStatus.js
 */

// Statics
import ApiStatus from '../statics/ApiStatus';

/**
 * Create apiStatus model
 * @param nameSpace {string}
 * @returns {{reducers: {request: (function(*, {nameSpace: *, apiActionName: *}): *), success: (function(*, {nameSpace: *, apiActionName: *}): *), failure: (function(*, {nameSpace: *, apiActionName: *}): *)}, nameSpace: string, state: {}}}
 */
export default function createApiStatus(nameSpace) {
    return {
        nameSpace: nameSpace || 'apiStatus',
        state: {},
        reducers: {

            /**
             * Update request status
             * @param state {Object}
             * @param nameSpace {string}
             * @param apiActionName {string}
             * @returns {*}
             */
            request: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state[nameSpace],
                        [apiActionName]: ApiStatus.REQUEST
                    }
                };
            },

            /**
             * Update success status
             * @param state {Object}
             * @param nameSpace {string}
             * @param apiActionName {string}
             * @returns {*}
             */
            success: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state[nameSpace],
                        [apiActionName]: ApiStatus.SUCCESS
                    }
                };
            },

            /**
             * Update failure status
             * @param state {Object}
             * @param nameSpace {string}
             * @param apiActionName {string}
             * @returns {*}
             */
            failure: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state[nameSpace],
                        [apiActionName]: ApiStatus.FAILURE
                    }
                };
            }

        }
    };
}
