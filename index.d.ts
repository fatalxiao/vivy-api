import {Middleware} from 'redux';

import * as ApiStatus from './src/statics/ApiStatus';

/**
 * Api status
 */
export {ApiStatus};

export interface VivyApiPluginOption {

    /**
     * NameSpace of "apiStatus" Model
     */
    apiStatusModelNameSpace?: string,

    /**
     * Check response to differ whether the response is successful
     */
    checkResponseStatus?: (response?: Object) => boolean,

    /**
     * Handle success response
     */
    successResponseHandler?: Middleware,

    /**
     * Handle failure response
     */
    failureResponseHandler?: Middleware

}

/**
 * Create Vivy api plugin instance
 * @param options
 */
export default function VivyApi(options?: VivyApiPluginOption);
