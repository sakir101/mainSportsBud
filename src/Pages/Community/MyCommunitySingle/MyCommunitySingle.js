import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import communitycover from '../../../Asset/communityBanner/football.jpg'
import { AiFillSetting } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { BsBoxArrowLeft } from "react-icons/bs";
import Loading from '../../../Shared/Loading/Loading';
import postProps from '../../../Asset/Dummy/communitypost.json';
import CommunityPostModal from '../../../Shared/Modal/CommunityPost/CommunityPostModal'
import CommunityPost from './CommunityPost';
import memberProps from '../../../Asset/Dummy/user.json'
import CommunityMember from './CommunityMember';
import { BsThreeDots } from "react-icons/bs";
import CommunityConversion from './CommunityConversion';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API_URL } from '../../../API/config';
import CommunityMemebersTab from '../../../Components/Community/CommunityMemebersTab';
import CommunityPostTab from '../../../Components/Community/CommunityPostTab';
import MyCommunityPostTab from '../../../Components/Community/MyCommunityPostTab';


const MyCommunitySingle = () => {
    const params = useParams()
    const [hasAccess, setHasAccess] = useState(true);
    const [isAdmin, setAdmin] = useState(false)
    const [members, setMembers] = useState([])
    const postParams = useParams()
    const memberParams = useParams()
    const [active, setActive] = React.useState(true);

    const fetchCommunityInfo = async () => {
        const url = `${API_URL}/api/v1/community//communities/${params.id}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();
        console.log(data)
        return data.community

    }

    const CommunityInfo = useQuery({
        queryKey: ['communityInfo', params.id],
        queryFn: fetchCommunityInfo
    })






    if (!CommunityInfo.data) {
        return <Loading></Loading>
    }
    if (CommunityInfo.isLoading) {
        return <Loading></Loading>
    }

    const { image: cImage, name: cName, description: cDes } = CommunityInfo.data

    return (
        <>
            <div className='mt-16 px-0 lg:px-20'>
                <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-10'>
                    <div>
                        <img src={cImage[cImage.length - 1]} alt="cover" className="w-full h-[400px] rounded-tl-lg rounded-tr-lg  object-cover object-top" />
                    </div>
                    <div className='my-4 mx-4'>
                        <a href='#' className='text-2xl lg:text-3xl font-bold'>{cName}</a>
                    </div>
                    <div className='my-4 mx-4 flex justify-between items-center'>
                        <div>
                            <div className="avatar-group -space-x-6">
                                <Link className="avatar">
                                    <div className="w-10 lg:w-12">
                                        <img src="https://placeimg.com/192/192/people" />
                                    </div>
                                </Link>
                                <Link className="avatar">
                                    <div className="w-10 lg:w-12">
                                        <img src="https://placeimg.com/192/192/people" />
                                    </div>
                                </Link>
                                <Link className="avatar">
                                    <div className="w-10 lg:w-12">
                                        <img src="https://placeimg.com/192/192/people" />
                                    </div>
                                </Link>
                                <Link className="avatar placeholder">
                                    <div className="w-10 lg:w-12 bg-neutral-focus text-neutral-content">
                                        <span>+99</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className='hidden lg:block'>
                            <div className='flex items-center'>
                                <Link to='/main/setting' className={`flex items-center mr-5 bg-primary p-1 px-2 rounded-lg hover:bg-blue-800 ${hasAccess ? 'block' : 'hidden'}`}>

                                    <h1><AiFillSetting className='text-xl text-white font-bold mr-1 '> </AiFillSetting></h1>

                                    <h1 className='text-lg text-white font-bold'>Settings</h1>
                                </Link>
                                <Link className='flex items-center mr-5 bg-green-600 p-1 px-2 hover:bg-green-800 rounded-lg'>
                                    <h1><BsPlusLg className='text-lg text-white font-bold mr-1 '></BsPlusLg></h1>
                                    <h1 className='text-lg text-white font-bold'>Invite</h1>
                                </Link>
                                <Link className={`flex items-center mr-5 bg-red-600 p-1 px-2 rounded-lg hover:bg-red-800 ${isAdmin ? 'hidden' : 'block'}`}>
                                    <h1><BsBoxArrowLeft className='text-lg text-white font-bold mr-1 '></BsBoxArrowLeft></h1>
                                    <h1 className='text-lg text-white font-bold'>Leave</h1>
                                </Link>
                            </div>
                        </div>
                        <div className='block lg:hidden'>
                            <button className="btn btn-ghost btn-circle">
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                        <BsThreeDots></BsThreeDots>
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-20">
                                        <li>
                                            <Link to='/main/setting/' className={`flex items-center ${hasAccess ? 'block' : 'hidden'}`}>

                                                <h1 className='mr-1 ml-0'><AiFillSetting className='text-lg text-black font-bold'> </AiFillSetting></h1>

                                                <h1 className='text-sm text-black font-bold ml-0'>Settings</h1>
                                            </Link>

                                        </li>
                                        <li >
                                            <Link className='flex items-center'>
                                                <h1 className='mr-1 ml-0'><BsPlusLg className='text-sm text-black font-bold'></BsPlusLg></h1>
                                                <h1 className='text-sm text-black font-bold ml-0'>Invite</h1>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className={`flex items-center ${isAdmin ? 'hidden' : 'block'}`}>
                                                <h1 className='mr-1 ml-0'><BsBoxArrowLeft className='text-sm text-black font-bold'></BsBoxArrowLeft></h1>
                                                <h1 className='text-sm text-black font-bold ml-0'>Leave</h1>
                                            </Link>
                                        </li>

                                    </ul>

                                </div>
                            </button>
                        </div>

                    </div>
                    <div className='my-4 mx-4'>
                        <hr className='h-[1px] bg-slate-300 shadow-lg'></hr>
                        <div>
                            <ul className="nav nav-tabs nav-justified lg:navbar-start flex flex-col md:flex-row flex-wrap list-none border-b-0 px-10 lg:px-0 mb-4" id="tabs-tab3"
                                role="tablist">
                                <li className="nav-item flex-grow text-center" role="presentation">
                                    <a href="#tabs-home3" className="
      nav-link
      w-full
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      h-auto
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
      active
    " id="tabs-home-tab3" data-bs-toggle="pill" data-bs-target="#tabs-home3" role="tab" aria-controls="tabs-home3"
                                        aria-selected="true">Feed</a>
                                </li>
                                <li className="nav-item flex-grow text-center" role="presentation">
                                    <a href="#tabs-profile3" className="
      nav-link
      w-full
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
    " id="tabs-profile-tab3" data-bs-toggle="pill" data-bs-target="#tabs-profile3" role="tab"
                                        aria-controls="tabs-profile3" aria-selected="false">Members</a>
                                </li>
                                <li className="nav-item flex-grow text-center" role="presentation">
                                    <a href="#tabs-messages3" className="
      nav-link
      w-full
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
    " id="tabs-messages-tab3" data-bs-toggle="pill" data-bs-target="#tabs-messages3" role="tab"
                                        aria-controls="tabs-messages3" aria-selected="false">About</a>
                                </li>
                                <li className="nav-item flex-grow text-center" role="presentation">
                                    <a href="#tab-groupMessage" className="
      nav-link
      w-full
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
    " id="tabs-groupMessage-tab3" data-bs-toggle="pill" data-bs-target="#tab-groupMessage" role="tab"
                                        aria-controls="tab-groupMessage" aria-selected="false">My Post</a>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>
                <div>
                    <div className="tab-content" id="tabs-tabContent3">
                        <div className="tab-pane fade show active" id="tabs-home3" role="tabpanel" aria-labelledby="tabs-home-tab3">
                            <CommunityPostTab />



                        </div>

                        <CommunityMemebersTab />

                        <div className="tab-pane fade" id="tabs-messages3" role="tabpanel" aria-labelledby="tabs-profile-tab3">
                            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 mt-5 pt-5 text-center'>
                                <h1 className='text-xl font-bold'>About the Club</h1>
                            </div>
                            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 mt-5 pt-5 px-5'>
                                <p className='text-lg'>
                                    {cDes}
                                </p>
                            </div>
                        </div>
                        {/* <div className="tab-pane fade" id="tab-groupMessage" role="tabpanel" aria-labelledby="tabs-groupMessage-tab3">
                            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 mt-5 pt-5 flex justify-center items-center'>
                                <h1 className='text-xl font-bold'>Group Conversation</h1>
                            </div>
                            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 mt-5 pt-5 flex justify-center items-center'>
                                <CommunityConversion></CommunityConversion>
                            </div>
                        </div> */}
                        <div className="tab-pane fade" id="tab-groupMessage" role="tabpanel" aria-labelledby="tabs-groupMessage-tab3">
                            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 mt-5 pt-5 flex justify-center items-center'>
                                <h1 className='text-xl font-bold'>My Post List</h1>
                            </div>
                            <div className='bg-white rounded-lg shadow-xl mx-0 lg:mx-20 pb-5 mt-5 pt-5 flex justify-center items-center'>
                                {/* <MyCommunityPost></CommunityConversion> */}
                                <MyCommunityPostTab />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default MyCommunitySingle;
