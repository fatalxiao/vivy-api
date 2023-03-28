'use strict';

import Vivy from 'vivy';
import VivyApi from '../src';

// Servers
import {startServer} from './mocks/testServer';

// Data
import testData from './mocks/testData';

// Models
import testModel from './mocks/testModel';

test('Request data', async () => {

    const vivy = Vivy();
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
                type: 'testModel/getData',
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

test('Request data failure', async () => {

    const vivy = Vivy();
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
                type: 'testModel/getData',
                callback: () => resolve(undefined)
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

test('Request data by chain dispatch', async () => {

    const vivy = Vivy();
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

    let server;

    /**
     * Run test server and request data
     * @returns {Promise<unknown>}
     */
    function runTest() {
        return new Promise(resolve => {
            server = startServer(() => {
                store.dispatch.testModel.getData({
                    callback: () => resolve(undefined)
                });
            });
        });
    }

    await runTest();

    server.close();

    expect(
        store.getState().testModel
    ).toEqual(
        testData
    );

});

test('responseHandler', async () => {

    const vivy = Vivy();
    vivy.use(VivyApi({
        responseHandler: () => next => action => {
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
                type: 'testModel/getData',
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
