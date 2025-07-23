import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const token = localStorage.getItem('token');
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  
  const handleLogout = () => {
    alert(`${userDetails.name} logout successfully`);
    localStorage.removeItem('token'," ");
    localStorage.removeItem('userDetails');
    window.location.href = '/';
  };
  return (
      <nav className="bg-gray-900 py-2 w-full fixed z-0 top-0">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex shrink-0 items-center gap-2">
          <img src="https://api.dicebear.com/7.x/icons/svg?seed=SmartChat" alt="AIChatBot" className="h-12 w-auto rounded-full" />
          <h1 className='text-white text-2xl font-bold'>AIChatBot</h1>
        </div>
    
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <div className="relative ml-3">
          <div>{
            token ? 
            (
            <div className='flex items-center justify-center gap-4'>
               <h1 className='text-white text-xl'>{userDetails ? userDetails?.name : ""}</h1>
              <button 
              onClick={handleLogout}
              id="user-menu-button" type="button" aria-expanded="false" aria-haspopup="true" className="relative flex text-xl text-white font-semibold rounded-full bg-blue-500 px-7 py-2  focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
               Logout
              </button>
            </div>
            ):(
             <button id="user-menu-button" type="button" aria-expanded="false" aria-haspopup="true" className="relative flex text-xl text-white font-semibold rounded-full bg-blue-500 px-7 py-2  focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
           <Link href="/login"> Login </Link>
            </button>
            )
            }
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
  )
}

export default Navbar
