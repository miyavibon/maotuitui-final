
import React, { useState } from 'react';
import { NewsItem } from '../types';
import { db, storage } from '../firebase';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit2, Trash2, X, Calendar, Upload, Loader2 } from 'lucide-react';

interface NewsPageProps {
  news: NewsItem[];
  isAdmin: boolean;
}

const NewsPage: React.FC<NewsPageProps> = ({ news, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editItem, setEditItem] = useState<Partial<NewsItem> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除這篇文章嗎？')) {
      await deleteDoc(doc(db, 'news', id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem?.title || !editItem?.content) return;
    setIsSubmitting(true);

    try {
      let imageUrl = editItem.imageUrl || '';
      if (imageFile) {
        const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      if (editItem.id) {
        await updateDoc(doc(db, 'news', editItem.id), {
          ...editItem,
          imageUrl
        });
      } else {
        await addDoc(collection(db, 'news'), {
          ...editItem,
          imageUrl,
          date: new Date().toISOString().split('T')[0]
        });
      }
      setIsModalOpen(false);
      setEditItem(null);
      setImageFile(null);
    } catch (err) {
      alert('儲存失敗：' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-earth">最新消息</h1>
          {isAdmin && (
            <button 
              onClick={() => { setEditItem({}); setIsModalOpen(true); }}
              className="flex items-center bg-sage text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-sage/90 transition-all"
            >
              <Plus className="mr-2" size={20} /> 發布新公告
            </button>
          )}
        </div>

        <div className="space-y-12">
          {news.map((item) => (
            <article key={item.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row border border-sage/5 relative">
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-3/5 p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-sage font-medium mb-4">
                    <Calendar size={16} className="mr-2" />
                    <span>{item.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{item.title}</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8 line-clamp-4">
                    {item.content}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="w-4"></div>
                    {isAdmin && (
                        <div className="flex space-x-2">
                            <button onClick={() => { setEditItem(item); setIsModalOpen(true); }} className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white w-full max-w-2xl rounded-3xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-earth mb-8">{editItem?.id ? '編輯公告' : '發布新公告'}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章標題</label>
                <input required type="text" value={editItem?.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-cream outline-none focus:ring-2 focus:ring-sage" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">內容</label>
                <textarea required rows={6} value={editItem?.content || ''} onChange={e => setEditItem({...editItem, content: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-cream outline-none focus:ring-2 focus:ring-sage"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">上傳封面圖片</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="mr-2 h-4 w-4" /> 選擇檔案
                    <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <span className="ml-3 text-xs text-gray-500">{imageFile ? imageFile.name : '尚未選擇檔案'}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-10">
              <button disabled={isSubmitting} type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200">取消</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-4 bg-sage text-white rounded-2xl font-bold hover:bg-sage/90 shadow-lg flex items-center justify-center">
                {isSubmitting ? <Loader2 className="animate-spin" /> : '發布公告'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
