"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";

// Dynamically import the components to enable code splitting
const MobileHeader = dynamic(() => import("./mobile-header"), { ssr: false });
const DesktopHeader = dynamic(() => import("./desktop-header"), { ssr: false });

const Header: FC = () => {  
    return (
      <>
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      </>
    );
};

export default Header;