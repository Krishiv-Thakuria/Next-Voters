'use client';

import React, { useState } from 'react';
import { handleSubscribeEmail } from '@/server-actions/sub-to-email';

const EmailServiceProduct = () => {
  const [email, setEmail] = useState('');
  
  return (
    <div className="w-full bg-white">
        <div className="max-w-[680px] mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-poppins leading-tight">
            Become informed.
          </h1>
          
          <p className="text-[16px] text-gray-600 mb-10 font-poppins leading-relaxed">
            Changing the world comes from being informed.
          </p>
          
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button 
            className="inline-block px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-poppins font-medium"
            onClick={async () => {
              await handleSubscribeEmail(email);
              setEmail('');
            }}
          >
            Subscribe
          </button>
        </div>
    </div>
  );
}

export default EmailServiceProduct;