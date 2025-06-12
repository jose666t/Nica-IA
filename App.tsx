
import React, { useState, Suspense } from 'react';
// Changed from React.lazy to static imports
import ImageGeneratorPage from './components/ImageGeneratorPage.tsx';
import GeminiChatPage from './components/GeminiChatPage.tsx';
import LoadingSpinner from './components/LoadingSpinner'; // For Suspense fallback

// Using SVGs directly for icons to avoid extra dependency if not already present
const ChatBubbleLeftEllipsisIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 1 4.5 21.75a6.721 6.721 0 0 1-2.433-1.343L.5 21.75l1.305-3.045A6.704 6.704 0 0 1 1.5 12.75a6.72 6.72 0 0 1 6.72-6.72h9.08a6.72 6.72 0 0 1 6.72 6.72v3.384a6.708 6.708 0 0 1-2.481 4.908l1.42 3.287-2.735-1.127a6.712 6.712 0 0 1-4.225.938h-2.58a6.726 6.726 0 0 1-4.246-1.577Zm2.72-4.008a4.721 4.721 0 0 0 4.204 1.54h2.58a4.711 4.711 0 0 0 3.012-.677l.006-.003.093-.046a.75.75 0 0 1 .59-.064l1.34.55V17.5l-1.006-2.347a.75.75 0 0 1 .108-.738 4.706 4.706 0 0 0 1.76-3.665V9.384a4.72 4.72 0 0 0-4.72-4.72h-9.08a4.72 4.72 0 0 0-4.72 4.72v3.366a4.704 4.704 0 0 0 1.226 3.168l.06.092a.75.75 0 0 1 .018.706l-.963 2.247 1.832-.756a.75.75 0 0 1 .618-.051Z" clipRule="evenodd" />
    <path d="M8.25 10.875a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Z" />
    <path d="M8.25 13.125a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

const PhotoIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
  </svg>
);

const ShieldCheckIconSolid: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0L3.603 6.253a.75.75 0 0 0-.375.65V17.25c0 .247.044.49.13.722a.751.751 0 0 0 .546.608l7.5 2.625a.75.75 0 0 0 .43 0l7.5-2.625a.751.751 0 0 0 .546-.608c.085-.232.13-.475.13-.722V6.903a.75.75 0 0 0-.375-.65L12.516 2.17ZM11.25 14.12l-2.652-2.48a.75.75 0 0 1 1.028-1.094l1.968 1.845 3.952-4.148a.75.75 0 1 1 1.094 1.028L12.06 14.373c-.22.23-.554.26-.802.083l-.226-.156a.75.75 0 0 1-.008-.08Z" clipRule="evenodd" />
</svg>
);


type ActiveView = 'imageGenerator' | 'geminiChat';

// IconWrapper defined at module scope
const IconWrapper: React.FC<{ icon: React.ElementType, className?: string }> = ({ icon: IconComponent, className }) => {
  return <IconComponent className={`h-5 w-5 mr-2 ${className}`} />;
};


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('geminiChat');

  const renderView = () => {
    switch (activeView) {
      case 'imageGenerator':
        return <ImageGeneratorPage />;
      case 'geminiChat':
        return <GeminiChatPage />;
      default:
        return <GeminiChatPage />; 
    }
  };

  const navButtonClasses = (view: ActiveView) => 
    `flex items-center px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-gray-800 ${
      activeView === view 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105 hover:from-blue-600 hover:to-indigo-700' 
        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white focus:ring-indigo-400 hover:scale-105'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center selection:bg-indigo-500 selection:text-white">
      <header className="w-full bg-gray-800 shadow-xl p-3 md:p-4 sticky top-0 z-50 border-b border-gray-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-3 sm:mb-0">
             <ShieldCheckIconSolid className="h-8 w-8 md:h-10 md:w-10 mr-2 md:mr-3 text-blue-500" />
            AI Creative Suite
          </div>
          <nav className="flex space-x-2 md:space-x-3">
            <button 
              onClick={() => setActiveView('geminiChat')} 
              className={navButtonClasses('geminiChat')}
            >
              <IconWrapper icon={ChatBubbleLeftEllipsisIconSolid} /> Gemini Chat
            </button>
            <button 
              onClick={() => setActiveView('imageGenerator')} 
              className={navButtonClasses('imageGenerator')}
            >
              <IconWrapper icon={PhotoIconSolid} /> Image Gen
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow w-full container mx-auto py-4 md:py-6 px-2 md:px-4">
        <Suspense fallback={
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingSpinner size="16" color="indigo-500" />
          </div>
        }>
          {renderView()}
        </Suspense>
      </main>

      <footer className="w-full bg-gray-800 text-center p-3 md:p-4 text-xs md:text-sm text-gray-500 border-t border-gray-700">
        Powered by DeepAI & Gemini &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
