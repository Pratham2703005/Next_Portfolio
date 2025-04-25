'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import Profile from './Profile';

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Messages', path: '/messages' },
    { name: 'Games', path: '/games' },
  ];

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="transition-all duration-300 select-none bg-transparent z-100"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-[90%]">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-4xl font-bold text-white hover:text-gray-300 transition duration-300">
              pratham
            </h1>
          </Link>

          <div className="hidden md:block">
            <div className="relative flex items-center ml-10 space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  onMouseEnter={() => setActiveItem(item.path)}
                  onMouseLeave={() => setActiveItem(pathname)}
                >
                  <motion.div
                    className="relative py-1 px-1"
                    whileHover={{ 
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`uppercase text-sm font-light transition-colors duration-200 ${
                        activeItem === item.path ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {item.name}
                    </span>
                    {activeItem === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-white"
                        layoutId="activeNavIndicator"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            {status === 'loading' ? (
              <div className='text-white flex items-center'>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                LOADING...
              </div>
            ) : session ? (
              <Profile />
            ) : (
              <form action={async () => {
                await signIn('github')
              }}>
                <button 
                  type='submit' 
                  className='text-white bg-[#24292e] hover:bg-[#2c3137] px-4 py-2 rounded-md transition duration-300'
                >
                  Sign In with GitHub
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;