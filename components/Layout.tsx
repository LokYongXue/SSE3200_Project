import React from 'react';
import { Home, Users, Heart, BookOpen, Phone, User as UserIcon } from 'lucide-react';
import { Page } from '../types';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
  onCrisis: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, onCrisis }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <div className="flex items-baseline select-none">
            <span className="font-extrabold text-2xl text-gray-500 tracking-tight">mind</span>
            <span className="font-extrabold text-2xl text-gray-800 tracking-tight">.io</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCrisis} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 animate-pulse">
            <Phone size={20} />
          </button>
          <button 
             onClick={() => onNavigate(Page.PROFILE)}
             className={`p-2 rounded-full ${activePage === Page.PROFILE ? 'bg-indigo-50 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <UserIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-20">
        <NavButton 
          icon={<Home size={24} />} 
          label="Home" 
          isActive={activePage === Page.HOME} 
          onClick={() => onNavigate(Page.HOME)} 
        />
        <NavButton 
          icon={<Users size={24} />} 
          label="Counsellor" 
          isActive={activePage === Page.COUNSELLOR} 
          onClick={() => onNavigate(Page.COUNSELLOR)} 
        />
        <NavButton 
          icon={<Heart size={24} />} 
          label="Self Care" 
          isActive={activePage === Page.SELF_CARE} 
          onClick={() => onNavigate(Page.SELF_CARE)} 
        />
        <NavButton 
          icon={<BookOpen size={24} />} 
          label="Journal" 
          isActive={activePage === Page.JOURNAL} 
          onClick={() => onNavigate(Page.JOURNAL)} 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ 
  icon, label, isActive, onClick 
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Layout;