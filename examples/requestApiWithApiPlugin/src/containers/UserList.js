/**
 * @file UserList.js
 */

import React, {useState, useCallback, useEffect} from 'react';
import {useModel} from 'react-vivy';
import {useStatus, useIsRequest, useIsSuccess, useIsFailure} from 'vivy-api';

const UserList = () => {

    /**
     * Get state and reducer from model using hook "useModel".
     */
    const [{data, message}, {getUserList}] = useModel('userList');

    console.log('useStatus(getUserList)::', useStatus(getUserList));
    console.log('useIsRequest(getUserList)::', useIsRequest(getUserList));
    console.log('useIsSuccess(getUserList)::', useIsSuccess(getUserList));
    console.log('useIsFailure(getUserList)::', useIsFailure(getUserList));

    /**
     * Get "getUserList" api status using "ApiAction.isRequest()".
     */
    const isGetUserListRequest = useIsRequest(getUserList);

    /**
     * Or you can get "getUserList" api status using hook "useIsApiRequest".
     * @example
     *  import {useIsApiRequest} from 'vivy-api';
     *  const isGetUserListRequest = useIsApiRequest('userList/getUserList');
     */

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
                Search:&nbsp;
                <input value={searchText}
                       disabled={isGetUserListRequest}
                       onChange={e => setSearchText(e.target.value)}/>
                &nbsp;{message}
            </div>

            <div className="result">
                {
                    isGetUserListRequest ?
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

export default UserList;
