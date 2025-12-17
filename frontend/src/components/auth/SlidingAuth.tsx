'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { GraduationCap } from 'lucide-react';

export function SlidingAuth({ defaultState = 'login' }: { defaultState?: 'login' | 'signup' }) {
    const [isSignup, setIsSignup] = useState(defaultState === 'signup');

    const toggle = () => setIsSignup(!isSignup);

    const overlayVariants = {
        login: { x: "0%" },
        signup: { x: "-100%" }
    };

    const textVariants = {
        login: { x: "0%" },
        signup: { x: "50%" }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-black p-4 relative overflow-hidden transition-colors duration-500">
            {/* Dark Mode Background Effects (Animated - INTENSIFIED) */}
            <div className="hidden dark:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px] animate-pulse duration-[4000ms]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse delay-700 duration-[4000ms]"></div>
            </div>

            <div className="relative w-full max-w-[850px] min-h-[500px] md:min-h-[600px] bg-background/95 dark:bg-[#111]/80 backdrop-blur-3xl rounded-[20px] shadow-2xl dark:shadow-[0_0_50px_-12px_rgba(56,189,248,0.3)] border border-white/20 dark:border-white/10 overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10">

                {/* Forms Area */}
                <div className="col-span-1 md:col-span-2 relative h-full flex flex-col justify-center">
                    {/* Login Form */}
                    <div className={`
                        w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-500 ease-in-out
                        ${isSignup ? 'hidden md:flex md:opacity-0 md:pointer-events-none md:translate-x-[-20%]' : 'flex opacity-100 md:translate-x-0'}
                        md:absolute md:top-0 md:left-0
                        [&_input]:bg-white [&_input]:text-black [&_input]:border-gray-200 dark:[&_input]:bg-white dark:[&_input]:text-black dark:[&_label]:text-white
                    `}>
                        <LoginForm />
                        {/* Mobile Toggle */}
                        <div className="mt-6 text-center md:hidden">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <button onClick={toggle} className="text-primary font-bold hover:underline">
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <div className={`
                        w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-500 ease-in-out
                        ${!isSignup ? 'hidden md:flex md:opacity-0 md:pointer-events-none md:translate-x-[20%]' : 'flex opacity-100 md:translate-x-0'}
                        md:absolute md:top-0 md:right-0
                        [&_input]:bg-white [&_input]:text-black [&_input]:border-gray-200 dark:[&_input]:bg-white dark:[&_input]:text-black dark:[&_label]:text-white
                    `}>
                        <SignupForm />
                        {/* Mobile Toggle */}
                        <div className="mt-6 text-center md:hidden">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <button onClick={toggle} className="text-primary font-bold hover:underline">
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sliding Overlay (Desktop Only) */}
                <motion.div
                    className="hidden md:block absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-sky-500 to-blue-700 dark:from-sky-500 dark:to-blue-600 text-white z-50 overflow-hidden shadow-2xl"
                    initial={false}
                    animate={isSignup ? "signup" : "login"}
                    variants={overlayVariants}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                    <motion.div
                        className="relative -left-[100%] w-[200%] h-full flex"
                        initial={false}
                        animate={isSignup ? "signup" : "login"}
                        variants={textVariants}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                        {/* Left Panel (Signup Mode Active -> Overlay cover Login) */}
                        <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-3 bg-white/20 rounded-xl shadow-inner backdrop-blur-md">
                                    <GraduationCap size={32} className="text-white" />
                                </span>
                                <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Listo</h1>
                            </div>
                            <h2 className="text-2xl font-semibold text-white">Welcome Back!</h2>
                            <p className="text-blue-50 leading-relaxed font-medium">
                                Ready to organize your tasks? Sign in to continue your productivity journey with Listo.
                            </p>
                            <button onClick={toggle} className="px-8 py-3 rounded-full font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg text-sm uppercase tracking-wider transform hover:scale-105 active:scale-95">
                                Sign In
                            </button>
                        </div>

                        {/* Right Panel (Login Mode Active -> Overlay cover Signup) */}
                        <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-3 bg-white/20 rounded-xl shadow-inner backdrop-blur-md">
                                    <GraduationCap size={32} className="text-white" />
                                </span>
                                <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Listo</h1>
                            </div>
                            <h2 className="text-2xl font-semibold text-white">Hello, Friend!</h2>
                            <p className="text-blue-50 leading-relaxed font-medium">
                                Join Listo today to streamline your workflow and master your daily schedule.
                            </p>
                            <button onClick={toggle} className="px-8 py-3 rounded-full font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg text-sm uppercase tracking-wider transform hover:scale-105 active:scale-95">
                                Sign Up
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
}
