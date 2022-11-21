/**
 * @file testMiddleware.js
 */

export default ({dispatch}) => next => action => {

    const {type, callback} = action;

    if (type === 'getTestModelData') {
        dispatch({
            type: 'testModel/getData',
            callback
        });
    }

    return next(action);

};
