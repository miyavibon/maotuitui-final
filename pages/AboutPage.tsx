
import React from 'react';
import { WaveDivider, HandDoodle, COLORS } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="bg-beige pt-12 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold text-earth mb-6">關於我們</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            社團法人毛腿腿浪愛幸福協會：一個持續十八年的愛心奇蹟
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider />
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative">
              <div className="absolute -top-10 -left-10 opacity-20"><HandDoodle.Tree /></div>
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/LINE_ALBUM_%E5%9C%92%E5%8D%80%E7%85%A7%E7%89%87_260205_6.jpg?alt=media&token=667c60bc-789a-48f5-bcbd-0d594af5856b" 
                alt="園區實境照" 
                className="rounded-[3rem] shadow-xl organic-radius w-full h-80 md:h-[500px] object-cover" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-earth">我們的故事</h2>
              <p className="text-gray-600 leading-loose">
                毛腿腿從Betty愛媽個人救援計畫開始，至今已有近18年的歷史。這條路走來並不輕鬆，但我們堅定奉獻，為了拯救每一條微小的生命，我們無私奔走。
              </p>
              <p className="text-gray-600 leading-loose">
                截至目前，我們已經幫助超過 5000 隻需要幫助的毛孩找到家，救援的犬貓數量累計近萬隻。園區收容多為熟齡、傷殘之中小型犬。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-row-reverse mb-24">
             <div className="space-y-6 md:order-1">
              <h2 className="text-3xl font-bold text-earth">積極行動，守護生命</h2>
              <p className="text-gray-600 leading-loose">
                當一隻毛孩處於危難之中，我們不是坐視不管，而是積極行動。無論是受傷、受虐，還是其他危機，我們都會迅速行動，確保毛孩得到及時的救助。
              </p>
              <div className="bg-sakura/5 p-6 rounded-3xl border-l-4 border-sakura">
                <p className="italic text-sakura font-medium">「每一隻毛孩的平安，都是我們前進的動力。」</p>
              </div>
            </div>
            <div className="relative md:order-2">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/LINE_ALBUM_%E6%B4%BB%E5%8B%95%E5%89%AA%E8%BC%AF_260205_1.jpg?alt=media&token=ea8f25e4-8740-4cc6-bd49-4469650005c1" 
                alt="活動紀錄剪輯" 
                className="rounded-[3rem] shadow-xl organic-radius-reverse w-full h-80 md:h-[500px] object-cover" 
              />
              <div className="absolute -bottom-10 -right-10 opacity-20 rotate-180"><HandDoodle.Tree /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-earth mb-16">我們如何幫助牠們</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: '完整醫療', desc: '提供完善的健康檢查與緊急手術，確保每一隻毛孩處於最佳狀態。' },
              { title: '安置照護', desc: '在協會中，每一隻毛孩都有一個安全、舒適、不再孤獨的家。' },
              { title: '嚴格送養', desc: '進行嚴格的送養篩選，確保毛孩能夠找到最適合、最愛他們的家庭。' },
              { title: '後續追蹤', desc: '關懷不會隨著送養結束，我們會定期追蹤，陪伴孩子在家庭中幸福成長。' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-sakura text-white rounded-full flex items-center justify-center font-bold mb-6">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Info */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-8 inline-block"><HandDoodle.Paw /></div>
            <h2 className="text-2xl font-bold text-earth mb-6">社團法人毛腿腿浪愛幸福協會</h2>
            <div className="space-y-2 text-gray-500 text-lg">
                <p>台內團字第1090054102號</p>
                <p>衛部救字第1121362952號</p>
            </div>
            <div className="mt-12 p-8 bg-sakura/5 rounded-[2rem] border border-sakura/10">
                <p className="text-gray-600 leading-loose">
                    如果您也被我們的故事感動，請考慮贊助我們。您的支持將直接轉化為拯救生命的能量，讓每一位毛孩都能夠浪愛重生。
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
