/**
 * @file testServer.js
 */

import express from 'express';

// Data
import testData from './testData';

/**
 * Start server
 * @returns {Express}
 */
export function start() {

    const app = express();

    app.get('/getData', (req, res) =>
        res.send(testData)
    ).listen('8000');

    return app;

}

export default {
    start
};
