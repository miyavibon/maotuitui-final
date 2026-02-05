
import React from 'react';
import { Facebook, MessageCircle, Clock, Heart, ExternalLink } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-earth mb-6">聯絡我們</h1>
          <p className="text-gray-600 leading-loose max-w-2xl mx-auto">
            有任何問題都歡迎聯繫我們。為了提供最準確的協助，請根據您的需求選擇對應的聯繫視窗。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Adoption Contact */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-sage/10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Facebook size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">認養事宜詢問</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    關於狗狗認養、問卷審核進度、或是想了解特定狗狗的個性，請聯繫「認養團」。
                </p>
                <a 
                    href="https://tr.ee/ocOCBt-y9K" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all flex items-center"
                >
                    毛腿腿認養團 <ExternalLink size={16} className="ml-2" />
                </a>
            </div>

            {/* Association Contact */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-sage/10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mb-6">
                    <MessageCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">協會行政事務</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    關於捐款核對、合作邀約、或是協會的一般性行政問題，請聯繫「協會官網」。
                </p>
                <a 
                    href="https://tr.ee/nwKBRAtuyG" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto px-8 py-3 bg-sage text-white rounded-full font-bold hover:bg-sage/90 transition-all flex items-center"
                >
                    毛腿腿浪愛幸福協會 <ExternalLink size={16} className="ml-2" />
                </a>
            </div>
        </div>

        <div className="mt-12 bg-beige p-8 rounded-[2rem] border border-sage/10 flex items-start">
            <Clock className="text-sage mr-4 flex-shrink-0 mt-1" size={24} />
            <div>
                <h4 className="font-bold text-earth mb-2">回覆時間說明</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                    愛媽與志工在平日皆有正職工作，且需處理大量的犬貓救助、醫療與園區照護。您的每一則留言我們都會看，我們會利用休息空檔儘速回覆，感謝您的耐心與體諒。
                </p>
            </div>
        </div>

        <div className="mt-20 text-center">
            <Heart size={48} className="text-sage mx-auto mb-6 opacity-40" />
            <p className="text-earth font-bold text-xl">感謝您的支持，讓我們一起為毛孩守護幸福</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
