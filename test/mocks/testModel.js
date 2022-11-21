/**
 * @file testModel.js
 */

// Apis
import {getData} from './testApi';

export default {
    nameSpace: 'testModel',
    state: [],
    apis: {
        getData: ({callback}) => dispatchApi => {
            dispatchApi({
                api: getData,
                callback
            });
        }
    },
    reducers: {

        getDataRequest: state => {
            return state;
        },

        getDataSuccess: (state, {response}) => {
            return response?.data || [];
        },

        getDataFailure: state => {
            return state;
        }

    }
};
