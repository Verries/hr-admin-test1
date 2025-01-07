"use client";  // Ensure this is a client-side component

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const ConfirmSignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Call signOut from next-auth or your custom sign-out method
      await signOut({ callbackUrl: '/auth/signin' });  // Use the callbackUrl to ensure the redirect happens after sign out
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const handleCancel = () => {
    router.push('/'); // Redirect to home or wherever
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(135deg,_#006f72,_#00a9a6)]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">Sign Out Confirmation</h2>
        <p className="text-lg text-gray-700 text-center mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSignOut}
            className="px-6 py-2 text-white bg-gradient-to-r from-[#006f72] to-[#00a9a6] rounded-md transition duration-300 hover:from-[#005d65] hover:to-[#009c98]"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignOut;
