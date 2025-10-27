"use client";

import React, { FC, useState } from "react";
import headerItems from "@/data/header";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            BECOME A FELLOW
          </a>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={`${
                  isOpen ? "M18 6L6 18" : "M3 6H21V8H3V6M3 12H21V14H3V12M3 18H21V20H3V18Z"
                }`}
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="flex flex-col gap-2">
            {headerItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-md text-gray-900 px-4 py-2 rounded font-medium font-poppins block"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}

        <LogoutLink className="md:block hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
          Sign Out
        </LogoutLink>
      </div>
    </header>
  );
};

export default Header;