"use client"

import React from 'react'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname();
  return (
      <header className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <a
              href={pathname === "/fellowship" ? "/" :"/fellowship"}
              className="bg-[#E12D39] text-[12px] text-white px-4 py-2 rounded font-medium font-poppins"
            >
              {pathname === "/fellowship" ? "HOME" : "BECOME A FELLOW"}
            </a>
        </div>
          <div className="flex items-center">
            <span className="text-[18px] font-bold text-gray-900 font-poppins">NV</span>
          </div>
        </div>
      </header>  
    )
}

export default Header