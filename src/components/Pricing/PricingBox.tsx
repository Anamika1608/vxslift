'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from 'react-hot-toast';

const PricingBox = (props: {
  price: string;
  duration: string;
  packageName: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const { price, duration, packageName, subtitle, children } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);


  useEffect(() => {
    const getUser = async () => {
      if (!session?.user) {
        try {
          const response = await axios.get(`${url}/get_user`, {
            withCredentials: true
          });
          setUserID(response.data.id);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      } else {
        try {
          const response = await axios.get(`${url}/findUserByMail`, {
            params: { mail: session.user.email },
            withCredentials: true
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


  const handlePayment = async (planPrice: string, packageName: string) => {
    if (!userID) {
      router.push('/signin');
    } else {
      setIsLoading(true);
      try {
        console.log("Creating order...");
        console.log(planPrice)
        const options = {
          courseId: 1,
          price: planPrice,
        };

        const res = await axios.post(`${url}/createOrder`, options, { withCredentials: true });
        const data = res.data;
        console.log("Order created:", data);

        const paymentObject = new (window as any).Razorpay({
          key: key_id,
          amount: data.amount,
          currency: data.currency,
          order_id: data.id,
          name: "vxslift",
          description: `Payment for ${packageName}`,
          handler: function (response: any) {
            console.log("Payment response:", response);
            const verificationOptions = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              user_ID: userID,
              packageName: packageName,
            };
            axios
              .post(`${url}/verifyPayment`, verificationOptions, { withCredentials: true })
              .then((res) => {
                console.log("Verification response:", res.data);
                if (res.data.success) {
                  
                  redirect("https://docs.google.com/forms/d/1ZS5A31KR0cwtb1qAp-e6m1sxId4AARy0PDoEtO0YypQ/viewform?edit_requested=true")
                } else {
                  toast.error('Payment Failed !');
                }
              })
              .catch((err) => {
                toast.error('Payment failed. Please try again !');
                console.error("Verification error:", err);
                  toast.error('Payment Failed !');
              })
              .finally(() => {
                toast.success('Payment successfull !');
                setIsLoading(false);
              });
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          },
          theme: {
            color: "#3399cc",
          },
        });

        paymentObject.on('payment.failed', function (response: any) {
          console.error("Payment failed:", response.error);
          toast.error('Payment Failed . Please try again!');

          setIsLoading(false); 
        });

        paymentObject.open();
      } catch (err) {
        console.log(err)
        console.error("Error in creating order:", err);
        toast.error('Failed to initiate the payment!');

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

            className={`flex w-full items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp `}
          >
            {'Book Now'}
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(PricingBox), { ssr: false });