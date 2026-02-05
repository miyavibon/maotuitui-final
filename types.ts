
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
  gender: '男生' | '女生';
  age: string;
  story: string;
  imageUrl: string;
  isAdopted: boolean;
  createdAt: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
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
