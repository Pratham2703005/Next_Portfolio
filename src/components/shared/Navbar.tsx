'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import Profile from './Profile';

const Navbar = () => {
  const {data: session, status} = useSession();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navRef = useRef(null);
  

  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Messages', path: '/messages' },
    { name: 'Games', path: '/games' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  if(session){
    console.log(session);
  }
  
  return (
    <motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.5 }}
  className={`transition-all duration-300 select-none ${
    scrolled
      ? 'bg-black bg-opacity-80 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
  }`}
>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-[90%]">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-4xl font-bold text-white hover:text-gray-300 transition duration-300">
              pratham
            </h1>
          </Link>

          <div className="hidden md:block">
            <div ref={navRef} className="relative flex items-center ml-10 space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  onMouseEnter={() => setActiveItem(item.path)}
                  onMouseLeave={() => setActiveItem(pathname)}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`uppercase text-sm font-light transition duration-300 ${
                        activeItem === item.path ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {item.name}
                    </span>
                    <AnimatePresence>
                      {activeItem === item.path && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            {status === 'loading' ? <div className='text-white'>LOADING...</div> :  
              session ? <Profile /> : (
              <form action={async () => {
                await signIn('github')
              }}>
                <button type='submit' className='text-white'> Sign In Github</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
