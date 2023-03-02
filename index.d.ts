import {Middleware} from 'redux';
import {REQUEST, SUCCESS, FAILURE} from './dist/statics/ApiStatus';

/**
 * Api status
 */
export type ApiStatus = {
    REQUEST: REQUEST,
    SUCCESS: SUCCESS,
    FAILURE: FAILURE
};

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
     * Handle any kind of response
     */
    responseHandler?: Middleware,

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
 * A hook to access the vivy apis status.
 * @param arg
 */
export function useApiStatus(arg?: string | Function): string | object

/**
 * Create Vivy api plugin instance
 * @param options
 */
export default function VivyApi(options?: VivyApiPluginOption);
