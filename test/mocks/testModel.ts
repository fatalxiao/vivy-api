/**
 * @file testModel.ts
 */

// Apis
import {getData} from './testApi';
import {VivyModel} from 'vivy';

export default <VivyModel<any[]>>{
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
            console.log('getDataRequest');
            return state;
        },

        getDataSuccess: (state, {response}) => {
            console.log('getDataSuccess');
            return response?.data || [];
        },

        getDataFailure: state => {
            console.log('getDataFailure');
            return state;
        }

    }
};
