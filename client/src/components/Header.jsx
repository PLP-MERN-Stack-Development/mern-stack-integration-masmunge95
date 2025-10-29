import { useTheme } from '@/context/ThemeContext';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSmoothScroll } from '../hooks/UseSmoothScroll';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

// This custom component replicates NavHashLink's functionality to provide
// smooth scrolling while avoiding the React warnings. It uses NavLink for
// routing and our custom useSmoothScroll hook for the animation.
const SmoothNavLink = ({ to, children, headerRef, className, ...rest }) => {
  const scrollTo = useSmoothScroll();

  const handleClick = (e) => {
    const hash = to.split('#')[1];
    if (hash) {
      e.preventDefault();
      const targetElement = document.getElementById(hash);
      const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
      if (targetElement) {
        scrollTo(targetElement, 1500, null, headerHeight);
      }
    }
  };

  return (
    <NavLink to={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </NavLink>
  );
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef(null);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b shadow-lg border-gray-200 dark:border-gray-700">
      <nav className="mx-auto max-w-5xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <img
                src="/mern-blog-logo.png"
                alt="MERN Blog Logo"
                className="w-6 h-6 object-contain"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
                MERN Blog Manager
            </span>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="hidden sm:flex items-center gap-4 font-bold text-gray-900 dark:text-white">
              <SmoothNavLink to="/#posts" headerRef={headerRef} className="relative mr-4 after:absolute after:bg-blue-300 after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">Posts</SmoothNavLink>
              <SmoothNavLink to="/#categories" headerRef={headerRef} className="relative after:absolute after:bg-blue-300 after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">Categories</SmoothNavLink>
            </div>
          </SignedIn>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}