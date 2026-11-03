import React, { useState, useRef } from 'react';
import { Dog } from '../types';
import { db, storage } from '../firebase';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
// @ts-ignore - Suppressing module export errors for Firebase modular SDK
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Plus, Edit2, Trash2, X, Heart, Info, Upload, Loader2, 
  Dog as DogIcon, Cat as CatIcon, FileSpreadsheet, Download, 
  CheckCircle2, AlertCircle, Sparkles, FileText, ArrowRight
} from 'lucide-react';

interface AdoptionPageProps {
  dogs: Dog[];
  isAdmin: boolean;
}

interface ParsedPetRow {
  id?: string;
  name: string;
  age: string;
  gender: '男生' | '女生';
  personality: string;
  breed: string;
  story: string;
  species: '狗' | '貓';
  imageUrl?: string;
}

const DEFAULT_DOG_IMG = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800';
const DEFAULT_CAT_IMG = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800';

const AdoptionPage: React.FC<AdoptionPageProps> = ({ dogs, isAdmin }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<'狗' | '貓'>('狗');
  
  // 個別新增 / 編輯 Modal 狀態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [editDog, setEditDog] = useState<Partial<Dog> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 批次匯入 Modal 狀態
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchRawText, setBatchRawText] = useState('');
  const [batchDefaultSpecies, setBatchDefaultSpecies] = useState<'狗' | '貓'>('狗');
  const [parsedRows, setParsedRows] = useState<ParsedPetRow[]>([]);
  const [batchStep, setBatchStep] = useState<'input' | 'preview'>('input');
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 統計數量（無 species 舊資料預設視為狗）
  const dogCount = dogs.filter(pet => (pet.species || '狗') === '狗').length;
  const catCount = dogs.filter(pet => pet.species === '貓').length;

  // 依當前選中頁籤篩選清單
  const filteredDogs = dogs.filter(pet => {
    const species = pet.species || '狗';
    return species === selectedSpecies;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除這筆毛孩資料嗎？')) {
      await deleteDoc(doc(db, 'dogs', id));
    }
  };

  // 儲存單筆新增/編輯
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDog?.name || !editDog?.age) return;
    setIsSubmitting(true);

    try {
      let imageUrl = editDog.imageUrl || '';

      // 若有選擇新檔案，先上傳到 Storage
      if (imageFile) {
        const storageRef = ref(storage, `dogs/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const species = editDog.species || '狗';
      const fallbackImg = species === '貓' ? DEFAULT_CAT_IMG : DEFAULT_DOG_IMG;

      const payload = {
        name: editDog.name.trim(),
        age: editDog.age.trim(),
        gender: editDog.gender || '男生',
        species: species,
        breed: editDog.breed?.trim() || '',
        personality: editDog.personality?.trim() || '',
        story: editDog.story?.trim() || '',
        imageUrl: imageUrl || fallbackImg,
      };

      if (editDog.id) {
        await updateDoc(doc(db, 'dogs', editDog.id), {
          ...payload,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'dogs'), {
          ...payload,
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

  // 解析 CSV / TSV 字串（支援引號、逗號、Tab 分隔）
  const parseDelimitedText = (text: string): string[][] => {
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const isTab = normalized.includes('\t') && !normalized.includes(',');
    
    if (isTab) {
      return normalized
        .split('\n')
        .map(line => line.split('\t').map(c => c.trim().replace(/^["']|["']$/g, '')))
        .filter(row => row.some(c => c.length > 0));
    }

    const lines: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      const nextChar = normalized[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if ((char === ',' || char === '\t') && !insideQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' && !insideQuotes) {
        currentRow.push(currentField.trim());
        if (currentRow.some(f => f.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some(f => f.length > 0)) {
        lines.push(currentRow);
      }
    }

    return lines;
  };

  // 性別格式正規化（公/母 -> 男生/女生）
  const normalizeGender = (val: string): '男生' | '女生' => {
    const v = (val || '').trim().toLowerCase();
    if (v.includes('母') || v.includes('女') || v === 'f' || v === 'female') {
      return '女生';
    }
    return '男生';
  };

  // 物種正規化
  const normalizeSpecies = (val: string, fallback: '狗' | '貓'): '狗' | '貓' => {
    const v = (val || '').trim().toLowerCase();
    if (v.includes('貓') || v === 'cat') return '貓';
    if (v.includes('狗') || v === 'dog') return '狗';
    return fallback;
  };

  // 處理批次文字解析
  const handleParseBatchText = () => {
    if (!batchRawText.trim()) {
      alert('請先輸入或貼上資料！');
      return;
    }

    const rows = parseDelimitedText(batchRawText);
    if (rows.length === 0) {
      alert('未偵測到有效資料行，請確認格式');
      return;
    }

    // 檢查首行是否為表頭（包含「名字」或「name」）
    const firstRowStr = rows[0].join(' ');
    const hasHeader = /名字|姓名|名稱|name|年紀|年齡|性別/i.test(firstRowStr);
    const dataRows = hasHeader ? rows.slice(1) : rows;

    const parsed: ParsedPetRow[] = [];

    dataRows.forEach(cells => {
      // 依序對應：『名字』、『年紀』、『性別 (公母)』、『個性』、『品種』、『文字說明』
      // 可選擴充：cells[6]=動物種類, cells[7]=圖片網址
      const name = cells[0] || '';
      if (!name) return; // 忽略無名字的空白行

      const age = cells[1] || '未知';
      const genderRaw = cells[2] || '公';
      const personality = cells[3] || '';
      const breed = cells[4] || '';
      const story = cells[5] || '';
      const speciesRaw = cells[6] || '';
      const imageUrl = cells[7] || '';

      const species = normalizeSpecies(speciesRaw, batchDefaultSpecies);
      const gender = normalizeGender(genderRaw);

      parsed.push({
        name,
        age,
        gender,
        personality,
        breed,
        story,
        species,
        imageUrl: imageUrl || (species === '貓' ? DEFAULT_CAT_IMG : DEFAULT_DOG_IMG)
      });
    });

    if (parsed.length === 0) {
      alert('解析失敗，請確認每筆資料至少包含「名字」！');
      return;
    }

    setParsedRows(parsed);
    setBatchStep('preview');
  };

  // 上傳 CSV 檔案處理
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBatchRawText(content);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // 填入範例資料供使用者快速測試與對照
  const handleLoadSampleData = () => {
    const sample = `名字\t年紀\t性別\t個性\t品種\t文字說明
小乖\t2歲\t公\t親人溫和、愛討摸\t米克斯\t在花蓮工廠附近獲救，性格非常乖巧，散步不會爆衝，是貼心的伴侶犬。
豆豆\t8個月\t母\t活潑好動、愛玩球\t黃金獵犬混血\t充滿活力的小女孩，喜歡跟其他狗狗互動，渴望有一個溫暖的家。
咪寶\t1歲\t公\t慢熟撒嬌、愛呼嚕\t虎斑貓\t剛開始會稍微害羞，一旦熟悉後會主動用頭蹭人，超級愛吃肉泥！
糖糖\t3歲\t母\t溫馴黏人、愛看窗外\t米克斯貓\t毛色柔亮漂亮，個性安靜溫柔，非常適合室內陪伴。`;
    setBatchRawText(sample);
  };

  // 下載 CSV 範本檔案
  const handleDownloadTemplate = () => {
    const csvContent = "\uFEFF" + "名字,年紀,性別,個性,品種,文字說明,動物種類(可選填狗或貓),圖片網址(可選填)\n" +
      "小乖,2歲,公,親人溫和、愛討摸,米克斯,在工廠獲救的貼心孩子,狗,\n" +
      "咪寶,1歲,母,慢熟撒嬌、愛呼嚕,虎斑貓,溫柔可愛的呼嚕怪,貓,";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '毛腿腿_待認養毛孩批次匯入範本.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 執行批次寫入 Firestore (使用 writeBatch 加速)
  const handleCommitBatchImport = async () => {
    if (parsedRows.length === 0) return;
    setIsSubmitting(true);
    setBatchProgress({ current: 0, total: parsedRows.length });

    try {
      // Firestore batch 上限 500 筆，此處分批處理以保安全
      const chunkSize = 400;
      for (let i = 0; i < parsedRows.length; i += chunkSize) {
        const chunk = parsedRows.slice(i, i + chunkSize);
        const batch = writeBatch(db);

        chunk.forEach(pet => {
          const newDocRef = doc(collection(db, 'dogs'));
          batch.set(newDocRef, {
            name: pet.name.trim(),
            age: pet.age.trim(),
            gender: pet.gender,
            species: pet.species,
            breed: pet.breed.trim(),
            personality: pet.personality.trim(),
            story: pet.story.trim(),
            imageUrl: pet.imageUrl || (pet.species === '貓' ? DEFAULT_CAT_IMG : DEFAULT_DOG_IMG),
            isAdopted: false,
            createdAt: Date.now()
          });
        });

        await batch.commit();
        setBatchProgress({ current: Math.min(i + chunkSize, parsedRows.length), total: parsedRows.length });
      }

      alert(`成功批次匯入 ${parsedRows.length} 筆毛孩資料！`);
      setIsBatchModalOpen(false);
      setParsedRows([]);
      setBatchRawText('');
      setBatchStep('input');
    } catch (err) {
      alert('批次匯入發生錯誤：' + err);
    } finally {
      setIsSubmitting(false);
      setBatchProgress(null);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        {/* 標題與管理功能按鈕區塊 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-earth mb-2">認養專區</h1>
            <p className="text-gray-500">在這裡遇見你的靈魂伴侶，讓浪愛回家。</p>
          </div>
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              {/* 批次匯入按鈕 */}
              <button 
                onClick={() => {
                  setBatchDefaultSpecies(selectedSpecies);
                  setBatchStep('input');
                  setIsBatchModalOpen(true);
                }}
                className="flex items-center bg-white text-earth border-2 border-earth/20 px-5 py-3 rounded-full font-bold shadow-sm hover:border-sakura hover:text-sakura hover:shadow transition-all cursor-pointer"
              >
                <FileSpreadsheet className="mr-2 text-sakura" size={20} /> 批次匯入毛孩
              </button>

              {/* 單筆新增按鈕 */}
              <button 
                onClick={() => { 
                  setEditDog({ species: selectedSpecies, gender: '男生', breed: '', personality: '', story: '' }); 
                  setImageFile(null);
                  setIsModalOpen(true); 
                }}
                className="flex items-center bg-sakura text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-sakura/90 transition-all cursor-pointer"
              >
                <Plus className="mr-2" size={20} /> 新增待認養毛孩
              </button>
            </div>
          )}
        </div>

        {/* 1. 頁籤切換元件（Tabs）：位於按鈕下方，包含『找狗狗』與『找貓咪』 */}
        <div className="flex justify-center sm:justify-start mb-10">
          <div className="inline-flex p-1.5 bg-white rounded-2xl shadow-sm border border-stone-200/80">
            <button
              type="button"
              onClick={() => setSelectedSpecies('狗')}
              className={`flex items-center space-x-2.5 px-7 py-3 rounded-xl font-bold text-base transition-all cursor-pointer ${
                selectedSpecies === '狗'
                  ? 'bg-sakura text-white shadow-md'
                  : 'text-stone-600 hover:text-earth hover:bg-stone-50'
              }`}
            >
              <DogIcon size={20} />
              <span>找狗狗</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                selectedSpecies === '狗' ? 'bg-white/30 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {dogCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSpecies('貓')}
              className={`flex items-center space-x-2.5 px-7 py-3 rounded-xl font-bold text-base transition-all cursor-pointer ${
                selectedSpecies === '貓'
                  ? 'bg-sakura text-white shadow-md'
                  : 'text-stone-600 hover:text-earth hover:bg-stone-50'
              }`}
            >
              <CatIcon size={20} />
              <span>找貓咪</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                selectedSpecies === '貓' ? 'bg-white/30 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {catCount}
              </span>
            </button>
          </div>
        </div>

        {/* 3. 列表顯示邏輯：依頁籤篩選，排版樣式保持不變 */}
        {filteredDogs.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-stone-200 p-8 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-sakura/10 text-sakura rounded-full flex items-center justify-center">
              {selectedSpecies === '狗' ? <DogIcon size={32} /> : <CatIcon size={32} />}
            </div>
            <h3 className="text-xl font-bold text-earth mb-2">
              目前暫無待認養的{selectedSpecies === '狗' ? '狗狗' : '貓咪'}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              歡迎隨時關注我們的粉絲專頁與最新消息，或與我們聯繫了解更多毛孩資訊！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={dog.imageUrl || (dog.species === '貓' ? DEFAULT_CAT_IMG : DEFAULT_DOG_IMG)} 
                    alt={dog.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedDog(dog)}
                      className="bg-white text-sakura px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform cursor-pointer"
                    >
                      查看詳情
                    </button>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditDog({ ...dog, species: dog.species || '狗' }); 
                          setImageFile(null);
                          setIsModalOpen(true); 
                        }} 
                        className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors cursor-pointer"
                        title="編輯毛孩"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(dog.id); }} 
                        className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                        title="刪除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${dog.gender === '女生' ? 'bg-pink-100/90 text-pink-600' : 'bg-blue-100/90 text-blue-600'}`}>
                      {dog.gender === '女生' ? '女生 (母)' : '男生 (公)'} • {dog.age}
                    </span>
                    {dog.breed && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-stone-700 shadow-sm backdrop-blur-xs">
                        {dog.breed}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 text-center flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-1.5 text-gray-800">{dog.name}</h3>
                  {dog.personality && (
                    <p className="text-xs text-sakura font-semibold mb-2 line-clamp-1">
                      ✨ {dog.personality}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{dog.story}</p>
                  <div className="mt-auto">
                     <button 
                      onClick={() => setSelectedDog(dog)}
                      className="w-full py-2 border-2 border-sakura/30 text-sakura rounded-full font-bold hover:bg-sakura hover:text-white transition-all text-sm cursor-pointer"
                    >
                      閱讀牠的故事
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedDog(null)} 
              className="absolute top-6 right-6 p-2 bg-cream text-gray-500 rounded-full hover:text-sakura transition-colors z-10 cursor-pointer"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 h-80 md:h-auto">
                <img 
                  src={selectedDog.imageUrl || (selectedDog.species === '貓' ? DEFAULT_CAT_IMG : DEFAULT_DOG_IMG)} 
                  alt={selectedDog.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-earth/10 text-earth px-3 py-1 rounded-full text-sm font-bold">
                    {selectedDog.species || '狗'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedDog.gender === '女生' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                    {selectedDog.gender === '女生' ? '女生 (母)' : '男生 (公)'}
                  </span>
                  <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm font-bold">{selectedDog.age}</span>
                  {selectedDog.breed && (
                    <span className="bg-mimosa/30 text-earth px-3 py-1 rounded-full text-sm font-bold">
                      品種：{selectedDog.breed}
                    </span>
                  )}
                </div>

                <h2 className="text-4xl font-bold text-gray-800 mb-3">{selectedDog.name} 的故事</h2>
                
                {selectedDog.personality && (
                  <div className="mb-6 inline-flex items-center bg-sakura/10 text-sakura px-4 py-1.5 rounded-2xl text-sm font-bold">
                    <Sparkles size={16} className="mr-1.5" />
                    個性：{selectedDog.personality}
                  </div>
                )}

                <div className="prose prose-sakura text-gray-600 leading-loose whitespace-pre-line mb-8">
                  {selectedDog.story}
                </div>
                <div className="bg-mimosa/20 p-6 rounded-3xl border border-sakura/10">
                  <div className="flex items-start">
                    <Info className="text-sakura mr-3 flex-shrink-0 mt-1" size={20} />
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

      {/* 2. Admin Edit Modal: 單筆新增/編輯 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-earth mb-6">{editDog?.id ? '編輯毛孩資料' : '新增待認養毛孩'}</h2>
            <div className="space-y-4">
              {/* 動物種類 (species) 單選元件 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  動物種類 (species) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center py-2.5 px-4 border rounded-xl cursor-pointer transition-all ${
                    (editDog?.species || '狗') === '狗' 
                      ? 'border-sakura bg-sakura/10 text-sakura font-bold ring-2 ring-sakura/30' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="species" 
                      value="狗" 
                      checked={(editDog?.species || '狗') === '狗'} 
                      onChange={() => setEditDog({...editDog, species: '狗'})}
                      className="sr-only" 
                    />
                    <DogIcon size={18} className="mr-2" />
                    <span>狗</span>
                  </label>
                  <label className={`flex items-center justify-center py-2.5 px-4 border rounded-xl cursor-pointer transition-all ${
                    editDog?.species === '貓' 
                      ? 'border-sakura bg-sakura/10 text-sakura font-bold ring-2 ring-sakura/30' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="species" 
                      value="貓" 
                      checked={editDog?.species === '貓'} 
                      onChange={() => setEditDog({...editDog, species: '貓'})}
                      className="sr-only" 
                    />
                    <CatIcon size={18} className="mr-2" />
                    <span>貓</span>
                  </label>
                </div>
              </div>

              {/* 名字與性別 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名字 <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="例：小乖" value={editDog?.name || ''} onChange={e => setEditDog({...editDog, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sakura outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">性別 (公/母)</label>
                  <select value={editDog?.gender || '男生'} onChange={e => setEditDog({...editDog, gender: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sakura outline-none">
                    <option value="男生">男生 (公)</option>
                    <option value="女生">女生 (母)</option>
                  </select>
                </div>
              </div>

              {/* 年紀與品種 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年紀 <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="例：2歲 或 6個月" value={editDog?.age || ''} onChange={e => setEditDog({...editDog, age: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sakura outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">品種</label>
                  <input type="text" placeholder="例：米克斯、黃金獵犬" value={editDog?.breed || ''} onChange={e => setEditDog({...editDog, breed: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sakura outline-none" />
                </div>
              </div>

              {/* 個性 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">個性</label>
                <input type="text" placeholder="例：親人溫和、活潑愛撒嬌、貪吃" value={editDog?.personality || ''} onChange={e => setEditDog({...editDog, personality: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sakura outline-none" />
              </div>

              {/* 文字說明 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文字說明 / 故事</label>
                <textarea rows={4} placeholder="描述毛孩的故事背景、特質與認養期待..." value={editDog?.story || ''} onChange={e => setEditDog({...editDog, story: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sakura outline-none"></textarea>
              </div>

              {/* 照片上傳 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">毛孩照片</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="mr-2 h-4 w-4" /> 選擇檔案
                    <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <span className="ml-3 text-xs text-gray-500">{imageFile ? imageFile.name : (editDog?.imageUrl ? '已保留現有照片' : '未選擇則自動使用園區預設照片')}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button disabled={isSubmitting} type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors cursor-pointer">取消</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-sakura text-white rounded-xl font-bold hover:bg-sakura/90 transition-colors flex items-center justify-center cursor-pointer">
                {isSubmitting ? <Loader2 className="animate-spin" /> : '儲存'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. 批次匯入 Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-earth flex items-center">
                  <FileSpreadsheet className="mr-2.5 text-sakura" size={26} /> 批次匯入待認養毛孩
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  支援直接複製 Excel / Google Sheets 表格，或上傳 CSV 檔案快速匯入多筆毛孩。
                </p>
              </div>
              <button 
                onClick={() => {
                  if (isSubmitting) return;
                  setIsBatchModalOpen(false);
                  setBatchStep('input');
                }}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {batchStep === 'input' && (
              <div className="space-y-6">
                {/* 欄位說明與快捷操作 */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <span className="font-bold text-sm text-stone-800">
                      欄位順序（從 Excel 貼上或 CSV）：
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={handleLoadSampleData}
                        className="text-xs bg-white text-sakura border border-sakura/30 hover:bg-sakura hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center"
                      >
                        <Sparkles size={14} className="mr-1" /> 載入範例資料
                      </button>
                      <button 
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="text-xs bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center"
                      >
                        <Download size={14} className="mr-1" /> 下載 CSV 範本
                      </button>
                    </div>
                  </div>

                  {/* 標記 6 大欄位 */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-sakura/15 text-sakura px-2.5 py-1 rounded-md font-bold">1. 名字</span>
                    <span className="bg-sakura/15 text-sakura px-2.5 py-1 rounded-md font-bold">2. 年紀</span>
                    <span className="bg-sakura/15 text-sakura px-2.5 py-1 rounded-md font-bold">3. 性別 (公/母)</span>
                    <span className="bg-sakura/15 text-sakura px-2.5 py-1 rounded-md font-bold">4. 個性</span>
                    <span className="bg-sakura/15 text-sakura px-2.5 py-1 rounded-md font-bold">5. 品種</span>
                    <span className="bg-sakura/15 text-sakura px-2.5 py-1 rounded-md font-bold">6. 文字說明</span>
                    <span className="bg-stone-200/70 text-stone-600 px-2.5 py-1 rounded-md">7. 動物種類(可選)</span>
                    <span className="bg-stone-200/70 text-stone-600 px-2.5 py-1 rounded-md">8. 圖片網址(可選)</span>
                  </div>
                </div>

                {/* 預設動物種類設定 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-cream rounded-2xl border border-stone-200/60">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-stone-700">未指定時預設動物種類：</span>
                    <div className="inline-flex p-1 bg-white rounded-xl border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setBatchDefaultSpecies('狗')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          batchDefaultSpecies === '狗' ? 'bg-sakura text-white' : 'text-stone-600 hover:text-earth'
                        }`}
                      >
                        狗 (狗狗)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatchDefaultSpecies('貓')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          batchDefaultSpecies === '貓' ? 'bg-sakura text-white' : 'text-stone-600 hover:text-earth'
                        }`}
                      >
                        貓 (貓咪)
                      </button>
                    </div>
                  </div>

                  {/* 檔案上傳按鈕 */}
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept=".csv,text/csv,text/plain" 
                      onChange={handleCsvFileUpload} 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-white text-earth border border-stone-300 hover:border-sakura hover:text-sakura px-4 py-2 rounded-xl font-bold flex items-center shadow-xs transition-all cursor-pointer"
                    >
                      <Upload size={14} className="mr-1.5 text-sakura" /> 上傳 CSV 檔案
                    </button>
                  </div>
                </div>

                {/* 資料輸入文字區塊 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-stone-700">
                      貼上表格文字（Excel 複製或 CSV 格式）：
                    </label>
                    {batchRawText && (
                      <button 
                        type="button" 
                        onClick={() => setBatchRawText('')}
                        className="text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        清空內容
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    value={batchRawText}
                    onChange={(e) => setBatchRawText(e.target.value)}
                    placeholder="可直接從 Excel 或 Google Sheets 複製包含「名字、年紀、性別、個性、品種、文字說明」的資料並貼在此處...&#10;例：&#10;小乖	2歲	公	親人溫和	米克斯	很貼心的陪伴犬"
                    className="w-full p-4 font-mono text-xs sm:text-sm bg-stone-50 rounded-2xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-sakura outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(false)}
                    className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleParseBatchText}
                    className="flex-1 py-3 bg-sakura text-white rounded-xl font-bold hover:bg-sakura/90 transition-all flex items-center justify-center shadow-md cursor-pointer"
                  >
                    下一步：解析並預覽資料 <ArrowRight size={18} className="ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {batchStep === 'preview' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sakura/10 p-4 rounded-2xl border border-sakura/20">
                  <div className="flex items-center text-stone-800">
                    <CheckCircle2 size={22} className="text-sakura mr-2 flex-shrink-0" />
                    <span className="font-bold">
                      成功解析 <span className="text-sakura text-lg">{parsedRows.length}</span> 筆毛孩資料
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">
                    確認無誤後點擊「確認匯入」，系統將批次同步至資料庫。
                  </div>
                </div>

                {/* 預覽清單表格 */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 max-h-[50vh]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-100 text-stone-700 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 font-bold w-12 text-center">#</th>
                        <th className="p-3 font-bold w-16">種類</th>
                        <th className="p-3 font-bold">名字</th>
                        <th className="p-3 font-bold">年紀</th>
                        <th className="p-3 font-bold">性別</th>
                        <th className="p-3 font-bold">品種</th>
                        <th className="p-3 font-bold">個性</th>
                        <th className="p-3 font-bold min-w-[200px]">文字說明</th>
                        <th className="p-3 font-bold w-12 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cream/50 transition-colors">
                          <td className="p-3 text-center text-stone-400 font-mono">{idx + 1}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              row.species === '貓' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {row.species}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-stone-900">{row.name}</td>
                          <td className="p-3 text-stone-600">{row.age}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              row.gender === '女生' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {row.gender === '女生' ? '母 (女)' : '公 (男)'}
                            </span>
                          </td>
                          <td className="p-3 text-stone-600">{row.breed || '-'}</td>
                          <td className="p-3 text-stone-600">{row.personality || '-'}</td>
                          <td className="p-3 text-stone-500 line-clamp-2 max-w-xs">{row.story || '-'}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setParsedRows(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="移除此筆"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 匯入進度提示 */}
                {batchProgress && (
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                      <span>正在批次儲存到資料庫...</span>
                      <span>{batchProgress.current} / {batchProgress.total}</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-sakura h-full transition-all duration-300"
                        style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setBatchStep('input')}
                    className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    返回修改文本
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || parsedRows.length === 0}
                    onClick={handleCommitBatchImport}
                    className="flex-1 py-3 bg-sakura text-white rounded-xl font-bold hover:bg-sakura/90 transition-all flex items-center justify-center shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        正在匯入中...
                      </>
                    ) : (
                      `確認匯入全部 (${parsedRows.length} 筆)`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionPage;
