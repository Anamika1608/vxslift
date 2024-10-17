"use client"
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from 'react-hot-toast';

const AccountPage = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const [user, setUser] = useState(false);
    const [userID, setUserID] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
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

    useEffect(() => {
        const getUser = async () => {
            if (!session?.user) {
                try {
                    const response = await axios.get(`${url}/get_user`, {
                        withCredentials: true,
                    });
                    setUserID(response.data.id);
                    setUser(true);
                    setLoggedIn(true);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            } else {
                try {
                    const response = await axios.get(`${url}/findUserByMail`, {
                        params: { mail: session.user.email },
                        withCredentials: true,
                    });
                    setUserID(response.data.userId);
                    setUser(true);
                    setLoggedIn(true);
                } catch (error) {
                    console.error('Error fetching user by mail:', error);
                }
            }
        };

        getUser();
    }, [session, url]);

    const handleSignOut = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                await axios.get(`${url}/logout`);
                setLoggedIn(false);
                toast.success('Logged out successfully!');
                router.push('/');
            } catch (error) {
                toast.error('Error in logging out!');
                console.error('Error during logout:', error);
            }
        } else {
            toast.success('Logged out successfully!');
            setTimeout(() => {
                signOut({
                    callbackUrl: '/',
                });
            }, 1000);  
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-300">Your Purchased Plans</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {purchasedPlans.length > 0 ? (
                    purchasedPlans.map((plan) => (
                        <div key={plan._id} className="bg-gray-700 rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
                            <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                            <p className="text-gray-300">Price: {plan.pricing} Rs</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 text-lg">No purchased plans found.</p>
                    </div>
                )}
            </div>

            <button 
                onClick={handleSignOut} 
                className="w-full md:w-auto bg-red-600 text-white px-6 py-2 rounded-md font-semibold flex items-center justify-center hover:bg-red-700 transition duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign out
            </button>
        </div>
    );
};

export default AccountPage;