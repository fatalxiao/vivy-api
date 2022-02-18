'use strict';

import Vivy from 'vivy';
import VivyApi from '../src';

// Models
import testModel from './mocks/testModel';

test('Register model', () => {

    const vivy = Vivy();

    const store = vivy.createStore();
    store.registerModel(testModel);

    expect(
        store.getState().testModel
    ).toEqual(
        0
    );

});
