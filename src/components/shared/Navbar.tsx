'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import Profile from './Profile';
import { Menu, X, Github, LogOut } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Messages', path: '/messages' },
    { name: 'Games', path: '/games' },
  ];

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="transition-all duration-300 select-none bg-transparent z-50 relative"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-[90%] mx-auto">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white hover:text-gray-300 transition duration-300">
              pratham
            </h1>
          </Link>

          {/* Desktop Navigation */}
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

          <div className="flex items-center">
            {/* Desktop Auth */}
            <div className="hidden md:block">
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
                    className='text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5'
                  >
                    <Github size={18} />
                    <span>Sign In with GitHub</span>
                  </button>
                </form>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {status !== 'loading' && session ? (
                <div onClick={toggleMenu} className="cursor-pointer">
                  <Profile />
                </div>
              ) : (
                <button
                  onClick={toggleMenu}
                  className="text-white hover:text-gray-300 focus:outline-none"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute inset-x-0 top-16 bg-black bg-opacity-90 backdrop-blur-sm py-3 rounded-b-lg shadow-xl z-50"
        >
          <div className="px-4 pt-2 pb-3 space-y-3 flex flex-col">
            {/* Show user info if logged in on mobile */}
            {session && (
              <div className="flex flex-col items-center border-b border-gray-700 pb-3 mb-2">
                <div className="flex items-center justify-center mb-2">
                  {session.user?.image && (
                    <Image
                      height={48}
                      width={48}
                      src={session.user.image} 
                      alt={session.user?.name || "User"} 
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">{session.user?.name}</p>
                  <p className="text-gray-400 text-sm truncate max-w-full">{session.user?.email}</p>
                </div>
              </div>
            )}
            
            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  activeItem === item.path 
                    ? 'text-white border-l-2 border-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
                } px-3 py-2 text-base uppercase font-light rounded-md transition duration-150`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Sign In button for mobile - only shown when not logged in */}
            {!session && status !== 'loading' && (
              <form action={async () => {
                await signIn('github')
              }}>
                <button 
                  type='submit' 
                  className='w-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium shadow-lg transition duration-300 mt-2'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Github size={18} />
                  <span>Sign In with GitHub</span>
                </button>
              </form>
            )}
            
            {/* Sign Out button for mobile - only shown when logged in */}
            {session && (
              <button 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className='w-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium shadow-lg transition duration-300 mt-2'
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;