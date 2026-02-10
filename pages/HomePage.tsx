
import React from 'react';
import { Page, Dog, NewsItem } from '../types';
import { WaveDivider, HandDoodle, COLORS } from '../constants';
import { Heart, ArrowRight, ShieldCheck, Stethoscope, Home as HomeIcon } from 'lucide-react';

interface HomePageProps {
  setPage: (page: Page) => void;
  dogs: Dog[];
  news: NewsItem[];
}

const HomePage: React.FC<HomePageProps> = ({ setPage, dogs, news }) => {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/LINE_ALBUM_2023%E7%B2%BE%E9%81%B8%EF%BC%88%E9%9A%A8%E4%BE%BF%E9%81%B8%E7%9A%84_260205_5.jpg?alt=media&token=486b02e3-b9f1-40af-8405-64eb9f6c6a58" 
            alt="毛腿腿園區生活" 
            className="w-full h-full object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="inline-block bg-white/40 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium mb-4 border border-white/50">
            浪愛重生的奇蹟推手
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
            毛腿腿浪愛幸福
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            從急難救助、完整醫療、安置照護、送養篩選、後續追蹤等，具備完善程序，讓曾經受苦的毛孩們，浪愛重生。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setPage(Page.Adoption)}
              className="bg-sakura text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-sakura/90 transition-all flex items-center justify-center"
            >
              <Heart className="mr-2 fill-white" size={20} /> 帶我回家
            </button>
            <button 
              onClick={() => setPage(Page.Donation)}
              className="bg-white text-sakura border-2 border-sakura/30 px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-sakura hover:text-white transition-all"
            >
              支持我們
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Core Mission Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
              <HandDoodle.Tree />
            </div>
            <h2 className="text-3xl font-bold text-earth mb-4">幸福延續：我們的核心流程</h2>
            <div className="w-24 h-1 bg-mimosa mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck size={40} />, title: '急難救助', desc: '當毛孩遭遇危難受傷，我們迅速出動進行救援。', color: 'bg-sakura/10 text-sakura' },
              { icon: <Stethoscope size={40} />, title: '完善醫療', desc: '完整的醫療護理，無論常規檢查或緊急手術，健康為重。', color: 'bg-mimosa/30 text-earth' },
              { icon: <HomeIcon size={40} />, title: '送養篩選', desc: '尋找最適合的家庭。我們的使命不僅僅是拯救毛孩，還要確保他們找到一個適合的家。', color: 'bg-pink-100 text-pink-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
                <div className={`w-24 h-24 ${item.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform organic-radius`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-20 bg-mimosa/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-10 opacity-10">
            <HandDoodle.Tree />
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-earth mb-2">最新消息</h2>
              <p className="text-gray-500">掌握毛腿腿的動態與活動訊息</p>
            </div>
            <button 
              onClick={() => setPage(Page.News)}
              className="text-sakura font-bold flex items-center hover:underline"
            >
              查看更多 <ArrowRight size={18} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col sm:flex-row group cursor-pointer" onClick={() => setPage(Page.News)}>
                <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-sakura font-bold uppercase tracking-wider mb-2 block">{item.date}</span>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.content}</p>
                  </div>
                  <div className="flex items-center text-sakura font-medium text-sm">
                    閱讀完整文章 <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adoption Preview */}
      <section className="py-24 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-earth mb-4">正在等家的毛孩</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              每一雙渴望溫暖的眼神背後，都有一個故事。你的愛可以改變牠們的未來。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dogs.slice(0, 3).map((dog) => (
              <div key={dog.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all border border-sakura/5">
                <div className="relative h-72 overflow-hidden">
                  <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm ${dog.gender === '女生' ? 'bg-pink-100/90 text-pink-600' : 'bg-blue-100/90 text-blue-600'}`}>
                    {dog.gender === '女生' ? '女生' : '男生'} • {dog.age}
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{dog.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{dog.story}</p>
                  <button 
                    onClick={() => setPage(Page.Adoption)}
                    className="w-full py-3 bg-sakura text-white rounded-full font-bold hover:bg-sakura/90 transition-all shadow-md"
                  >
                    認識 {dog.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => setPage(Page.Adoption)}
              className="px-8 py-3 bg-sakura text-white rounded-full font-bold hover:bg-sakura/90 transition-all shadow-lg"
            >
              查看所有認養狗狗
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-sakura text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full">
            <WaveDivider color="#fffcf9" flip />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center mt-12">
          <h2 className="text-3xl font-bold mb-6">讓愛成為奇蹟，支持毛腿腿持續前行</h2>
          <p className="text-white/90 mb-10 text-lg leading-relaxed font-medium">
            我們沒有政府補助，大多費用由愛媽與志工自掏腰包。你的每一份捐款，都將化作毛孩的醫療、糧食與溫暖。
          </p>
          <button 
            onClick={() => setPage(Page.Donation)}
            className="px-12 py-4 bg-white text-sakura rounded-full font-bold text-xl shadow-2xl hover:bg-mimosa hover:text-earth transition-all flex items-center mx-auto"
          >
            立即捐款支持 <Heart className="ml-2 fill-sakura" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
