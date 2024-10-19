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


const Home = () => {

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
