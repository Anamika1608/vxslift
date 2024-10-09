'use client'
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { resolve } from "path";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Free Next.js Template for Startup and SaaS",
//   description: "This is Home for Startup Nextjs Template",
//   // other metadata
// };

const Home = () => {

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script);
    })
  }

  useEffect (()=>{
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
  },[])

  return (
    <>
      <ScrollUp />
      <Hero />
      <Testimonials />
      {/*<Features />*/}
      {/*<Video />*/}
      {/*<Brands />*/}
      {/*<AboutSectionOne />*/}
      {/*<AboutSectionTwo />*/}
      <Pricing />
      {/*<Blog />*/}
      {/*<Contact />*/}
    </>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false })
