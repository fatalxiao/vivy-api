/**
 * @file testMiddleware.js
 */

export default ({dispatch, getState}) => next => action => {

    const {type, callback} = action;

    if (type === 'getTestModelData') {
        dispatch({
            type: 'testModel/getData',
            callback
        });
    }

    return next(action);

};
