"use client"

import { handleVerifyToken } from '@/lib/jwt'
import { useRouter } from 'next/navigation'
import React, { FC, ReactNode, useEffect, useState } from 'react'

interface AdminAuthProps {
    children: ReactNode
    className: string
}

const AdminAuth: FC<AdminAuthProps> = ({ children, className }) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const jwtToken = prompt("What is your JWT token:");
      if (!jwtToken) {
        alert("You did not input anything. Try again.");
        setIsVerified(false);
        return;
      }
      const verified = await handleVerifyToken(jwtToken);
      if (!verified) {
        alert("Invalid token. You do not have the permission to view this page.");
        setIsVerified(false);
      } else {
        setIsVerified(true);
      }
    };
    verify();
  }, []);

  if (isVerified === null) {
    return <p>Verifying...</p>;
  }

  if (!isVerified) {
    router.push("/admin/request-token")
    return null
  }

  return <div className={className}>{children}</div>;
}

export default AdminAuth