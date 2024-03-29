import { notification } from 'antd'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import profile from '../../Asset/person/profile.png'

import FriendRequests from '../../Asset/Dummy/FreindRequest'
import { API_URL } from '../../API/config'
import { isError, useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '../../Shared/Loading/Loading'
import { AuthContext } from '../../Context/AuthProvider'
import { tuple } from 'antd/es/_util/type'

const FriendRequest = ({ request, refetch }) => {
    const { sender } = request
    const [loading, setLoading] = React.useState(false)
    const handleAcceptFriendRequest = async () => {
        setLoading(true)
        try {
            const url = `${API_URL}/api/v1/user/acceptFriendRequest/${sender.id}`
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setLoading(false)
                await refetch()
                notification.success({
                    message: 'Success',
                    description: 'Friend Request Accepted',
                    placement: 'bottomRight'
                })
            }


        }
        catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const handleDeclineFriendRequest = async () => {
        setLoading(true)
        try {
            const url = `${API_URL}/api/v1/user/declineFriendRequest/${sender.id}`
            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setLoading(false)
                await refetch()
                notification.success({
                    message: 'Success',
                    description: 'Friend Request Declined',
                    placement: 'bottomRight'
                })
            }


        }
        catch (error) {
            console.log(error);
            setLoading(false)
        }

    }

    if (loading) {
        return null
    }


    return (
        <>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 p-1">
                <div className="flex py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex-shrink-0">
                        <img className="w-11 h-11 rounded-full" src={sender.profilePicture} alt="image" />
                        {/* <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-blue-600 rounded-full border border-white dark:border-gray-800">
                                <svg className="w-3 h-3 text-white" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                            </div> */}
                    </div>
                    <div className="pl-3 w-full">
                        <div className=''>
                            <Link to={`/main/profileuser/${sender.id}`} className="font-semibold text-gray-800">{sender.firstName} {sender.lastName}</Link>
                            <span className="text-gray-400">wants to be your friend</span>
                        </div>
                        <div className="font-semibold p-1">
                            <button disabled={loading} onClick={handleAcceptFriendRequest} className="text-blue-600 mr-3 ">Accept</button>
                            <button disabled={loading} onClick={handleDeclineFriendRequest} className="text-gray-400">Decline</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function FriendRequestDropDown(props) {
    const { setFriendRequestDrowpDown } = props
    const { user } = useContext(AuthContext) // user is the current user
    const handleOption = () => {
        setFriendRequestDrowpDown(prev => !prev) // set the state of the dropdown to false
    }


    const fetchFriendRequest = async ({ pageParam = 1 }) => {
        const url = `${API_URL}/api/v1/user/friendrequestsRecieved?page=${pageParam}&limit=${10}`
        console.log("url", url)
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();
        console.log("data", data)

        return {
            data: data.friendRequest ? data.friendRequest : [],
        }
    }


    const { //
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isFetchingNextPage,
        isError,
        refetch,
    } = useInfiniteQuery({ // useInfiniteQuery is used to fetch data from the server
        queryKey: ['friendRequest', user.id],
        queryFn: fetchFriendRequest,
        getNextPageParam: (lastPage, pages) => {
            console.log("lastPage:", lastPage)
            console.log("pages:", pages)
            if (lastPage.data?.length < 1) {
                return undefined
            }
            return pages?.length + 1

        },
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: true
    })

    if (!data) { // if there is no data
        return <Loading />
    }
    if (isLoading) { // if the data is loading
        return <Loading />
    }
    if (isError) { // if there is an error
        return <h1>Something went wrong!</h1>
    }



    return (
        <div className="absolute p-1 flex items-end flex-col z-20 top-[65px]   w-full max-w-sm bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700 right-[0] ">
            <div className='flex justify-between w-full'>
                <div className="block py-2 px-4 font-medium text-center text-gray-700   dark:text-white">
                    Friend Requests
                </div>

                <button onClick={handleOption} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {
                data.pages.length === 1 && data.pages[0].data.length === 0
                &&
                <h1 className="text-2xl font-bold text-gray-500 text-center">Empty Friend Request List!</h1>
            }
            <div className='self-start w-full overflow-y-scroll h-[300px]' id='scrollableDiv'>
                <InfiniteScroll
                    next={() => fetchNextPage()}

                    hasMore={hasNextPage}

                    // data?.pages?.reduce((acc, page) => acc + page.data.length, 0) || 0
                    // dataLength={data.pages.length === 0 ? 0 : data.pages.reduce((acc, page) => acc + page.data.length, 0) || 0}
                    dataLength={data.pages.length}
                    scrollableTarget="scrollableDiv"
                >

                    {
                        data &&
                        data.pages.map((page) => {

                            return (
                                page.data.map((request, index) => {

                                    return (

                                        <FriendRequest

                                            request={request}
                                            key={index}
                                            refetch={refetch}
                                        />
                                    )
                                })
                            )
                        })

                    }




                </InfiniteScroll>
            </div>

        </div >

    )
}

export default FriendRequestDropDown
