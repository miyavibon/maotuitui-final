
import React, { useState, useEffect } from 'react';
import { Page, Dog, NewsItem } from './types';
import { db, auth } from './firebase';
// @ts-ignore
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// @ts-ignore
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import AdoptionPage from './pages/AdoptionPage';
import AdoptionInfoPage from './pages/AdoptionInfoPage';
import DonationPage from './pages/DonationPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [permissionError, setPermissionError] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // 1. 監聽管理員登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  // 2. 監聽 Firestore 即時數據
  useEffect(() => {
    // 狗狗資料監聽
    const qDogs = query(collection(db, 'dogs'), orderBy('createdAt', 'desc'));
    const unsubDogs = onSnapshot(qDogs, (snapshot: any) => {
      setDogs(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as Dog)));
      setPermissionError(false);
    }, (error: any) => {
      if (error.code === 'permission-denied') {
        console.error("Firestore Permission Denied. Please update your Security Rules.");
        setPermissionError(true);
      }
    });

    // 最新消息監聽
    const qNews = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubNews = onSnapshot(qNews, (snapshot: any) => {
      setNews(snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as NewsItem)));
    }, (error: any) => console.error("News error:", error));

    return () => {
      unsubDogs();
      unsubNews();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage(Page.Home);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const renderPage = () => {
    if (permissionError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] border border-red-100 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">資料庫存取受限</h2>
            <p className="mb-6">請確認您的 Firebase Firestore 安全規則已設定為允許讀取。您可以檢查控制台中的 Rules 設定。</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-2 bg-red-600 text-white rounded-full font-bold"
            >
              重新整理網頁
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case Page.Home: return <HomePage setPage={setCurrentPage} dogs={dogs} news={news} />;
      case Page.About: return <AboutPage />;
      case Page.News: return <NewsPage news={news} isAdmin={isAdmin} />;
      case Page.Adoption: return <AdoptionPage dogs={dogs} isAdmin={isAdmin} />;
      case Page.AdoptionInfo: return <AdoptionInfoPage />;
      case Page.Donation: return <DonationPage setPage={setCurrentPage} />;
      case Page.Contact: return <ContactPage />;
      case Page.Login: return <LoginPage onLoginSuccess={() => setCurrentPage(Page.Home)} />;
      default: return <HomePage setPage={setCurrentPage} dogs={dogs} news={news} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-sage/30">
      <Navbar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        isAdmin={isAdmin} 
        onLogout={handleLogout} 
      />
      <main className="flex-grow pt-20">
        {renderPage()}
      </main>
      <Footer setPage={setCurrentPage} />
    </div>
  );
};

export default App;
