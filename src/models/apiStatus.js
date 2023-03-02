/**
 * @file apiStatus.js
 */

// Statics
import ApiStatus from '../statics/ApiStatus';

/**
 * Create apiStatus model
 * @param nameSpace {string}
 * @returns {Object}
 */
export default function createApiStatus(nameSpace) {
    return {
        nameSpace: nameSpace || 'apiStatus',
        state: {},
        reducers: {

            /**
             * Init request status
             * @param state
             * @param nameSpace
             * @param apiActionName
             * @returns {*}
             */
            init: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state[nameSpace],
                        [apiActionName]: undefined
                    }
                };
            },

            /**
             * Update request status
             * @param state {Object}
             * @param nameSpace {string}
             * @param apiActionName {string}
             * @returns {Object}
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
             * @returns {Object}
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
             * @returns {Object}
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
