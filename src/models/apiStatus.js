/**
 * @file apiStatus.js
 */

import ApiStatus from '../statics/ApiStatus';

/**
 * Create apiStatus model
 * @param nameSpace
 * @returns {{}}
 */
export default function createApiStatus(nameSpace) {
    return {
        nameSpace: nameSpace || 'apiStatus',
        state: {},
        reducers: {

            /**
             * Update request status
             * @param state
             * @param nameSpace
             * @param apiActionName
             * @returns {*}
             */
            request: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state.nameSpace,
                        [apiActionName]: ApiStatus.REQUEST
                    }
                };
            },

            /**
             * Update success status
             * @param state
             * @param nameSpace
             * @param apiActionName
             * @returns {*}
             */
            success: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state.nameSpace,
                        [apiActionName]: ApiStatus.SUCCESS
                    }
                };
            },

            /**
             * Update failure status
             * @param state
             * @param nameSpace
             * @param apiActionName
             * @returns {*}
             */
            failure: (state, {nameSpace, apiActionName}) => {
                return {
                    ...state,
                    [nameSpace]: {
                        ...state.nameSpace,
                        [apiActionName]: ApiStatus.FAILURE
                    }
                };
            }

        }
    };
}
