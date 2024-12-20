'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from 'react-hot-toast';
import useAppContext from '../../context/authContext.js'

const PricingBox = (props: {
  planId: string;
  price: string;
  duration: string;
  packageName: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const { planId, price, duration, packageName, subtitle, children } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const { loggedIn } = useAppContext()
  const [planStatus, setPlanStatus] = useState("");
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

    // Add listener for Google Form completion
    // const handleGoogleFormCompletion = async (event: MessageEvent) => {
    //   if (event.origin === "https://docs.google.com" && event.data.formSubmitted) {
    //     await updatePlanStatus("form_filled");
    //     window.open("https://calendly.com/vxsxlift", "_blank");
    //   }
    // };

    // // Add listener for Calendly completion
    // const handleCalendlyCompletion = async (event: MessageEvent) => {
    //   if (event.origin === "https://calendly.com" && event.data.event === "calendly.event_scheduled") {
    //     await updatePlanStatus("appointment_booked");
    //     router.push("/my-account");
    //   }
    // };

    // window.addEventListener("message", handleGoogleFormCompletion);
    // window.addEventListener("message", handleCalendlyCompletion);

    // return () => {
    //   window.removeEventListener("message", handleGoogleFormCompletion);
    //   window.removeEventListener("message", handleCalendlyCompletion);
    // };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (loggedIn) {
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
      }
    };

    if (!userID) {
      getUser();
    }
  }, [session, url, userID]);

  useEffect(() => {
    const fetchPlanStatus = async () => {
      console.log(userID)
      console.log(planId)
      if (userID && planId && loggedIn) {
        try {
          const response = await axios.post(`${url}/getStatus`, {
            planId: planId, userId: userID
          }, {
            withCredentials: true
          });
          setPlanStatus(response.data.status);
        } catch (error) {
          console.error('Error fetching plan status:', error);
          setPlanStatus("");
        }
      }
    };

    fetchPlanStatus();
  }, [userID, planId, url]);

  const updatePlanStatus = async (newStatus: string) => {
    try {
      await axios.post(`${url}/updateStatus`, {
        planId: planId,
        userId: userID,
        status: newStatus
      }, { withCredentials: true });
      setPlanStatus(newStatus);
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  };

  const handlePayment = async () => {
    if (!userID) {
      router.push('/signin');
    } else {
      setIsLoading(true);
      try {
        console.log("Creating order...");
        const options = {
          courseId: 1,
          price: price,
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
          handler: async function (response: any) {
            console.log("Payment response:", response);
            const verificationOptions = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              user_ID: userID,
              packageName: packageName,
            };
            try {
              const res = await axios.post(`${url}/verifyPayment`, verificationOptions, { withCredentials: true });
              console.log("Verification response:", res.data);
              if (res.data.success) {
                toast.success('Payment successful!');
                await updatePlanStatus("payment_done");
                // Open Google Form in a new tab
                window.open("https://docs.google.com/forms/d/e/1FAIpQLSdqnina5SQ9Y_bu0BMVaqA_2R7YDSXzRWWGqb_SCEai2i-C0w/viewform?fbzx=6541293770029021819", "_blank");
              } else {
                toast.error('Payment Failed!');
              }
            } catch (err) {
              console.error("Verification error:", err);
              toast.error('Payment Failed!');
            } finally {
              setIsLoading(false);
            }
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
          toast.error('Payment Failed. Please try again!');
          setIsLoading(false);
        });

        paymentObject.open();
      } catch (err) {
        console.error("Error in creating order:", err);
        toast.error('Failed to initiate the payment!');
        setIsLoading(false);
      }
    }
  };

  const getButtonText = () => {
    switch (planStatus) {
      case "payment_done":
        return "Fill the Form";
      case "form_filled":
        return "Schedule Appointment";
      case "appointment_booked":
        return "View Dashboard";
      default:
        return "Book Now";
    }
  };

  const getButtonAction = () => {
    switch (planStatus) {
      case "payment_done":
        return () => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdqnina5SQ9Y_bu0BMVaqA_2R7YDSXzRWWGqb_SCEai2i-C0w/viewform?fbzx=6541293770029021819", "_blank");
      case "form_filled":
        return () => window.open("https://calendly.com/vxsxlift", "_blank");
      case "appointment_booked":
        return () => router.push("/my-account");
      default:
        return handlePayment;
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
          {planStatus === "appointment_booked" ? (
            <p>You have purchased this plan. Check in My Account.</p>
          ) : (
            <>
              {planStatus && planStatus !== "default" && (
                <p>You have started the process for this plan.</p>
              )}
              <button
                onClick={getButtonAction()}
                className={`flex w-full items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp`}
              >
                {getButtonText()}
              </button>
            </>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(PricingBox), { ssr: false });