
import React from 'react';
import { Page } from '../types';
import { Heart, Coins, Info, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { WaveDivider, COLORS } from '../constants';

interface DonationPageProps {
  setPage: (page: Page) => void;
}

const DonationPage: React.FC<DonationPageProps> = ({ setPage }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('帳號已複製到剪貼簿！');
  };

  const RECEIPT_FORM_URL = "https://forms.gle/x1Vin7NbbfehGdvh6";

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-sakura text-white pt-16 pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-6 tracking-wider">愛心捐款</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            「用一點點力量，換毛孩們一個大大的改變。」
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color="#fffcf9" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Donation Appeal */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-earth leading-normal">為什麼需要您的支持？<br/><span className="text-2xl">—— 讓愛延續，永不放棄</span></h2>
            <div className="prose prose-sakura text-gray-600 leading-loose space-y-6">
              <p>
                毛腿腿浪愛幸福協會至今已救援超過 <strong>5000</strong> 個生命。這條救援路上，我們始終堅持「不放棄重症、不拋棄老弱」，但這份堅持背後，是每月沉重的開銷壓力：
              </p>
              
              <ul className="list-none space-y-4 pl-0">
                <li className="flex items-start">
                  <span className="text-sakura font-bold mr-3 text-xl mt-1">•</span>
                  <span><strong>醫療重擔：</strong>針對癌症、腫瘤、車禍重傷的孩子，我們堅持給予最好的醫療與手術。近年醫療支出已突破數百萬，我們始終在與龐大的醫藥費賽跑。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sakura font-bold mr-3 text-xl mt-1">•</span>
                  <span><strong>伙食開銷：</strong>園區每月消耗超過 <strong>160 包</strong> 大型飼料，加上老犬專用的處方糧與保健品，讓孩子們吃飽穿暖是我們最大的挑戰。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sakura font-bold mr-3 text-xl mt-1">•</span>
                  <span><strong>預防醫療：</strong>為杜絕心絲蟲與壁蝨，園區全面定期投予一錠除與犬心寶，這筆龐大的預防藥費絕不能省。</span>
                </li>
              </ul>

              <div className="bg-sakura/5 p-6 rounded-2xl border-l-4 border-sakura my-6">
                <p className="mb-4 font-medium text-gray-700">
                    我們不怕辛苦，只怕沒有資源能救牠們。<br />
                    即使是一包飼料的錢、一次看診的費用，都是毛孩活下去的希望。
                </p>
                <p className="font-bold text-xl text-sakura">
                    請支持毛腿腿，成為這些孩子背後最強大的守護天使！
                </p>
              </div>
              
              {/* JKOPAY Donation Card - Updated URL & Styling */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-sakura/20 flex flex-col items-center text-center mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  使用街口支付快速捐款
                </h3>
                
                <a 
                  href="https://service.jkopay.com/r/aweb?url=https://donation-app.jkos.com/public-welfare/charity-group/detail?id=223" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#E63F3F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d62f2f] transition-colors inline-flex items-center gap-2 shadow-lg"
                >
                  前往街口支付連結
                  <ExternalLink size={18} />
                </a>
                
                <p className="mt-4 text-sm text-gray-500">
                  手機用戶點擊可直接開啟街口 App
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-earth text-xl">其他支持方式</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="https://tr.ee/nwKBRAtuyG" target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center hover:bg-sakura/5 transition-colors">
                  <div className="w-10 h-10 bg-sakura/10 text-sakura rounded-full flex items-center justify-center mr-3"><Heart size={20} /></div>
                  <span className="text-sm font-bold text-gray-700">支持義賣 & 志工招募</span>
                </a>
                <a 
                  href={RECEIPT_FORM_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center hover:bg-sakura/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-mimosa/30 text-earth rounded-full flex items-center justify-center mr-3"><ExternalLink size={20} /></div>
                  <span className="text-sm font-bold text-gray-700">捐款後申請收據</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="space-y-12">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-sakura/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Coins size={80} /></div>
                <h3 className="text-2xl font-bold text-earth mb-8 flex items-center">
                    <Heart className="mr-2 text-sakura" fill={COLORS.sakura} /> 轉帳捐款帳號
                </h3>
                
                <div className="space-y-8">
                    <div className="p-6 bg-mimosa/10 rounded-2xl border border-mimosa/20 relative">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sakura font-bold">【華南銀行】觀音分行</span>
                            <button onClick={() => copyToClipboard('260100066996')} className="text-gray-400 hover:text-sakura transition-colors">
                                <Copy size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">銀行代號: 008</p>
                        <p className="text-lg font-bold text-gray-800 tracking-wider">260100066996</p>
                        <p className="text-sm text-gray-600 mt-2">戶名：社團法人毛腿腿浪愛幸福協會</p>
                    </div>

                    <div className="p-6 bg-mimosa/10 rounded-2xl border border-mimosa/20 relative">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sakura font-bold">【中華郵政】觀音新坡郵局</span>
                            <button onClick={() => copyToClipboard('02810500438661')} className="text-gray-400 hover:text-sakura transition-colors">
                                <Copy size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">郵局代號: 700</p>
                        <p className="text-lg font-bold text-gray-800 tracking-wider">0281050 0438661</p>
                        <p className="text-sm text-gray-600 mt-2">戶名：社團法人毛腿腿浪愛幸福協會</p>
                    </div>
                </div>

                <div className="mt-8 flex items-start bg-sakura/5 p-4 rounded-xl">
                    <Info size={20} className="text-sakura mr-3 mt-1 flex-shrink-0" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        轉帳捐款後，若需抵稅收據，請點選上方「申請收據」填寫表單。無填寫申請者，收據一律開立為「善心人士」，感謝您的愛心支持。
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
