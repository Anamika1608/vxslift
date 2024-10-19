"use client";
import { useState, useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import axios from "axios";
import { useSession } from "next-auth/react";
import useAppContext from '../../context/authContext.js'
const Pricing = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState("");
  const { loggedIn } = useAppContext()
  const [purchasedPlans, setPurchasedPlans] = useState({});
  const { data: session, status } = useSession();

  useEffect(() => {
    const getUser = async () => {
     if(loggedIn){
      if (!session?.user) {
        try {
          const response = await axios.get(`${url}/get_user`, {
            withCredentials: true,
          });
          setUserID(response.data.id);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        try {
          const response = await axios.get(`${url}/findUserByMail`, {
            params: { mail: session.user.email },
            withCredentials: true,
          });
          setUserID(response.data.userId);
        } catch (error) {
          console.error("Error fetching user by mail:", error);
        }
      }
     }
    };

    if (!userID) {
      getUser();
    }
  }, [session, url, userID]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const response = await axios.get(`${url}/getPlans`);
        setPlans(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load pricing plans. Please try again later.");
        setLoading(false);
      }
    };
    getPlans();
  }, [url]);

 
  // const checkPurchased = async (planId) => {
  //   try {
  //     const response = await axios.post(`${url}/checkPurchasedPlan`, {
  //       plan_id: planId,
  //       user_id: userID,
  //     });
  //     return response.data.purchased; 
  //   } catch (error) {
  //     console.error("Error checking purchased plan:", error);
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   const checkAllPurchasedPlans = async () => {
  //     if (userID && plans.length > 0) {
  //       const purchasedStatus = {};
  //       for (const plan of plans) {
  //         purchasedStatus[plan._id] = await checkPurchased(plan._id);
  //       }
  //       setPurchasedPlans(purchasedStatus);
  //     }
  //   };

  //   checkAllPurchasedPlans();
  // }, [plans, userID]);

  if (loading) return <div>Loading pricing plans...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Simple and Affordable Pricing"
          paragraph="Choose the plan that best fits your needs."
          center
          width="665px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingBox
              key={plan._id}
              planId = {plan._id}
              packageName={plan.name}
              price={plan.pricing}
              duration="onetime"
              subtitle={
                index === 0
                  ? "Have a 1:1 consultation."
                  : index === 1
                  ? "Maxx your looks."
                  : "Get your workout plans."
              }
            >
              <OfferList text="All UI Components" status="active" />
              <OfferList text="Use with Unlimited Projects" status="active" />
              <OfferList text="Commercial Use" status="active" />
              <OfferList text="Email Support" status="active" />
              <OfferList
                text="Lifetime Access"
                status={index > 0 ? "active" : "inactive"}
              />
              <OfferList
                text="Free Lifetime Updates"
                status={index === 2 ? "active" : "inactive"}
              />

              {/* {purchasedPlans[plan._id] && (
                <div className="text-green-600 mt-4">
                  You have already purchased this plan.
                  Check in <a href="/my-account" className="underline">My Account</a>
                </div>
              )} */}
            </PricingBox>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
