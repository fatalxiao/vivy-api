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

    /**
     * Run test server and request data
     * @returns {Promise<unknown>}
     */
    function runTest() {
        return new Promise((resolve, reject) => {
            const server = startServer(() => store.dispatch({
                type: 'testModel/getData',
                callback: () => server.close(() => resolve())
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

    /**
     * Run test server and request data
     * @returns {Promise<unknown>}
     */
    function runTest() {
        return new Promise((resolve, reject) => {
            store.dispatch({
                type: 'testModel/getData',
                callback: () => {
                    resolve();
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

test('Request data by chain dispatch', async () => {

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

    let server;

    /**
     * Run test server and request data
     * @returns {Promise<unknown>}
     */
    function runTest() {
        return new Promise((resolve, reject) => {
            server = startServer(() => {
                store.dispatch.testModel.getData({
                    callback: () => {
                        resolve();
                    }
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
