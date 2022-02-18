'use strict';

import Vivy from 'vivy';
import VivyApi from '../src';

// Servers
import {startServer} from './mocks/testServer';

// Data
import testData from './mocks/testData';

// Models
import testModel from './mocks/testModel';

test('Register model', () => {

    startServer(() => {

        const vivy = Vivy();
        vivy.use(VivyApi({
            successResponseHandler: ({dispatch, getState}) => next => action => {
                action?.callback?.();
            },
            failureResponseHandler: ({dispatch, getState}) => next => action => {
                action?.callback?.();
            }
        }));

        const store = vivy.createStore();
        store.registerModel(testModel);

        store.dispatch({
            type: 'testModel/getData',
            callback: () => {
                expect(
                    store.getState().testModel
                ).toEqual(
                    testData
                );
            }
        });

    });

});
