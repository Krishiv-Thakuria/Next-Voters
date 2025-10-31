import React from "react";
import headerItems from "@/data/header";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const DesktopHeader: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
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

        <nav className="text-sm font-medium font-poppins text-gray-900">
          <ul className="flex items-center gap-4">
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

        <LogoutLink className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
          Sign Out
        </LogoutLink>
      </div>
    </div>
  );
};

export default DesktopHeader;