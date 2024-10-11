'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

function AccountPage() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const [user, setUser] = useState(false);

    const [ loggedIn, setLoggedIn ] = useState(false);

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
                setLoggedIn(false);  
                console.log(response.data);
                router.push('/');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        } else {
            
            signOut({
                
                callbackUrl: '/'
            });
        }
    };

    return (
        <button onClick={handleSignOut} className="cursor-pointer m-44">
            Sign out
        </button>
    );
}

export default AccountPage;
