import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { LookupPage } from "./components/LookupPage";
import { OptionsPage } from "./components/OptionsPage";
import { PurchaseFoundPage } from "./components/PurchaseFoundPage";
import { ChatWidget } from "./components/ChatWidget";
import { Toaster } from "./components/ui/sonner";

type Page = "home" | "lookup" | "options" | "help" | "purchase-found";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [darkMode, setDarkMode] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sterling-dark-mode");
    if (saved) {
      setDarkMode(JSON.parse(saved));
    } else {
      // Check system preference
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("sterling-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigateToLookup = () => {
    setCurrentPage("lookup");
    setPurchaseData(null);
  };

  const handleNavigateToHelp = () => {
    setCurrentPage("help");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setPurchaseData(null);
  };

  const handleFoundPurchase = (data: any) => {
    setPurchaseData(data);
    setCurrentPage("purchase-found");
  };

  const handleSearchAgain = () => {
    setPurchaseData(null);
    setCurrentPage("lookup");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigateToLookup={handleNavigateToLookup}
            onNavigateToHelp={handleNavigateToHelp}
          />
        );
      case "lookup":
        return (
          <LookupPage
            onBack={handleBackToHome}
            onFoundPurchase={handleFoundPurchase}
          />
        );
      case "options":
        return purchaseData ? (
          <OptionsPage
            purchaseData={purchaseData}
            onBack={handleNavigateToLookup}
          />
        ) : (
          <HomePage
            onNavigateToLookup={handleNavigateToLookup}
            onNavigateToHelp={handleNavigateToHelp}
          />
        );
      case "help":
        return (
          <LookupPage
            onBack={handleBackToHome}
            onFoundPurchase={handleFoundPurchase}
          />
        );
      case "purchase-found":
        return (
          <PurchaseFoundPage
            onBack={handleBackToHome}
            onSearchAgain={handleSearchAgain}
            purchaseData={purchaseData}
          />
        );
      default:
        return (
          <HomePage
            onNavigateToLookup={handleNavigateToLookup}
            onNavigateToHelp={handleNavigateToHelp}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navigation darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      <Footer />
      <ChatWidget />
      <Toaster />
    </div>
  );
}