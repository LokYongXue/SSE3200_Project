import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto" }) => (
  <img 
    src="assets/Logo.png" 
    alt="Mind.io Logo" 
    className={`${className} object-contain`}
  />
);

export default Logo;