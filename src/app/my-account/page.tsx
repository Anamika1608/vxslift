"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from 'react-hot-toast';
import useAppContext from '../../context/authContext.js'

const AccountPage = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const [userID, setUserID] = useState("");
    const { loggedIn, setLoggedIn } = useAppContext()
    // const [loggedIn, setLoggedIn] = useState(false);
    const [purchasedPlans, setPurchasedPlans] = useState([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        const getPurchasedPlans = async () => {
            if (!userID) return;
            try {
                const response = await axios.post(`${url}/getPurchasedPlan`, { userID }, { withCredentials: true });
                setPurchasedPlans(response.data);
            } catch (error) {
                console.log('Error in getting purchased plans:', error);
            }
        };

        getPurchasedPlans();
    }, [userID, url]);

   
    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-300">Your Purchased Plans</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {purchasedPlans.length > 0 ? (
                    purchasedPlans.map((plan) => (
                        <div key={plan.plan._id} className="bg-gray-700 rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
                            <h3 className="text-xl font-semibold mb-2 text-white">{plan.plan.name}</h3>
                            <p className="text-gray-300">Price: {plan.plan.pricing} Rs</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 text-lg">No purchased plans found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountPage;