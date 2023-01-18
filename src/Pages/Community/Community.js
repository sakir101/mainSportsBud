import React, { useContext, useLayoutEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../Shared/Loading/Loading";
import "./Community.css";
import props from "../../Asset/Dummy/suggestedcommunity.json";
import props2 from "../../Asset/Dummy/mycommunity.json";
import SuggestedCommunities from "./SuggestedCommunities";
import { FaPlusCircle } from "react-icons/fa";
import MyCommunity from "./MyCommunity";
import { API_URL } from "../../API/config";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthContext } from "../../Context/AuthProvider";

const Community = () => {
    const { user } = useContext(AuthContext);

    const [active, setActive] = React.useState(true);

    const placeholderToggle = () => {
        setActive(false);
    };

    const placeholder = () => {
        setActive(true);
    };



    const fetchAllCommunity = async ({ pageParam = 1 }) => {
        const url = `${API_URL}/api/v1/community/communitiesList?page=${pageParam}&limit=${10}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();
        console.log("ALLCOMMUNITY:", data)
        return {
            data: data.communities
        }

    }

    const fetchMyCommunity = async ({ pageParam = 1 }) => {
        const url = `${API_URL}/api/v1/community/myCommunities?page=${pageParam}&limit=${10}&userId=${user._id}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();

        return {
            data: data.communities
        }
    }



    const MyOwnedCommunity = useInfiniteQuery({

        queryKey: ['myOwnedCommunities', user?.id],
        queryFn: fetchMyCommunity,
        getNextPageParam: (lastPage, pages) => {
            console.log("lastPage:", lastPage)
            console.log("pages:", pages)
            if (lastPage.data.length < 10) {
                return undefined
            }
            return pages.length + 1

        }
    })

    const AllCommunity = useInfiniteQuery({

        queryKey: ['allCommunityList'],
        queryFn: fetchAllCommunity,
        getNextPageParam: (lastPage, pages) => {
            console.log("lastPage:", lastPage)
            console.log("pages:", pages)
            if (lastPage.data.length < 1) {
                return undefined
            }
            return pages.length + 1

        }

    })




    // console.log(MyOwnedCommunity.data)
    // console.log(AllCommunity.data)

    if (!MyOwnedCommunity.data || !AllCommunity.data) {
        return <Loading />
    }
    if (MyOwnedCommunity.isLoading || AllCommunity.isLoading) {
        return <Loading></Loading>;
    }
    if (MyOwnedCommunity.isError || AllCommunity.isError) {
        return <div>Error</div>
    }





    // const { data: communities = [], refetch, isLoading } = useQuery({
    //     queryKey: ['communities'],
    //     queryFn: async () => {
    //         console.log('ehg')
    //         const res = await fetch('suggestedcommunity.json');
    //         const data = await res.json();
    //         console.log(data);
    //         return data
    //     }
    // });


    return (
        <div className='grid grid-cols-3 bg-slate-300 mt-16 fixed'>

            <div className='bg-slate-200 shadow-lg hidden lg:block p-6  pb-20 s'>
                <div className='flex items-center mb-6'>
                    <div className='w-14 mr-2'>
                        <img
                            src={user?.profilePicture}
                            alt='User'
                            className='rounded-full w-12 h-12 shadow-md'
                        />
                    </div>
                    <div>
                        <Link to='/main/profileUser' ><h3 className='text-3xl'>{user?.firstName} {user?.lastName}</h3></Link>
                    </div>
                </div>
                <Link to="/main/createcommunity" className='m-2 flex items-center mb-10'>
                    <div className='w-7 mr-4'>
                        <FaPlusCircle className='text-3xl w-7 text-blue-600'></FaPlusCircle>
                    </div>
                    <div>
                        <h3 className='text-xl text-blue-600'>Create your own community</h3>
                    </div>
                </Link>
                <div>
                    <div>
                        <h1 className='text-lg text-slate-500 text-left'>My Community</h1>
                        <hr className='h-[4px] bg-slate-300 shadow-lg'></hr>
                    </div>

                    <div id="scrollableDiv1" className='overflow-y-scroll h-screen'>
                        <InfiniteScroll
                            dataLength={MyOwnedCommunity?.data?.pages?.length}
                            next={() => MyOwnedCommunity?.fetchNextPage()}
                            hasMore={MyOwnedCommunity?.hasNextPage}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv1"

                        >

                            {MyOwnedCommunity?.data &&
                                MyOwnedCommunity?.data?.pages.map((page, id) => {
                                    return page.data.map((community, id) => {
                                        console.log("community:", community)
                                        return <MyCommunity community={community} key={id} />
                                    })
                                })}

                        </InfiniteScroll>




                    </div>

                </div>
            </div>
            <div className='col-span-3 lg:col-span-2'>
                <div className='flex justify-center items-center'>
                    <div className='w-3/4 my-6 z-49 relative mr-5 lg:mr-0'>
                        <form action=''>
                            <FcSearch className='absolute search'> </FcSearch>
                            <input
                                type='text'
                                placeholder='Search your community'
                                onFocus={placeholderToggle}
                                onBlur={placeholder}
                                className={`in input input-bordered w-full  placeholder:p-[-1px] ${active ? "placeholder:block" : "placeholder:invisible"} `}
                            />
                        </form>
                    </div>
                    <div className='block lg:invisible'>
                        <div className='w-7 mr-4'>
                            <FaPlusCircle className='text-3xl w-7 text-blue-600'></FaPlusCircle>
                        </div>
                    </div>
                </div>


                {/* {communities.map((community) => (
                        <SuggestedCommunities
                            key={community.id}
                            community={community}
                        ></SuggestedCommunities>
                    ))} */}
                <div id="scrollableDiv" className='overflow-y-scroll h-screen'>
                    <InfiniteScroll
                        dataLength={AllCommunity.data.pages.length}
                        next={() => AllCommunity?.fetchNextPage()}
                        hasMore={AllCommunity?.hasNextPage}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"

                    >
                        <div className='grid gap-[34px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto px-6 my-5 pb-48 s'>
                            {AllCommunity?.data &&
                                AllCommunity?.data?.pages.map((page, id) => {
                                    return page.data.map((community, id) => {
                                        return <SuggestedCommunities community={community} key={id} />
                                    })
                                })}

                        </div>

                    </InfiniteScroll>

                </div>
            </div>
        </div >
    );
};

export default Community;
