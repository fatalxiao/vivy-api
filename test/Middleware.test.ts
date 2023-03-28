'use strict';

import Vivy from 'vivy';
import VivyApi from '../src';

// Servers
import {startServer} from './mocks/testServer';

// Data
import testData from './mocks/testData';

// Middleware
import testMiddleware from './mocks/testMiddleware';

// Models
import testModel from './mocks/testModel';

test('Request data through middleware', async () => {

    const vivy = Vivy({
        extraMiddlewares: [
            testMiddleware
        ]
    });
    vivy.use(VivyApi({
        successResponseHandler: () => next => action => {
            action?.callback?.();
            return next(action);
        },
        failureResponseHandler: () => next => action => {
            action?.callback?.();
            return next(action);
        }
    }));

    const store = vivy.createStore();
    store.registerModel(testModel);

    /**
     * Run test server and request data
     * @returns {Promise<unknown>}
     */
    function runTest() {
        return new Promise(resolve => {
            const server = startServer(() => store.dispatch({
                type: 'getTestModelData',
                callback: () => server.close(() => resolve(undefined))
            }));
        });
    }

    await runTest();

    expect(
        store.getState().testModel
    ).toEqual(
        testData
    );

});

test('Request data failure through middleware', async () => {

    const vivy = Vivy({
        extraMiddlewares: [
            testMiddleware
        ]
    });
    vivy.use(VivyApi({
        successResponseHandler: () => next => action => {
            action?.callback?.();
            return next(action);
        },
        failureResponseHandler: () => next => action => {
            action?.callback?.();
            return next(action);
        }
    }));

    const store = vivy.createStore();
    store.registerModel(testModel);

    /**
     * Run test server and request data
     * @returns {Promise<unknown>}
     */
    function runTest() {
        return new Promise(resolve => {
            store.dispatch({
                type: 'getTestModelData',
                callback: () => {
                    resolve(undefined);
                }
            });
        });
    }

    await runTest();

    expect(
        store.getState().testModel
    ).toEqual(
        []
    );

});
