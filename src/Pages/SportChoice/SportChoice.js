import React, { useEffect, useState } from 'react';
import Filter from '../../Components/Filter/Filter';

import UserCard from '../../Components/userCard/UserCard';
import { useParams } from 'react-router-dom';
// import { sports } from '../../Asset/Dummy/SportsInterestData';
import { API_URL } from '../../API/config';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading/Loading';

const SportChoice = () => {
    const params = useParams(); // Getting the id of the community from the url
    const [sport, setSport] = useState();
    const { data, refetch, isLoading, isError } = useQuery({
        queryKey: ['sportById', params?.id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/api/v1/sport/sports/${params.id}`, { // Getting the sport by id
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            console.log(data)
            setSport(data.sport);
            return data.sport;
        }
    });

    if (isLoading) {
        return <Loading />
    }
    if (!data) {
        return <h1>No Data</h1>
    }
    if (isError) {
        return <h1>Something went wrong</h1>
    }


    return (
        <div>
            <div className='text-3xl font-bold text-center my-16'>{sport?.name} Page</div>
            <Filter />
            <div className='divide-x-2 divide-black-100 divide-dashed' />
            <UserCard />
        </div >


    );
};

export default SportChoice;