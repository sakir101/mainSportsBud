import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../API/config';
import CommunityMember from '../../Pages/Community/MyCommunitySingle/CommunityMember';
import Loading from '../../Shared/Loading/Loading';

const CommunityMemebersTab = () => {
    const params = useParams()
    const fetchCommunityMember = async ({ pageParam = 1 }) => {
        const url = `${API_URL}/api/v1/community/members/${params.id}?page=${pageParam}&limit=${10}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();
        console.log(data)
        return {
            data: data.members
        }
    }

    const CommunityMembers = useInfiniteQuery({
        queryKey: ['communityMembers', params?.id],
        queryFn: fetchCommunityMember,
        getNextPageParam: (lastPage, pages) => {
            console.log("lastPage:", lastPage)
            console.log("pages:", pages)
            if (lastPage.data && lastPage.data.length < 1) {
                return undefined
            }
            return pages.length + 1
        }

    })
    if (!CommunityMembers.data) {
        return <Loading />
    }

    if (CommunityMembers.isLoading) {
        return <Loading />
    }
    if (CommunityMembers.isError) {
        return <h1>Error Occurs</h1>
    }



    return (
        <div className="tab-pane fade h-auto" id="tabs-profile3" role="tabpanel" aria-labelledby="tabs-profile-tab3">
            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 py-8 mt-5  text-center'>
                <h1 className='text-xl font-bold'>All Members</h1>
            </div>


            <InfiniteScroll
                dataLength={CommunityMembers?.data?.pages?.length}
                next={() => CommunityMembers?.fetchNextPage()}
                hasMore={CommunityMembers?.hasNextPage}
            >

                <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 pt-5 mt-5 grid grid-cols-1 lg:grid-cols-2 justify-around px-3 lg:px-5 gap-4 lg:gap-8 '>

                    {
                        CommunityMembers?.data &&
                        CommunityMembers?.data?.pages?.map((page, id) => {
                            return page?.data?.members?.map((member, id) => {
                                return <CommunityMember member={member} key={id} />
                            })
                        })
                    }

                </div>
            </InfiniteScroll>
        </div>


    );
}

export default CommunityMemebersTab;