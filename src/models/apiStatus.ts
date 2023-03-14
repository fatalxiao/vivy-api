/**
 * @file apiStatus.ts
 * @author Liangxiaojun
 */

// Statics
import {ApiStatus} from '../statics/ApiStatus';

// Types
import {VivyModel} from "vivy";

/**
 * Create apiStatus model
 * @param nameSpace
 */
export default function createApiStatus(nameSpace: string): VivyModel<object> {
    return {
        nameSpace: nameSpace || 'apiStatus',
        state: {},
        reducers: {

            /**
             * Init request status
             * @param state
             * @param nameSpace
             * @param apiActionName
             */
            init: (state: object, {nameSpace, apiActionName}) => {
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
             * @param state
             * @param nameSpace
             * @param apiActionName
             */
            request: (state: object, {nameSpace, apiActionName}) => {
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
             * @param state
             * @param nameSpace
             * @param apiActionName
             */
            success: (state: object, {nameSpace, apiActionName}) => {
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
             * @param state
             * @param nameSpace
             * @param apiActionName
             */
            failure: (state: object, {nameSpace, apiActionName}) => {
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
