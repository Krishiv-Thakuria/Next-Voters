"use client";

import React, { FC } from "react";
import headerItems from "@/data/header";

const Header: FC = () => {
  const isLoggedIn = false; // Replace with your auth state

  return (
    <header className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-[18px] font-bold text-gray-900 font-poppins mr-4">
              NV
            </span>
          </div>
          <a
            href={"/fellowship"}
            className="bg-[#E12D39] text-[12px] text-white px-4 py-2 rounded font-medium font-poppins"
          >
            {"BECOME A FELLOW"}
          </a>

          <div className="flex flex-col md:flex-row gap-2">
            {headerItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-md text-gray-900 px-4 py-2 rounded font-medium font-poppins"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Sign Out
              </button>
            </>
          ) : (
            <a 
              href="/auth/login" 
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Sign In
            </a>
          )}
      </div>
      </div>
    </header>
  );
};

export default Header;