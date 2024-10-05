'use client'

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function AccountPage() {
    const router = useRouter();

    const handleSignOut = (e) => {
        e.preventDefault();
        signOut({
            callbackUrl: '/'
        });
    };

    return (
      <button onClick={handleSignOut} className="cursor-pointer m-44">Sign out</button>
    )
}

export default AccountPage;
