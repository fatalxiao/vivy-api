'use strict';

import Vivy from 'vivy';
import VivyApi from '../src';

// Servers
import {startServer} from './mocks/testServer';

// Data
import testData from './mocks/testData';

// Models
import testModel from './mocks/testModel';

test('Register model', async () => {

    const vivy = Vivy();
    vivy.use(VivyApi({
        successResponseHandler: ({dispatch, getState}) => next => action => {
            action?.callback?.();
            return next(action);
        },
        failureResponseHandler: ({dispatch, getState}) => next => action => {
            action?.callback?.();
            return next(action);
        }
    }));

    const store = vivy.createStore();
    store.registerModel(testModel);

    function runTest() {
        return new Promise((resolve, reject) => {
            startServer(() => {
                store.dispatch({
                    type: 'testModel/getData',
                    callback: () => {
                        resolve();
                    }
                });
            });
        });
    }

    await runTest();

    expect(
        store.getState().testModel
    ).toEqual(
        testData
    );

});
