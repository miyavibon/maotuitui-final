
import React, { useState, useMemo } from 'react';
import { NewsItem } from '../types';
import { db, storage } from '../firebase';
// @ts-ignore
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// @ts-ignore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit2, Trash2, X, Calendar, Upload, Loader2, ChevronLeft, ChevronRight, FileText, ExternalLink, Tag } from 'lucide-react';

interface NewsPageProps {
  news: NewsItem[];
  isAdmin: boolean;
}

// 預設資料：包含指定的 112 年度公告與舊範本
const PRELOADED_NEWS: NewsItem[] = [
  {
    id: 'static-112-report',
    title: '112年度毛腿兒關愛計畫 成果公告',
    date: '2024-08-30',
    tags: ['公開徵信', '年度報告'],
    content: '本會辦理『112年度毛腿兒關愛計畫』，活動期間自112年8月31日至113年8月30日止。\n\n依公益勸募條例規定，公開勸募活動所得與支出明細，以及執行成果報告，特此公告以昭公信。\n\n感謝每一位捐款人的愛心支持，讓協會能持續為浪浪提供完善的醫療與照護。詳細收支與成果請參閱下方附件報告書。',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/2118541.jpg?alt=media&token=4f08b954-ab93-4198-a30b-482875c46c59'
    ],
    embeddedPdfs: [
      {
        title: '完整結案報告書 (含募款、支出、成果)',
        url: 'https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/112%E5%B9%B4%E5%BA%A6%E6%AF%9B%E8%85%BF%E5%85%92%E9%97%9C%E6%84%9B%E8%A8%88%E7%95%AB-%E6%88%90%E6%9E%9C%E5%A0%B1%E5%91%8A2.pdf?alt=media&token=6ad2c170-0446-4c0a-bf23-29e542173137'
      }
    ]
  },
  {
    id: 'static-2023-sample-1',
    title: '道明寺加油 確認水腦跟犬小病毒',
    date: '2023-09-30',
    tags: ['救援日誌'],
    content: '道明寺加油\n確認水腦跟犬小病毒\n犬小病毒在幼犬致死率極高\n我們先治療犬小病毒\n目前有給干擾素\n但他腳完全找不到靜脈了\n不知道之前是否是長期打點滴的狗狗\n干擾素要靜脈給予比較成效較好\n所以我們只能給頸靜脈\n我就不拍了看了很心疼\n希望他撐過去\n然後才能在看水腦如何解決\n當然希望能像水煎包一樣能開刀\n道明寺加油\n我們所做的只有為狗狗好\n當然送養也是\n我們有我們的評估\n晶片我們暫時不轉移\n切結書也寫非常清楚\n在評級期過一切都正常飼養\n我們都會轉移\n在簽訂時就代表你們同意\n真的沒有什麼好爭吵的\n我們沒這麼無聊到處要狗回來',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/495860146_9972843762737540_5574265741955121617_n.jpg?alt=media&token=c11b58ba-d28e-4264-a407-e42653163f2e',
      'https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/495822220_9972843799404203_4406884315884588338_n.jpg?alt=media&token=9b210c3c-a107-41e3-8c4b-a225eb0d9193'
    ]
  },
  {
    id: 'static-2023-sample-2',
    title: '特殊照護犬認養首發 - 癌末雪納瑞萌萌',
    date: '2023-09-25',
    tags: ['特殊照護認養'],
    content: '毛腿腿有很多特殊疾病的孩子，認識我們的朋友們都知道，我們在救援醫療上完全就是一視同仁。\n不管什麼樣的生命、什麼樣的狗狗，在我們面前都是平等的，每一個生命都很重要，也都值得被尊重。\n但這些疾病或缺陷，不應該成為阻礙他們尋找幸福的原因。\n\n恐懼來自於未知，對於這些不熟悉的病況，很多認養人即使有心想認養，也怕自己沒能力照顧。\n因此我們想特別為他們寫認養文，告訴大家領養後要如何照護，讓大家在自我評估上更有準則。\n\n世界無敵可愛的萌萌，是被前飼主棄養的小可憐。\n剛救援時滿嘴的爛肉，不時發出腐肉味，身上也有三個不小的腫瘤。\n本來預計要動手術(毛腿腿怎麼可能拖)，卻發現腫瘤已經擴散到肺部，醫生估計只能再活兩個月，建議我們安寧照護。\n\n在治療好口腔問題，加上頂級保健食品催落去後，萌萌不僅變胖了，精神也好了不少！\n到這個月底就是醫生說的兩個月了，她看起來仍然是精神奕奕！\n目前就是開開心心過每一天，每一天都是被祝福的一天。\n\n【照護方式】\n1. 注意呼吸狀況，須備氧氣瓶或氧氣箱。\n2. 每天服用指定保健食品。\n3. 定期回診追蹤 (不可只用視診代替)。\n4. 她很黏人請常常陪她，請確保她開心。\n\n有心領養或是想進一步討論的天使們，歡迎私訊毛腿腿，我們會手把手教學一路陪著你的！',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/maotuitui-love.firebasestorage.app/o/482004853_1139934484596769_5728873332597280271_n.jpg?alt=media&token=23d78c04-ff5a-4c04-a3b5-990cea4cd812'
    ]
  }
];

const NewsPage: React.FC<NewsPageProps> = ({ news, isAdmin }) => {
  // Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Admin Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editItem, setEditItem] = useState<Partial<NewsItem> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Admin Form - PDF Handling
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Merge Firestore news with Preloaded news and Sort
  const displayNews = useMemo(() => {
    // 過濾掉 ID 重複的項目 (避免 DB 已經有相同的資料時重複顯示)
    const dbIds = new Set(news.map(n => n.id));
    const uniquePreloaded = PRELOADED_NEWS.filter(n => !dbIds.has(n.id));
    
    return [...uniquePreloaded, ...news].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [news]);

  // Helper to get all images (compatibility for old data)
  const getImages = (item: NewsItem): string[] => {
    if (item.images && item.images.length > 0) return item.images;
    if (item.imageUrl) return [item.imageUrl];
    return []; // No image placeholder logic handled in UI
  };

  const handleDelete = async (id: string) => {
    // Prevent deleting static data
    if (id.startsWith('static-')) {
      alert('這是系統預設文章，無法刪除。');
      return;
    }
    if (window.confirm('確定要刪除這篇文章嗎？')) {
      await deleteDoc(doc(db, 'news', id));
      if (isDetailModalOpen) setIsDetailModalOpen(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem?.title || !editItem?.content || !editItem?.date) return;
    setIsSubmitting(true);

    try {
      // Handle Image Upload
      let currentImages = editItem.images || [];
      // Compatibility: If editing old item, migrate imageUrl to images
      if (editItem.imageUrl && currentImages.length === 0) {
        currentImages = [editItem.imageUrl];
      }

      if (imageFile) {
        const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const newImageUrl = await getDownloadURL(snapshot.ref);
        currentImages = [newImageUrl, ...currentImages]; // Add new image to front
      }

      const finalData = {
        title: editItem.title,
        content: editItem.content,
        date: editItem.date, // User manually selected string
        images: currentImages,
        embeddedPdfs: editItem.embeddedPdfs || [],
        tags: editItem.tags || [],
        imageUrl: currentImages[0] || '' // Keep legacy field updated just in case
      };

      if (editItem.id) {
        if (editItem.id.startsWith('static-')) {
            alert('這是系統預設文章，無法編輯。');
        } else {
            await updateDoc(doc(db, 'news', editItem.id), finalData);
        }
      } else {
        await addDoc(collection(db, 'news'), {
            ...finalData,
            createdAt: Date.now() // For internal sorting if needed
        });
      }
      setIsAdminModalOpen(false);
      setEditItem(null);
      setImageFile(null);
    } catch (err) {
      alert('儲存失敗：' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPdfToForm = () => {
    if (!pdfTitle || !pdfUrl) return;
    const currentPdfs = editItem?.embeddedPdfs || [];
    setEditItem({
        ...editItem,
        embeddedPdfs: [...currentPdfs, { title: pdfTitle, url: pdfUrl }]
    });
    setPdfTitle('');
    setPdfUrl('');
  };

  const removePdfFromForm = (index: number) => {
    const currentPdfs = editItem?.embeddedPdfs || [];
    setEditItem({
        ...editItem,
        embeddedPdfs: currentPdfs.filter((_, i) => i !== index)
    });
  };

  // --- Detail Components ---
  
  const Carousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;
    if (images.length === 1) return <img src={images[0]} alt="News" className="w-full h-auto object-contain max-h-[500px]" />;

    return (
      <div className="relative w-full h-[300px] md:h-[500px] bg-black/5 rounded-2xl overflow-hidden group">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex}`} 
          className="w-full h-full object-contain"
        />
        
        <button 
          onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-sakura w-4' : 'bg-white/60'}`} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
             <h1 className="text-4xl font-bold text-earth">最新消息</h1>
             <p className="text-gray-500">掌握協會的最新動態、財務徵信與活動紀錄</p>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => { setEditItem({ date: new Date().toISOString().split('T')[0] }); setIsAdminModalOpen(true); }}
              className="flex items-center bg-sage text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-sage/90 transition-all"
            >
              <Plus className="mr-2" size={20} /> 發布新公告
            </button>
          )}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayNews.map((item) => {
            const displayImages = getImages(item);
            const mainImage = displayImages[0] || 'https://via.placeholder.com/400x300?text=No+Image';

            return (
              <article 
                key={item.id} 
                onClick={() => { setSelectedNews(item); setIsDetailModalOpen(true); }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-sage/5 flex flex-col h-full group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={mainImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {item.tags && item.tags.length > 0 && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {item.tags.map((tag, idx) => (
                              <span key={idx} className="bg-white/90 backdrop-blur text-sakura text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-gray-400 text-sm font-medium mb-3">
                    <Calendar size={14} className="mr-2 text-sakura" />
                    <span>{item.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 leading-snug group-hover:text-sakura transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {item.content}
                  </p>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <span className="text-sakura font-bold text-sm flex items-center">
                        閱讀更多 <ChevronRight size={16} />
                    </span>
                    {isAdmin && !item.id.startsWith('static-') && (
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => { setEditItem(item); setIsAdminModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* User Detail Modal */}
      {isDetailModalOpen && selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            {/* Header / Close */}
            <div className="absolute top-4 right-4 z-10">
                <button 
                    onClick={() => setIsDetailModalOpen(false)} 
                    className="p-2 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-all"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar">
                {/* Image Section */}
                <div className="bg-gray-100">
                    <Carousel images={getImages(selectedNews)} />
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="flex items-center text-sakura bg-sakura/10 px-4 py-1.5 rounded-full font-bold text-sm">
                            <Calendar size={16} className="mr-2" /> {selectedNews.date}
                        </span>
                        {selectedNews.tags?.map((tag, i) => (
                            <span key={i} className="flex items-center text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full font-medium text-sm">
                                <Tag size={14} className="mr-2" /> {tag}
                            </span>
                        ))}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-tight">
                        {selectedNews.title}
                    </h2>

                    <div className="prose prose-lg text-gray-600 leading-loose whitespace-pre-line mb-12">
                        {selectedNews.content}
                    </div>

                    {/* PDF Section */}
                    {selectedNews.embeddedPdfs && selectedNews.embeddedPdfs.length > 0 && (
                        <div className="space-y-8 mt-12 pt-12 border-t-2 border-dashed border-gray-100">
                            <h3 className="text-xl font-bold text-earth flex items-center">
                                <FileText className="mr-2 text-sakura" /> 附件檔案預覽
                            </h3>
                            {selectedNews.embeddedPdfs.map((pdf, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <h4 className="font-bold text-gray-700">{pdf.title}</h4>
                                        <a 
                                            href={pdf.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center text-sm bg-sakura text-white px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-sakura/90 transition-colors"
                                        >
                                            <ExternalLink size={14} className="mr-1" /> 全螢幕閱讀
                                        </a>
                                    </div>
                                    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                                        <iframe 
                                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdf.url)}&embedded=true`}
                                            title={pdf.title}
                                            className="w-full h-[600px]"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white w-full max-w-3xl rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-earth">{editItem?.id ? '編輯公告' : '發布新公告'}</h2>
                <button type="button" onClick={() => setIsAdminModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">發布日期</label>
                    <input 
                        required 
                        type="date" 
                        value={editItem?.date || ''} 
                        onChange={e => setEditItem({...editItem, date: e.target.value})} 
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-sage" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">標籤 (以逗號分隔)</label>
                    <input 
                        type="text" 
                        placeholder="例: 公開徵信, 活動紀錄"
                        value={editItem?.tags?.join(', ') || ''} 
                        onChange={e => setEditItem({...editItem, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-sage" 
                    />
                </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章標題</label>
                <input required type="text" value={editItem?.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-sage" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">內容</label>
                <textarea required rows={6} value={editItem?.content || ''} onChange={e => setEditItem({...editItem, content: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-sage"></textarea>
              </div>

              {/* Image Upload */}
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">新增圖片 (將加入到輪播圖第一張)</label>
                <div className="flex items-center">
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors">
                    <Upload className="mr-2 h-4 w-4" /> 選擇檔案
                    <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <span className="ml-3 text-xs text-gray-500">{imageFile ? imageFile.name : '尚未選擇檔案'}</span>
                </div>
                {/* Preview existing images count */}
                {(editItem?.images?.length || 0) > 0 && (
                     <div className="mt-3 text-xs text-gray-500">目前已有 {editItem?.images?.length} 張圖片 (舊圖保留)</div>
                )}
              </div>

              {/* PDF Embed Section */}
              <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-3">嵌入 PDF 文件</label>
                
                {/* Existing PDFs List */}
                {editItem?.embeddedPdfs && editItem.embeddedPdfs.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {editItem.embeddedPdfs.map((pdf, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex items-center overflow-hidden">
                                    <FileText size={16} className="text-blue-400 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 truncate">{pdf.title}</span>
                                </div>
                                <button type="button" onClick={() => removePdfFromForm(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New PDF Inputs */}
                <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        type="text" 
                        placeholder="文件標題 (如: 112年度結案報告)" 
                        value={pdfTitle}
                        onChange={e => setPdfTitle(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input 
                        type="text" 
                        placeholder="PDF 連結 URL" 
                        value={pdfUrl}
                        onChange={e => setPdfUrl(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <button 
                        type="button" 
                        onClick={addPdfToForm}
                        disabled={!pdfTitle || !pdfUrl}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        加入列表
                    </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-10 pt-6 border-t border-gray-100">
              <button disabled={isSubmitting} type="button" onClick={() => setIsAdminModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200">取消</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-4 bg-sage text-white rounded-2xl font-bold hover:bg-sage/90 shadow-lg flex items-center justify-center">
                {isSubmitting ? <Loader2 className="animate-spin" /> : '確認發布'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
