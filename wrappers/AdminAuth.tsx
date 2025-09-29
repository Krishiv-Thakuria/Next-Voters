import { handleVerifyToken } from '@/lib/jwt'
import React, { FC, ReactNode } from 'react'

interface AdminAuthProps {
    children: ReactNode
}
const AdminAuth: FC<AdminAuthProps> = ({ children }) => {

  const jwtToken = prompt("What is your JWT token:")

  if (!jwtToken) {
    alert("You did not input anything. Try agan.")
    return <p>Refresh page</p>
  }

  const isVerified = handleVerifyToken(jwtToken)

  if (!isVerified) {
    alert("Invalid token. You do not have the permission to view this page.")
    return <p>Refresh page</p>
  }

  return <>{children}</>
  
}

export default AdminAuth