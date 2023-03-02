[npm-image]: https://img.shields.io/npm/v/vivy-api.svg?style=flat-square

[npm-url]: https://npmjs.org/package/vivy-api

[license-image]: https://img.shields.io/npm/l/vivy-api.svg?style=flat-square

[vivy-url]: https://github.com/fatalxiao/vivy

[connected-react-router-url]: https://github.com/supasate/connected-react-router

[request-api-with-api-plugin-example-url]: https://github.com/fatalxiao/vivy-api/tree/main/examples/requestApiWithApiPlugin

[pieb-with-dpe-frontend-url]: https://github.com/fatalxiao/pieb-with-dpe-frontend

# vivy-api

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][npm-url]

A [Vivy][vivy-url] plugin which extend Vivy model to request api more easily.

## Docs

* [Installation](#installation)
* [Examples](#examples)
    * [Examples in repository](#examples-in-repository)
    * [Complete and real project example](#complete-and-real-project-example)
* [Documentation](#documentation)
    * [Basic usage](#basic-usage)
    * [Hooks](#hooks)
        * [useApiStatus](#useApiStatus)
        * [useIsApiRequest](#useIsApiRequest)
        * [useIsApiSuccess](#useIsApiSuccess)
        * [useIsApiFailure](#useIsApiFailure)

## Installation

Using npm:

```shell
$ npm install vivy vivy-api
```

## Examples

### Examples in repository

```shell
$ cd ./examples/[EXAMPLE_NAME]
$ npm run start
```

**Example names**:

* [requestApiWithApiPlugin][request-api-with-api-plugin-example-url]

### Complete and real project example

* [pieb-with-dpe-frontend][pieb-with-dpe-frontend-url]

## Documentation

### Basic usage

index.js

```js
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-vivy';

// Import Vivy
import Vivy, {registerModel} from 'vivy';

// Import Vivy api plugin
import VivyApi from 'vivy-api';

// Import sync component and model
import App from 'path_to_app_component';
import app from 'path_to_app_model';

// Create vivy
const vivy = Vivy();

// Apply api plugin
vivy.use(VivyApi({

    // Customized api status model name space ( default is "apiStatus" )
    // apiStatusModelNameSpace: 'customizedApiStatus',

    // Customized check response status callback
    // to tell whether response is successful
    checkResponseStatus: response => response?.data?.code === 2000,

    // A middleware like callback to handle the success response
    successResponseHandler: ({dispatch, getState}) => next => action => {
        // Do something when request successfully.
    },

    // A middleware like callback to handle the failure response
    failureResponseHandler: ({dispatch, getState}) => next => action => {
        // Do something when request failure.
    }

}));

// Create store after configuration
const store = vivy.createStore();

// Register model to store
registerModel(store, app);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app-container')
);
```

App.js

```js
import React from 'react';
import {useModelActions} from 'react-vivy';
import {useIsApiRequest} from 'vivy-api';

const App = ({
    getDataStatus, getData
}) => {

    /**
     * Get api from model using hook "useModelActions".
     */
    const {getData} = useModelActions('app');

    /**
     * Get "getData" api status using hook "useIsApiRequest".
     */
    const loading = useIsApiRequest('app/getData');

    return (
        <button disabled={loading}
                onClick={getData}>
            {
                loading ?
                    'Loading'
                    :
                    'Get data'
            }
        </button>
    );

};

export default App;
```

app.js

```js
export default {
    nameSpace: 'app',
    state: null,
    apis: {

        // Call api to get data
        getData: () => (dispatchApi, dispatch, getState) => {
            dispatchApi({
                api: YOUR_GET_DATA_API,
                params: {
                    // Api params
                },
                successCallback: () => {
                    // Do something when request successfully.
                },
                failureCallback: () => {
                    // Do something when request failure.
                }
            });
        }

    },
    reducers: {

        // These three reducers will be dispatched automatically after response.
        getDataRequest: (state, payload) => {
            return null;
        },
        getDataSuccess: (state, {responseData}) => {
            return responseData;
        },
        getDataFailure: (state, payload) => {
            return null;
        }

    }
};
```

### Hooks

#### `useApiStatus`

1. Get specific api status by model name sapce and api name.

```js
import {useApiStatus} from 'vivy-api';

const apiStatus = useApiStatus('model_name_space/api_name');
```

2. Get all apis status in a model by model name sapce and api name.

```js
import {useApiStatus} from 'vivy-api';

const apiStatuses = useApiStatus('model_name_space');
```

3. Get specific api status by callback function.

```js
import {useApiStatus} from 'vivy-api';

const apiStatus = useApiStatus(state => state.model_name_space.api_name);
```

4. Get all apis status in a model by callback function.

```js
import {useApiStatus} from 'vivy-api';

const apiStatuses = useApiStatus(state => state.model_name_space);
```

#### `useIsApiRequest`

```js
import {useIsApiRequest} from 'vivy-api';

const isApiRequest = useIsApiRequest('model_name_space/api_name');
```

#### `useIsApiSuccess`

```js
import {useIsApiSuccess} from 'vivy-api';

const isApiSuccess = useIsApiSuccess('model_name_space/api_name');
```

#### `useIsApiFailure`

```js
import {useIsApiFailure} from 'vivy-api';

const isApiFailure = useIsApiFailure('model_name_space/api_name');
```
