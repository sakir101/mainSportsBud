import React, { useContext, useEffect, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../../API/config';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading/Loading';

import { AuthContext } from '../../Context/AuthProvider';
import { SearchContext } from '../../Context/SearchContext';


const UserCardItem = ({ user, sportId }) => {
    const { id, firstName, lastName, profilePicture } = user // destructured user
    const { user: currentUser } = useContext(AuthContext) // get user from context

    const { data, isLoading, isError } = useQuery({ //get sport by sportId
        queryKey: ["findSports", sportId],
        queryFn: async () => {
            const url = `${API_URL}/api/v1/sport/sports/${sportId}`
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            //console.log(data.sport)
            return {
                data: data.sport
            }
        }

    })
    if (isLoading) {
        return <Loading />
    }
    if (isError) {
        return <h1>Error Occurs</h1>
    }
    if (!data) {
        return <Loading />
    }



    return (
        <Link to={`/main/profileUser/${currentUser.id === id ? "" : id}`}>
            <div className='flex justify-between '>
                <div className='flex'>
                    <div className="avatar mr-3">
                        <div className="w-16 rounded">
                            <img src={profilePicture}
                                alt="user DP" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <span className='mx-0 mr-1 text-lg font-bold'>{firstName}</span>
                            <span className='mx-0 text-lg font-bold'>{lastName}</span>
                        </div>
                        <div>
                            <span className='mx-0 text-sm'>{data?.data?.name}</span>
                        </div>
                    </div>
                </div>
                <div >
                </div>
            </div>
        </Link>
    )
}


const UserCard = () => {
    const params = useParams();
    const { sportUserSearch, gender, location, ageGt, ageLt } = useContext(SearchContext)

    const fetchSportsFollower = async ({ pageParam = 1 }) => {

        const url = `${API_URL}/api/v1/sport/sports/users/${params.id}?page=${pageParam}&limit=${10}&sportUserSearch=${sportUserSearch}&gender=${gender}&location=${location}&ageGt=${ageGt}&ageLt=${ageLt}`

        const res = await fetch(url, { // getting 10 users
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "authorization": `bearer ${localStorage.getItem('token')}`
            }
        });
        // console.log(res)
        const data = await res.json();
        return {
            data: data.sports
        };

    }


    const {
        data,
        fetchNextPage,
        hasNextPage,

        isLoading,

        isError
    } = useInfiniteQuery({
        queryKey: ['sportsFollower', params?.id, sportUserSearch, gender, location, ageGt, ageLt],
        queryFn: fetchSportsFollower,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage?.data?.length < 1) {
                return undefined
            }
            return pages.length + 1

        }
    })
    if (isLoading) {
        return <Loading />
    }
    if (isError) {
        return <div> Something went wrong!</div>
    }
    if (!data) {
        return <Loading />
    }




    return (
        <>
            <div >
                <InfiniteScroll
                    next={() => fetchNextPage()}
                    hasMore={hasNextPage}
                    dataLength={data?.pages?.length}
                >

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-48 lg:mb-56 mt-16  lg:mx-28">
                        {
                            data &&
                            data?.pages?.map((page) => {
                                return (
                                    page?.data?.map((sport, index) => {
                                        return (
                                            <UserCardItem
                                                key={index}
                                                user={sport?.user}
                                                sportId={sport?.sportId}

                                            />
                                        )
                                    })
                                )
                            })

                        }




                    </div>
                </InfiniteScroll>

            </div >

        </>
    );
};
export default UserCard;