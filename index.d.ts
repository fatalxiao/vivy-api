import {
    Middleware
} from 'redux';

/**
 * Api status
 */
export type ApiStatus = 'REQUEST' | 'SUCCESS' | 'FAILURE';

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
 * @constructor
 */
export default function createVivyApiPlugin(options?: VivyApiPluginOption);
