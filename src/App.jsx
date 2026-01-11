/**
 * Main Application Component
 */

import { Header } from './Components/layout/Header';
import { Footer } from './Components/layout/Footer';
import { Button } from './Components/ui/Button';
import { LoadingSpinner } from './Components/ui/LoadingSpinner';
import { TrackList } from './Components/tracks/TrackList';
import { ExportButtons } from './Components/tracks/ExportButtons';
import { useAuth, AUTH_STATUS } from './context/AuthContext';
import { useTracks, TRACKS_STATUS } from './hooks/useTracks';

/**
 * Hero Section - Shown when not authenticated
 */
function HeroSection() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center px-4">
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold text-light leading-tight">
          Spotify Şarkılarını
          <span className="text-spotify"> Dışa Aktar</span>
        </h2>
        <p className="text-lg text-light/70 leading-relaxed">
          Spotify'da kaydettiğin şarkıları CSV veya JSON formatında dışa aktar.
          Başka platformlara taşı, arşivle veya analiz et.
        </p>
      </div>

      <Button onClick={login} variant="primary" size="lg" className="gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        Spotify ile Giriş Yap
      </Button>

      <div className="flex items-center gap-6 text-light/50 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Ücretsiz</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Güvenli</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Hızlı</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Section - Shown when authenticated
 */
function DashboardSection() {
  const { tracks, status, progress, refetch, forceRefresh, error, isFromCache, cacheAge, cacheSize } = useTracks();

  if (status === TRACKS_STATUS.LOADING) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          message="Şarkılar yükleniyor..."
          progress={progress}
        />
      </div>
    );
  }

  if (status === TRACKS_STATUS.ERROR) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Bir hata oluştu</p>
          <p className="text-light/60">{error}</p>
        </div>
        <Button onClick={refetch} variant="secondary">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 flex flex-col h-full">
      {/* Stats Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold text-light">{tracks.length}</span>
            <span className="text-light/60 text-sm md:text-base">kayıtlı şarkı</span>
          </div>
          
          {/* Cache indicator */}
          {isFromCache && (
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="px-2 py-1 rounded-full bg-spotify/20 text-spotify flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {cacheAge < 1 ? 'Az önce' : `${cacheAge} dk önce`}
                {cacheSize && <span className="text-spotify/70 hidden sm:inline">({cacheSize})</span>}
              </span>
              <button
                onClick={forceRefresh}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-light/60 hover:text-light"
                title="Verileri yenile (API'den çek)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <ExportButtons tracks={tracks} />
      </div>

      {/* Track List - fills remaining space */}
      <div className="flex-1 min-h-0">
        <TrackList tracks={tracks} />
      </div>
    </div>
  );
}

/**
 * Error Display Section
 */
function ErrorSection() {
  const { error, login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="text-red-400">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Kimlik Doğrulama Hatası</h2>
        <p className="text-light/70">{error}</p>
      </div>
      <Button onClick={login} variant="primary">
        Tekrar Giriş Yap
      </Button>
    </div>
  );
}

/**
 * Main App Component
 */
function App() {
  const { status, isAuthenticated } = useAuth();

  const renderContent = () => {
    if (status === AUTH_STATUS.LOADING) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Yükleniyor..." />
        </div>
      );
    }

    if (status === AUTH_STATUS.ERROR) {
      return <ErrorSection />;
    }

    if (isAuthenticated) {
      return <DashboardSection />;
    }

    return <HeroSection />;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-dark via-dark to-[#1a1a2e] flex flex-col overflow-hidden">
      <Header />
      <main className={`flex-1 flex min-h-0 ${isAuthenticated ? 'py-2 md:py-4' : 'items-center justify-center py-8'}`}>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
