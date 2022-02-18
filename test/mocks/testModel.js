/**
 * @file testModel.js
 */

export default {
    nameSpace: 'testModel',
    state: 0,
    apis: {
        get: () => (dispatchApi, dispatch, getState) => {

        }
    },
    globalReducers: {
        globalUpdate: (state, {value}) => {
            return value;
        }
    },
    reducers: {
        update: (state, {value}) => {
            return value;
        }
    }
};
