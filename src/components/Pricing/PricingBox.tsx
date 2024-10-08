'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const PricingBox = (props: {
  price: string;
  duration: string;
  packageName: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const { status } = useSession();
  const { price, duration, packageName, subtitle, children } = props;
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const url = 'http://localhost:8000';

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${url}/get_user`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    getUser();
  }, []);
  const key_id = process.env.RAZORPAY_API_KEY
  const handlePayment = async (planPrice: string, packageName: string) => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else {
      setIsLoading(true);
      try {
        console.log("inside try and catch")
        const { data: { order } } = await axios.post(`${url}/checkout`, { price: planPrice }, { withCredentials: true });

        const options = {
          key_id: key_id,
          amount: order.amount,
          currency: "INR",
          name: "vxslift",
          description: "Premium Plan Subscription",
          order_id: order.id,
          callback_url: "http://localhost:8000/paymentVerification",
          prefill: {
            name: user?.name || "Guest User", 
            email: user?.email || "guest@example.com"
          },
          notes: {
            address: "Razorpay Corporate Office"
          },
          theme: {
            color: "#121212"
          }
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } catch (err) {
        console.error('Payment initiation error:', err);
      } finally {
        setIsLoading(false);
      }
    } 
  };

  return (
    <div className="w-full">
      <div className="relative z-10 rounded-sm bg-white px-8 py-10 shadow-three hover:shadow-one dark:bg-gray-dark dark:shadow-two dark:hover:shadow-gray-dark">
        <div className="sm:flex items-center justify-between">
          <h3 className="price mb-2 text-[32px] font-bold text-black dark:text-white">
            ₹<span className="amount">{price}</span>
            <span className="time text-lg font-medium text-body-color">
              /{duration}
            </span>
          </h3>
          <h4 className="mb-2 text-xl font-bold text-dark dark:text-white">
            {packageName}
          </h4>
        </div>
        <p className="mb-7 text-base text-body-color">{subtitle}</p>
        <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
          <button
            onClick={() => handlePayment(price, packageName)}
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default dynamic(()=> Promise.resolve(PricingBox), {ssr: false})
