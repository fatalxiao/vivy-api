import {Middleware} from 'redux';

import * as ApiStatus from './dist/statics/ApiStatus';

/**
 * Api status
 */
export {ApiStatus};

export interface Hooks {

    /**
     * Callback before request.
     */
    beforeRequest?: Middleware,

    /**
     * Callback after request.
     */
    onRequest?: Middleware,

    /**
     * Callback after response.
     */
    onResponse?: Middleware

    /**
     * Callback on error.
     */
    onError?: Middleware

}

export type VivyApiPluginOption = Hooks & {

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
