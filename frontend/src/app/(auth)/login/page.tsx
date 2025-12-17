'use client';

import { SlidingAuth } from "@/components/auth/SlidingAuth";
import { MobileLogin } from "@/components/auth/MobileLogin";

export default function LoginPage() {
    return (
        <main className="w-full min-h-screen">
            {/* Mobile View (< 768px) */}
            <div className="md:hidden w-full h-full">
                <MobileLogin />
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block w-full h-full">
                <SlidingAuth defaultState="login" />
            </div>
        </main>
    );
}
