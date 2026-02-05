
import React from 'react';
import { FileText, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

const ReceiptPage: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen py-24 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header Decor */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-sakura/10 text-sakura rounded-full mb-4">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-earth">感謝您的愛心支持</h1>
        </div>

        {/* CTA Card */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-lg border border-sakura/10 text-center relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-mimosa/10 -mr-16 -mt-16 rounded-full opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-sakura/5 text-sakura rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
              <FileText size={40} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">捐款收據申請</h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              為了感謝您的愛心，我們提供抵稅收據。<br className="hidden md:block" />
              請點擊下方按鈕前往 Google 表單填寫資料，<br className="hidden md:block" />
              並上傳您的匯款截圖以利核對。
            </p>

            <a 
              href="https://forms.gle/6EqhgPD6Qvm1wZ996" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-12 py-5 bg-sakura text-white rounded-full font-bold shadow-xl hover:bg-sakura/90 hover:scale-105 transition-all text-xl group"
            >
              👉 前往填寫申請表 <ExternalLink size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="mt-12 flex flex-col items-center space-y-4">
              <div className="flex items-center text-sm text-gray-400">
                <ShieldCheck size={16} className="mr-2 text-sakura" />
                <span>受國稅局規範開立之合法收據</span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm mx-auto italic">
                * 註：因愛媽與志工平日皆有正職，核對帳款與開立收據約需 14-30 個工作天，感謝您的耐心等候。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-sakura transition-colors text-sm font-medium"
          >
            返回上一頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
