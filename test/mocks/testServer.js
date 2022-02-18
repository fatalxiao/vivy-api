/**
 * @file testServer.js
 */

import express from 'express';

// Data
import testData from './testData';

/**
 * Start server
 * @param callback
 * @returns {Object}
 */
export function startServer(callback) {

    const app = express();

    return app.get('/getData', (req, res) =>
        res.send(testData)
    ).listen('8000', callback);

}

export default {
    startServer
};
