
import React from 'react';
import { WaveDivider, COLORS } from '../constants';
import { 
  ClipboardCheck, 
  ShieldAlert, 
  Heart, 
  Calendar, 
  ShoppingBag, 
  Coins, 
  ArrowRight,
  ExternalLink,
  Info,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Cat
} from 'lucide-react';

const AdoptionInfoPage: React.FC = () => {
  return (
    <div className="bg-cream min-h-screen">
      {/* Header Section */}
      <section className="bg-beige pt-12 pb-24 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold text-earth mb-6">關於領養</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我們不只是救援，更是為幸福而努力。幫助那些無助的生命，讓他們重新獲得新的生活。
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        
        {/* Section 1: 領養前請先閱讀 */}
        <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-sakura/5">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-sakura/10 text-sakura rounded-full flex items-center justify-center">
              <ClipboardCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-earth">1. 領養前請先閱讀</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">歡迎來到毛腿腿！在決定帶毛孩回家前，請先確認您符合以下基本條件：</p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-sakura mr-2 font-bold">•</span>
              <span><strong>年齡限制：</strong>需年滿 <strong>25歲</strong> 以上（情侶同住需雙方滿 <strong>30歲</strong>）。</span>
            </li>
            <li className="flex items-start">
              <span className="text-sakura mr-2 font-bold">•</span>
              <span><strong>幼犬特別限制：</strong>欲認養 3 歲以下幼犬，認養人需 <strong>未滿 50 歲</strong>。</span>
            </li>
            <li className="flex items-start bg-mimosa/10 p-4 rounded-2xl border border-mimosa/30">
              <MapPin className="text-earth mr-3 flex-shrink-0" size={20} />
              <span><strong>居住地區：限 雲林以北 地區。</strong><br/><span className="text-xs text-gray-500 mt-1 block">*(嘉義、台南、高雄、屏東、花東、外島因不便家訪，恕無法受理)*</span></span>
            </li>
            <li className="flex items-start">
              <span className="text-sakura mr-2 font-bold">•</span>
              <span><strong>居住環境：</strong>恕不接受小套房飼養。</span>
            </li>
            <li className="flex items-start">
              <span className="text-sakura mr-2 font-bold">•</span>
              <span><strong>家庭規劃：</strong>若近期有懷孕計畫，考量變動因素，暫時無法受理。</span>
            </li>
          </ul>
        </section>

        {/* Section 2: 認養必備物品 */}
        <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-sakura/5">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-sakura/10 text-sakura rounded-full flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-2xl font-bold text-earth">2. 認養必備物品 🎒</h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">現場互動時請務必攜帶：<span className="text-sakura">寵物提籠 & 胸背帶</span>。</p>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start">
              <AlertTriangle className="text-red-400 mr-3 flex-shrink-0 mt-1" size={18} />
              <p className="text-sm text-red-600">若未攜帶，需於現場購買完成後才能帶回（避免狗狗因不熟悉而在途中逃跑）。</p>
            </div>
          </div>
        </section>

        {/* Section 3: 醫療費用與補貼 */}
        <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-sakura/5">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-sakura/10 text-sakura rounded-full flex items-center justify-center">
              <Coins size={24} />
            </div>
            <h2 className="text-2xl font-bold text-earth">3. 醫療費用與補貼 💰</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8">所有費用皆為「愛心醫療補貼」，包含：血檢、結紮、晶片、預防針、洗牙拔牙等。</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-cream rounded-3xl border border-gray-100">
              <h4 className="font-bold text-earth mb-2">成犬 (3歲以上)</h4>
              <p className="text-2xl font-bold text-sakura">$4,000 <span className="text-sm font-normal text-gray-400">元</span></p>
              <p className="text-xs text-gray-500 mt-2">(或可照醫療單據原價支付)</p>
            </div>
            <div className="p-6 bg-cream rounded-3xl border border-gray-100">
              <h4 className="font-bold text-earth mb-2">貓咪</h4>
              <p className="text-2xl font-bold text-sakura">$6,000 <span className="text-sm font-normal text-gray-400">元</span></p>
            </div>
            <div className="md:col-span-2 p-6 bg-mimosa/10 rounded-3xl border border-mimosa/30">
              <h4 className="font-bold text-earth mb-4">幼犬 / 亞成犬 (0-3歲)</h4>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-earth">$6,000 <span className="text-sm font-normal text-gray-500">元起</span></p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• 已絕育：押金 $5,000 <span className="text-xs">(舊認養人免收)</span></p>
                  <p>• 未絕育：押金 $10,000 <span className="text-xs">(舊認養人 $5,000)</span></p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-mimosa/40 text-xs text-gray-600 italic space-y-2">
                <p>* 退費機制：飼養一年後，若每月準時回報且飼養良好，全額退還押金。</p>
                <p>* 注意：未絕育幼犬需於指定日期完成絕育，否則收回犬隻且不退費。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: 驚喜包提醒 */}
        <section className="bg-orange-50/50 p-8 md:p-12 rounded-[3rem] border border-orange-200">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-orange-700">4. 給新手爸媽的「驚喜包」提醒 🚨</h2>
          </div>
          <p className="text-orange-800 font-medium mb-4">認養 3 歲以下幼犬等於選擇一條更具挑戰的路，請審慎評估：</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-orange-700 text-sm">
            <li className="flex items-center"><ArrowRight size={14} className="mr-2" /> 過度活潑、破壞家具</li>
            <li className="flex items-center"><ArrowRight size={14} className="mr-2" /> 吠叫擾鄰、不會定點大小便</li>
            <li className="flex items-center"><ArrowRight size={14} className="mr-2" /> 未來體型與想像不符</li>
          </ul>
          <p className="mt-6 text-orange-800/80 text-sm leading-relaxed">
            這些都是成長過程的一部分，需要您用耐心、理解與教育來陪伴牠。
          </p>
        </section>

        {/* Section 5: 認養後續與規則 */}
        <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-sakura/5">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-sakura/10 text-sakura rounded-full flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <h2 className="text-2xl font-bold text-earth">5. 認養後續與規則 📝</h2>
          </div>
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-sakura/20 text-sakura rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">1</div>
              <p><strong>追蹤期：</strong>需追蹤 <strong>一年</strong>，每月於親友社團回報照片及狀況。</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-sakura/20 text-sakura rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">2</div>
              <p><strong>晶片移轉：</strong>一年期滿且飼養良好後辦理。恕不因保險等需求提早辦理。</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">3</div>
              <p><strong>退回機制：</strong>無試養期。若無法飼養僅可交還協會，嚴禁私自轉送或棄養。</p>
            </div>
          </div>
        </section>

        <hr className="border-sakura/10" />

        {/* Section 6: 立即申請 */}
        <section className="text-center py-10">
          <h2 className="text-3xl font-bold text-earth mb-4">6. 立即申請</h2>
          <p className="text-gray-500 mb-12">請依照以下步驟進行申請：</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
            <div className="p-6 bg-white rounded-3xl border border-sakura/5 shadow-sm">
              <div className="text-sakura font-bold text-xl mb-2">1</div>
              <div className="text-sm text-gray-600">詳閱上方<br/>認養須知</div>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-sakura/5 shadow-sm">
              <div className="text-sakura font-bold text-xl mb-2">2</div>
              <div className="text-sm text-gray-600">私訊 FB 粉專<br/>索取問卷</div>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-sakura/5 shadow-sm">
              <div className="text-sakura font-bold text-xl mb-2">3</div>
              <div className="text-sm text-gray-600">預約現場互動<br/><span className="text-[10px]">(資料齊全可當天領養)</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <a 
              href="https://www.facebook.com/1251853508252456/posts/1252764928161314/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full max-w-md py-5 bg-[#1877F2] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center justify-center text-lg"
            >
              <MessageCircle className="mr-3" size={24} /> 💬 私訊 FB 索取認養問卷
            </a>
            
            <a 
              href="https://www.facebook.com/102034985014383/posts/317859226765290/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full max-w-md py-5 bg-sakura text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center justify-center text-lg"
            >
              <Cat className="mr-3" size={24} /> 😺 貓咪認養預約 (FB)
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdoptionInfoPage;
