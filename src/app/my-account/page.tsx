'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast';

function AccountPage() {
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
                } catch (error) {
                    console.error('Error fetching user by mail:', error);
                }
            }
        };

        if (!userID) {
            getUser();
        }
    }, [session, url, userID]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${url}/get_user`, {
                    withCredentials: true,
                });
                if (response.data) {
                    setUser(true);
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            }
        };

        checkAuth();
    }, [setLoggedIn, url]);

    const handleSignOut = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                const response = await axios.get(`${url}/logout`);
                toast.success('Logged out successfully !');
                setLoggedIn(false);
                console.log(response.data);
                router.push('/');
            } catch (error) {
                toast.error('Error in logging out !');
                console.error('Error during logout:', error);
            }
        } else {
            toast.success('Logged out successfully!');
            setTimeout(() => {
                signOut({
                    callbackUrl: '/',
                });
            }, 500);  
        }
        
    };

    return (
        <div className="mt-44">
            <h1>Your Account</h1>

            <div className="purchased-plans">
                <h2>Purchased Plans</h2>
                {purchasedPlans.length > 0 ? (
                    purchasedPlans.map((plan) => (
                        <div key={plan._id} className="plan-card">
                            <h3>{plan.name}</h3>
                            <p>Price: ${plan.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No purchased plans found.</p>
                )}
            </div>

            <button onClick={handleSignOut} className="sign-out-button">
                Sign out
            </button>
        </div>
    );
}

export default AccountPage;
