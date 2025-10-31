import React, { useState } from "react";
import headerItems from "@/data/header";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Menu, X } from "lucide-react";

const MobileHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <header className="w-full bg-white">
      <div className="px-6 py-4 flex justify-between items-center">
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
        </div>

        <button
          onClick={toggleMenu}
          aria-label={`${isOpen ? "Close" : "Open"} menu`}
          className="md:hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <nav 
          className="bg-white w-full text-sm font-medium font-poppins text-gray-900 px-4 py-2"
          style={{ backdropFilter: "blur(3px)" }}
        >
          <ul className="flex flex-col gap-4 py-4">
            {headerItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="block p-2 rounded hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <LogoutLink className="block p-2 text-gray-700 hover:bg-gray-100 rounded w-full text-left">
                Sign Out
              </LogoutLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;