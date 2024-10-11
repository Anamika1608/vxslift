"use client";
import { useState, useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import axios from "axios";

const Pricing = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            </PricingBox>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;