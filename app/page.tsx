"use client";

import { Brain } from "lucide-react";
import Link from "next/link";
import PixelLifeBackground from "@/components/pixel-life-background";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-mono overflow-hidden">
      <PixelLifeBackground />
      <div className="text-center z-10">
        <div className="w-24 h-24 mx-auto relative">
          <Brain className="w-full h-full text-pink-500 absolute inset-0" />
        </div>
        <Link
          href="/signin"
          className="mt-8 inline-block px-6 py-3 text-base font-medium bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-300"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
