/**
 * @file types.ts
 */

import {AnyAction, Middleware} from "vivy";

export interface ApiStatusAction extends AnyAction {
    nameSpace: string,
    apiActionName: string,
}

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
    checkResponseStatus?: (response?: Response) => boolean,

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
