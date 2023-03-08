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
 * A hook to access the apis status.
 * @param arg
 */
export function useApiStatus(arg?: string | Function): string | object

/**
 * A hook to access whether the apis status is request.
 * @param arg
 */
export function useIsApiRequest(arg?: string | Function): boolean

/**
 * A hook to access whether the apis status is success.
 * @param arg
 */
export function useIsApiSuccess(arg?: string | Function): boolean

/**
 * A hook to access whether the apis status is failure.
 * @param arg
 */
export function useIsApiFailure(arg?: string | Function): boolean

/**
 * Create Vivy api plugin instance
 * @param options
 */
export default function VivyApi(options?: VivyApiPluginOption);
