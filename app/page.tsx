"use client"
import AboutUs from '@/components/home/AboutUs'
import CallToAction from '@/components/home/CallToAction'
import Features from '@/components/home/Features'
import Footer from '@/components/home/Footer'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import React from 'react'


const Page = () => {

  return (
    <div className='w-full min-h-screen bg-gray-100'>
      <Hero />
      <Features />
      <AboutUs />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Page