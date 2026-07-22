import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage, isAdmin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: '關於我們', page: Page.About },
    { label: '最新消息', page: Page.News },
    { label: '認養專區', page: Page.Adoption },
    { label: '關於領養', page: Page.AdoptionInfo },
    // { label: '愛心捐款', page: Page.Donation }, // 暫時隱藏愛心捐款，日後把這行的 // 刪掉就會恢復了
    { label: '聯絡我們', page: Page.Contact },
  ];

  const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/LOGO.png?alt=media&token=b5b4c92b-339b-482e-9655-97f738536e4f";

  return (
    <nav className="fixed top-0 w-full bg-cream/90 backdrop-blur-md z-50 border-b border-sakura/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer py-2" 
            onClick={() => setPage(Page.Home)}
          >
            <img 
              src={LOGO_URL} 
              alt="毛腿腿 Logo" 
              className="h-14 md:h-20 w-auto object-contain transition-all duration-300 hover:scale-105" 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentPage === item.page ? 'text-white bg-sakura shadow-sm' : 'text-gray-600 hover:text-sakura hover:bg-sakura/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin ? (
              <button onClick={onLogout} className="flex items-center text-gray-500 hover:text-red-500 ml-4 border-l pl-4 border-sakura/20">
                <LogOut size={18} className="mr-1" />
                <span>登出</span>
              </button>
            ) : (
              <button onClick={() => setPage(Page.Login)} className="text-gray-400 hover:text-sakura ml-4">
                <User size={20} />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-sakura p-2 rounded-md">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-sakura/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => { setPage(item.page); setIsOpen(false); }}
                className={`block w-full text-left px-4 py-4 rounded-xl text-lg font-medium ${
                  currentPage === item.page ? 'text-sakura bg-sakura/5 font-bold' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button onClick={onLogout} className="block w-full text-left px-4 py-4 rounded-xl text-lg font-medium text-red-500">
                管理員登出
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
