/**
 * @file testServer.js
 */

import express from 'express';

// Data
import testData from './testData';

/**
 * Start server
 * @param callback
 * @returns {Express}
 */
export function startServer(callback) {

    const app = express();

    app.get('/getData', (req, res) =>
        res.send(testData)
    ).listen('8000', callback);

    return app;

}

export default {
    startServer
};
