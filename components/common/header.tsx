"use client";

import React, { FC, useState } from "react";
import headerItems from "@/data/header";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Menu, X } from "lucide-react";

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
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav
          className={`md:flex ${isOpen ? "block" : "hidden"} bg-gray-50 w-screen text-sm font-medium font-poppins text-gray-900 px-4 py-2`}
          style={{ backdropFilter: "blur(3px)" }}
        >
          <ul className="flex flex-col md:flex-row items-center gap-4">
            {headerItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <LogoutLink className="md:block hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
          Sign Out
        </LogoutLink>
      </div>
    </header>
  );
};

export default Header;