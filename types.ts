
export enum Page {
  Home = 'home',
  About = 'about',
  News = 'news',
  Adoption = 'adoption',
  AdoptionInfo = 'adoption-info',
  Donation = 'donation',
  Contact = 'contact',
  Login = 'login'
}

export interface Dog {
  id: string;
  name: string;
  species?: '狗' | '貓';
  gender: '男生' | '女生';
  age: string;
  breed?: string;        // 品種 (如: 米克斯、柴犬、虎斑貓)
  personality?: string;  // 個性 (如: 親人溫和、活潑好動、慢熟)
  story: string;         // 文字說明 / 故事
  imageUrl: string;
  isAdopted: boolean;
  createdAt: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string; // 保留以相容舊資料
  images?: string[]; // 新增：支援多張圖片
  tags?: string[];   // 新增：文章標籤 (如：公開徵信)
  embeddedPdfs?: {   // 新增：嵌入 PDF
    title: string;
    url: string;
  }[];
}

export interface DonationReceipt {
  id: string;
  donorName: string;
  amount: number;
  method: string;
  bankLast5: string;
  phone: string;
  address: string;
  taxId?: string;
  note: string;
  status: 'pending' | 'processed';
  createdAt: number;
}
