'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '../lib/api';
import { SchemeCard } from '../components/SchemeCard';
import gsap from 'gsap';

export default function HomePage() {
  const [schemes, setSchemes] = useState([]);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get('/schemes');
        setSchemes(response.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch schemes', error);
      }
    };
    fetchSchemes();

    // GSAP Animations
    if (heroRef.current) {
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  const features = [
    {
      icon: '☀️',
      title: 'Free Solar Rooftop',
      description: 'Get up to 300 units of free electricity every month with rooftop solar installation'
    },
    {
      icon: '💰',
      title: 'Government Subsidy',
      description: 'Up to ₹78,000 subsidy for 3kW solar system installation'
    },
    {
      icon: '📱',
      title: 'Easy Application',
      description: 'Simple online application process through our platform'
    },
    {
      icon: '🔧',
      title: 'Professional Installation',
      description: 'Certified vendors and quality assured solar panel installation'
    }
  ];

  const benefits = [
    { icon: '🌱', title: 'Reduce Carbon Footprint', value: '1 Crore Households Target' },
    {
      icon: '⚡', title: 'Save on Electricity', value: 'Up to 300 Units/Month Free'
    },
    { icon: '💵', title: 'Earn Extra Income', value: 'Sell Surplus to Grid' },
    { icon: '🏆', title: 'Quality Assured', value: '25 Years Warranty' }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Register on Portal',
      description: 'Create your account on PM Surya Ghar portal',
      color: 'bg-blue-500'
    },
    {
      step: '2',
      title: 'Apply for Subsidy',
      description: 'Submit application with required documents',
      color: 'bg-green-500'
    },
    {
      step: '3',
      title: 'Get Approval',
      description: 'Receive feasibility approval from DISCOM',
      color: 'bg-purple-500'
    },
    {
      step: '4',
      title: 'Install Solar',
      description: 'Choose vendor and install solar system',
      color: 'bg-orange-500'
    },
    {
      step: '5',
      title: 'Net Metering',
      description: 'Get net meter installed and commissioned',
      color: 'bg-pink-500'
    },
    {
      step: '6',
      title: 'Receive Subsidy',
      description: 'Subsidy credited directly to your account',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-gradient-to-r from-green-700 via-green-600 to-blue-600 dark:from-green-800 dark:via-green-700 dark:to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Solar Panels"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-blue-700/90 dark:from-green-800/95 dark:to-blue-800/95 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6">
              <span className="animate-pulse mr-2">●</span>
              PM Surya Ghar: Muft Bijli Yojana
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Go Solar with DPCG
            </h1>
            <p className="mt-6 text-xl text-green-100 dark:text-green-200 max-w-3xl mx-auto">
              Install rooftop solar and get up to ₹78,000 subsidy. Save money, save environment, and generate your own electricity!
            </p>
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <Link
                href="/schemes"
                className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-green-700 dark:text-green-900 bg-white hover:bg-green-50 dark:hover:bg-green-100 transform hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                View Schemes
              </Link>
              <Link
                href="/apply"
                className="flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-lg shadow-lg text-white hover:bg-white/10 transform hover:scale-105 transition-all"
              >
                Apply for Subsidy
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">1 Cr+</div>
              <div className="text-sm text-green-100 mt-1">Target Households</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">₹78,000</div>
              <div className="text-sm text-green-100 mt-1">Max Subsidy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">300</div>
              <div className="text-sm text-green-100 mt-1">Free Units/Month</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">25 Yrs</div>
              <div className="text-sm text-green-100 mt-1">System Warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* PM Surya Ghar Yojana Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold text-green-600 dark:text-green-400 tracking-wide uppercase">Government Initiative</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              PM Surya Ghar: Muft Bijli Yojana
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              A flagship program to install rooftop solar systems in 1 crore households across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600"
                alt="PM Surya Ghar"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white text-xl">
                    🎯
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Program Objective</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    To achieve cumulative capacity of 40,000 MW from rooftop solar projects by providing central financial assistance
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl">
                    💡
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Key Benefits</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Save on electricity bills, earn from surplus power, reduce carbon footprint, and contribute to sustainable energy
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white text-xl">
                    🏘️
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Eligibility</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    All residential consumers with individual rooftops are eligible to apply for the scheme
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Solar Energy?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Installation Process */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Simple 6-Step Installation Process
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              From application to subsidy, we guide you through every step
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${step.color} text-white text-xl font-bold mb-4`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subsidy Calculator CTA */}
      <div className="py-16 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Calculate Your Subsidy Amount
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Find out how much subsidy you're eligible for based on your system capacity
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">1-2 kW</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">₹30,000/kW</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2-3 kW</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">₹18,000/kW</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">&gt;3 kW</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">₹78,000 Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{benefit.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Schemes Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 dark:text-green-400 tracking-wide uppercase">Opportunities</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl">
            Featured Government Schemes
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
            Explore the latest subsidies and incentives available for residential and commercial solar installations.
          </p>
        </div>
        <div className="mt-12 grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {Array.isArray(schemes) && schemes.length > 0 ? (
            schemes.map((scheme: any) => <SchemeCard key={scheme.id} scheme={scheme} />)
          ) : (
            <p className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400">No schemes found.</p>
          )}
        </div>
        <div className="mt-10 text-center">
          <Link href="/schemes" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-lg transform hover:scale-105 transition-all">
            View All Schemes
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 dark:bg-green-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to go solar?</span>
            <span className="block text-green-200">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-5 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
