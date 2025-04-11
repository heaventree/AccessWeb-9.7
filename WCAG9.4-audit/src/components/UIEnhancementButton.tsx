import { LightbulbIcon } from 'lucide-react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

interface UIEnhancementButtonProps {
  className?: string;
}

export function UIEnhancementButton({ className = '' }: UIEnhancementButtonProps) {
  const { uiMode, setUIMode } = useUIEnhancement();
  
  const toggleUIMode = () => {
    setUIMode(uiMode === 'current' ? 'enhanced' : 'current');
  };
  
  return (
    <button
      onClick={toggleUIMode}
      className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        uiMode === 'enhanced'
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/40'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      } ${className}`}
      aria-pressed={uiMode === 'enhanced'}
    >
      <LightbulbIcon className="w-4 h-4 mr-2" />
      {uiMode === 'enhanced' ? 'Enhanced UI' : 'Standard UI'}
    </button>
  );
}