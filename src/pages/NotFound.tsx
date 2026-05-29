import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Home, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <DashboardLayout>
      <div className={cn(
        "flex min-h-screen items-center justify-center relative overflow-hidden",
        isRTL && "rtl"
      )}>
        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-gray-300/30 to-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="text-center relative z-10 px-6 animate-fade-in">
          {/* 404 Icon */}
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="relative">
              <AlertCircle className="w-24 h-24 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
            </div>
          </div>

          {/* 404 Number */}
          <h1 className="mb-2 text-9xl font-black bg-gradient-to-r from-white via-blue-500 to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer leading-tight font-display tracking-tighter">
            404
          </h1>

          {/* Title */}
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t('notFound.title')}
          </h2>

          {/* Message */}
          <p className="mb-8 text-lg text-white/40 max-w-[1220px] mx-auto leading-relaxed">
            {t('notFound.message')}
          </p>

          {/* Return Home Button - Premium */}
          <button
            onClick={() => navigate('/')}
            className="group relative px-10 py-4 text-lg font-bold rounded-2xl overflow-hidden transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-blue-600/50"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 bg-[length:200%_auto] animate-shimmer"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-sky-300 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>

            {/* Button content */}
            <div className="relative flex items-center gap-3 text-foreground">
              <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>{t('notFound.returnHome')}</span>
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-300/50"></div>
          </button>

          {/* Path information */}
          <p className="mt-6 text-xs text-white/10 font-mono">
            {location.pathname}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;
