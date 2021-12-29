/**
 * @file UserList.js
 */

import React, {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindModelActionCreators} from 'vivy';

// Statics
import {ApiStatus} from 'vivy-api';

// Styles
import './UserList.scss';

const UserList = ({
    data, message, getUserListStatus,
    getUserList
}) => {

    /**
     * Search text
     */
    const [searchText, setSearchText] = useState('');

    /**
     * Query user list by search text
     * @type {(function(): void)|*}
     */
    const requestUserList = useCallback(() => {
        getUserList?.({
            searchText
        });
    }, [
        searchText,
        getUserList
    ]);

    /**
     * Handle search text change
     * @type {(function(*): void)|*}
     */
    const handleChange = useCallback(e => {
        setSearchText(e.target.value);
    }, []);

    /**
     * Query user list when init
     */
    useEffect(() => {
        requestUserList();
    }, [
        requestUserList
    ]);

    return (
        <div className="user-list">

            <div className="search">
                Search:
                <input value={searchText}
                       onChange={handleChange}/>
                {message}
            </div>

            <div className="result">
                {
                    getUserListStatus === ApiStatus.REQUEST ?
                        'loading'
                        :
                        data?.length > 0 ?
                            <ul>
                                {
                                    data?.map((item, index) =>
                                        <li key={index}>
                                            {item}
                                        </li>
                                    )
                                }
                            </ul>
                            :
                            'No matched data'
                }
            </div>

        </div>
    );

};

UserList.propTypes = {

    data: PropTypes.array,
    message: PropTypes.string,
    getUserListStatus: PropTypes.string,

    getUserList: PropTypes.func

};

export default connect(state => ({

    // get data from userList model
    data: state.userList.data,
    message: state.userList.message,

    // get "getUserList" api status from vivy-api model ( default model name space is "apiStatus" )
    getUserListStatus: state.apiStatus?.userList?.getUserList

}), dispatch => bindModelActionCreators({
    getUserList: 'userList/getUserList'
}, dispatch))(UserList);
