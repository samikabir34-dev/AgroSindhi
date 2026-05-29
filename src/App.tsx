import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Map from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";

// MarketAnalysis page removed
import WaterAnalysis from "./pages/WaterAnalysis";
import SavedFields from "./pages/SavedFields";
import AboutInstitution from "./pages/AboutInstitution";
import AboutSindhAgro from "./pages/AboutSindhAgro";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import NetworkError from './components/NetworkError';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { LanguageProvider } from './contexts/LanguageContext';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingElements from '@/components/FloatingElements';
import { useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
// AIAssistant removed

const queryClient = new QueryClient();

const AppContent = () => {
  const isOnline = useNetworkStatus();

  const location = useLocation();
  const isMapRoute = location.pathname === '/map';

  return (
    <>
      {!isOnline && <NetworkError />}
      <LoadingScreen />
      <div className="min-h-screen">
        <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<Map />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Market page removed */}
        <Route path="/water" element={<WaterAnalysis />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/saved-fields" element={<SavedFields />} />
        <Route path="/about-institution" element={<AboutInstitution />} />
        <Route path="/about-sindhagro" element={<AboutSindhAgro />} />
        <Route path="/team" element={<Team />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* Global chatbot removed */}
      {/* Render global footer and keep particle/floating decorations hidden on map */}
      <Footer />
      <ParticleBackground />
      <FloatingElements />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
