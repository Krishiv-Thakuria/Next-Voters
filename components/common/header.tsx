"use client";

import React, { FC, useState } from "react";
import headerItems from "@/data/header";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <header className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[18px] font-bold text-gray-900 font-poppins">
            NV
          </span>
          <a
            href={"/fellowship"}
            className="bg-[#E12D39] text-[12px] text-white px-4 py-2 rounded font-medium font-poppins"
          >
            BECOME A FELLOW
          </a>

          <button
            onClick={toggleMenu}
            aria-label={`${isOpen ? "Close" : "Open"} menu`}
            className="md:hidden"
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={`${
                  isOpen ? "M6 18L18 6M6 6l12 12" : "M3 6H21V8H3V6M3 12H21V14H3V12M3 18H21V20H3V18Z"
                }`}
              />
            </svg>
          </button>
        </div>

        <nav className={`md:flex ${isOpen ? "block" : "hidden"}`}>
          {headerItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-md text-gray-900 px-4 py-2 rounded font-medium font-poppins block"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <LogoutLink className="md:block hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
          Sign Out
        </LogoutLink>
      </div>
    </header>
  );
};

export default Header;