/**
 * @file userList.js
 */

// Apis
import {getUserList} from '../apis/UserListApi';

export default {
    nameSpace: 'userList',
    state: {

        /**
         * User list data
         */
        data: [],

        /**
         * Customized api message
         */
        message: ''

    },
    apis: {

        /**
         * Call api to get user list
         * @param searchText
         * @returns {(function(*, *, *): void)|*}
         */
        getUserList: ({searchText}) => (dispatchApi, dispatch, getState) => {
            dispatchApi({
                api: getUserList,
                params: {
                    searchText
                }
            });
        }

    },
    reducers: {

        /**
         * Handle request user list
         * @param state
         * @returns {*&{message: string}}
         */
        getUserListRequest: state => {
            return {
                ...state,
                message: 'Getting user list...'
            };
        },

        /**
         * Handle getting user list successfully
         * @param state
         * @param responseData
         * @returns {*&{data: *[], message: string}}
         */
        getUserListSuccess: (state, {responseData}) => {
            return {
                ...state,
                message: 'Get user list successfully.',
                data: responseData || []
            };
        },

        /**
         * Handle getting user list failure
         * @param state
         * @returns {*&{data: *[], message: string}}
         */
        getUserListFailure: state => {
            return {
                ...state,
                message: 'Get user list failure.',
                data: []
            };
        }

    }
};
