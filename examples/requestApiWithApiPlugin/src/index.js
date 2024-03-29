/**
 * @file index.js
 */

import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-vivy';

// Import Vivy
import Vivy, {registerModel} from 'vivy';
import VivyApi from 'vivy-api';

// Sync component and model
import UserList from './containers/UserList';
import userListModel from './models/userList';

// Create vivy
const vivy = Vivy();

// Apply api plugin
vivy.use(VivyApi({

    // Customized api status model name space ( default is "apiStatus" )
    // apiStatusModelNameSpace: 'customizedApiStatus',

    // Customized check response status callback
    // to tell whether response is successful
    checkResponseStatus: response => response?.data?.code === 2000,

    // Callback before request
    beforeRequest: ({dispatch, getState}) => next => action => {
        // You can return false to prevent the request.
        // if (SOME_CONDITION) {
        //     return false;
        // }
    },

    // Callback after request
    onRequest: ({dispatch, getState}) => next => action => {
        // ...
    },

    // Callback after response
    onResponse: ({dispatch, getState}) => next => action => {
        // ...
    },

    // Callback on error
    onError: ({dispatch, getState}) => next => action => {
        // ...
    },

    // A middleware like callback to handle any kind of response
    responseHandler: ({dispatch, getState}) => next => action => {

        console.log('responseHandler action:', action);

        const {response} = action;

        next({
            ...action,
            responseData: response?.data?.data
        });

    },

    // A middleware like callback to handle the success response
    successResponseHandler: ({dispatch, getState}) => next => action => {

        console.log('successResponseHandler action:', action);

        const {response} = action;

        next({
            ...action,
            responseData: response?.data?.data
        });

    },

    // A middleware like callback to handle the failure response
    failureResponseHandler: ({dispatch, getState}) => next => action => {

        console.log('failureResponseHandler action:', action);

        const {response, error} = action;

        console.log('failureResponseHandler response:', response);
        console.log('failureResponseHandler error:', error);

        return next(action);

    }

}));

// Create store after configuration
const store = vivy.createStore();

// Register model to store
registerModel(store, userListModel);

createRoot(document.getElementById('app-container')).render(
    <Provider store={store}>
        <UserList/>
    </Provider>
);
