'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
const PricingBox = (props: {
  price: string;
  duration: string;
  packageName: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const { status } = useSession();
  const { price, duration, packageName, subtitle, children } = props;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handlePayment = () => {
    console.log("button clicked")
    console.log(status)
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else {
      router.push('/payment');
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
            onClick={() => {
              // makePayment({ productId: "example_ebook" });
            }}
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}

          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </button>


        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PricingBox;
