/**
 * @file testApi.ts
 */

import axios from 'axios';

/**
 * Request data
 * @returns {Promise}
 */
export function getData() {
    return axios({
        url: 'http://localhost:8000/getData',
        method: 'get'
    });
}

export default {
    getData
};
