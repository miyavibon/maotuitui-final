
import React from 'react';
import { Page } from '../types';
import { Facebook, Heart, MapPin, HelpCircle } from 'lucide-react';
import { WaveDivider } from '../constants';

interface FooterProps {
  setPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  return (
    <footer className="relative bg-mimosa/20 pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full rotate-180">
        <WaveDivider color="#fffcf9" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Logo & Info */}
          <div className="space-y-4">
            <div 
              className="flex items-center cursor-pointer mb-4" 
              onClick={() => setPage(Page.Home)}
            >
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/%E5%B8%82%E9%9B%86%E9%A0%90%E5%91%8A-01.png?alt=media&token=30838c48-04df-4566-98d2-dbe7931a6e5e" 
                alt="毛腿腿 Logo" 
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              「用一點點力量，換毛孩們一個大大的改變。」<br/>
              自Betty愛媽救援開始，十八年來讓曾經受苦的生命，浪愛重生。
            </p>
            <div className="flex flex-col space-y-3 pt-2">
              <a href="https://tr.ee/ocOCBt-y9K" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                <Facebook size={18} className="mr-2 flex-shrink-0" /> 認養專用：毛腿腿認養團
              </a>
              <a href="https://tr.ee/nwKBRAtuyG" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                <Facebook size={18} className="mr-2 flex-shrink-0" /> 贊助/志工：協會官方粉專
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-earth border-b border-sakura/20 pb-2">協會資訊</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-sakura flex-shrink-0" />
                <p>園區不開放現場參訪，認養請先填寫問卷預約。</p>
              </div>
              <div className="flex items-center">
                <Heart size={16} className="mr-2 text-sakura flex-shrink-0" />
                <p>台內團字第1090054102號</p>
              </div>
              <div className="flex items-center">
                <HelpCircle size={16} className="mr-2 text-sakura flex-shrink-0" />
                <p>衛部救字第1121362952號</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sakura/10 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} 社團法人毛腿腿浪愛幸福協會. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
