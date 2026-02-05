
import React, { useState } from 'react';
import { Dog } from '../types';
import { db, storage } from '../firebase';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit2, Trash2, X, Heart, Info, Upload, Loader2 } from 'lucide-react';

interface AdoptionPageProps {
  dogs: Dog[];
  isAdmin: boolean;
}

const AdoptionPage: React.FC<AdoptionPageProps> = ({ dogs, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [editDog, setEditDog] = useState<Partial<Dog> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除這筆狗狗資料嗎？')) {
      await deleteDoc(doc(db, 'dogs', id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDog?.name || !editDog?.age) return;
    setIsSubmitting(true);

    try {
      let imageUrl = editDog.imageUrl || '';

      // 1. 若有選擇新檔案，先上傳到 Storage
      if (imageFile) {
        const storageRef = ref(storage, `dogs/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. 儲存到 Firestore
      if (editDog.id) {
        await updateDoc(doc(db, 'dogs', editDog.id), {
          ...editDog,
          imageUrl,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'dogs'), {
          ...editDog,
          imageUrl,
          isAdopted: false,
          createdAt: Date.now()
        });
      }
      setIsModalOpen(false);
      setEditDog(null);
      setImageFile(null);
    } catch (err) {
      alert('儲存失敗：' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-earth mb-2">認養專區</h1>
            <p className="text-gray-500">在這裡遇見你的靈魂伴侶，讓浪愛回家。</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setEditDog({}); setIsModalOpen(true); }}
              className="flex items-center bg-sage text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-sage/90 transition-all"
            >
              <Plus className="mr-2" size={20} /> 新增待認養毛孩
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dogs.map((dog) => (
            <div key={dog.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedDog(dog)}
                    className="bg-white text-sage px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    查看詳情
                  </button>
                </div>
                {isAdmin && (
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditDog(dog); setIsModalOpen(true); }} className="p-2 bg-blue-500 text-white rounded-full shadow-md"><Edit2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(dog.id); }} className="p-2 bg-red-500 text-white rounded-full shadow-md"><Trash2 size={16} /></button>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                   <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sage shadow-sm">
                    {dog.gender} • {dog.age}
                  </span>
                </div>
              </div>
              <div className="p-6 text-center flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{dog.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{dog.story}</p>
                <div className="mt-auto">
                   <button 
                    onClick={() => setSelectedDog(dog)}
                    className="w-full py-2 border-2 border-sage/30 text-sage rounded-full font-bold hover:bg-sage hover:text-white transition-all text-sm"
                  >
                    閱讀牠的故事
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedDog(null)} className="absolute top-6 right-6 p-2 bg-cream text-gray-500 rounded-full hover:text-sage transition-colors z-10">
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 h-80 md:h-auto">
                <img src={selectedDog.imageUrl} alt={selectedDog.name} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-sage/10 text-sage px-3 py-1 rounded-full text-sm font-bold">{selectedDog.gender}</span>
                  <span className="bg-earth/10 text-earth px-3 py-1 rounded-full text-sm font-bold">{selectedDog.age}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">{selectedDog.name} 的故事</h2>
                <div className="prose prose-sage text-gray-600 leading-loose whitespace-pre-line mb-8">
                  {selectedDog.story}
                </div>
                <div className="bg-beige p-6 rounded-3xl border border-sage/10">
                  <div className="flex items-start">
                    <Info className="text-sage mr-3 flex-shrink-0 mt-1" size={20} />
                    <div className="text-sm text-gray-600">
                      <p className="font-bold mb-1">認養小叮嚀</p>
                      <p>喜歡 {selectedDog.name} 嗎？請先閱讀認養須知，確認符合條件後，私訊 FB「毛腿腿認養團」提出申請。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-earth mb-6">{editDog?.id ? '編輯毛孩資料' : '新增待認養毛孩'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">毛孩名稱</label>
                <input required type="text" value={editDog?.name || ''} onChange={e => setEditDog({...editDog, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage outline-none" />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                  <select value={editDog?.gender || '男生'} onChange={e => setEditDog({...editDog, gender: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage outline-none">
                    <option value="男生">男生</option>
                    <option value="女生">女生</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">年齡 (例如: 3歲)</label>
                  <input required type="text" value={editDog?.age || ''} onChange={e => setEditDog({...editDog, age: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">故事/簡述</label>
                <textarea rows={4} value={editDog?.story || ''} onChange={e => setEditDog({...editDog, story: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上傳圖片</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="mr-2 h-4 w-4" /> 選擇檔案
                    <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <span className="ml-3 text-xs text-gray-500">{imageFile ? imageFile.name : '尚未選擇檔案'}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button disabled={isSubmitting} type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">取消</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-sage text-white rounded-xl font-bold hover:bg-sage/90 transition-colors flex items-center justify-center">
                {isSubmitting ? <Loader2 className="animate-spin" /> : '儲存'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdoptionPage;
