'use client';

import { SlidingAuth } from "@/components/auth/SlidingAuth";
import { MobileSignup } from "@/components/auth/MobileSignup";

export default function SignupPage() {
    return (
        <main className="w-full min-h-screen">
            {/* Mobile View (< 768px) */}
            <div className="md:hidden w-full h-full">
                <MobileSignup />
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block w-full h-full">
                <SlidingAuth defaultState="signup" />
            </div>
        </main>
    );
}
