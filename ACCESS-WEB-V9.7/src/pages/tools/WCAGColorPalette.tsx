import { WCAGColorPalette as ColorPaletteComponent } from '../../components/WCAGColorPalette';

export function WCAGColorPalette() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[75px] pb-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            WCAG Color Palette Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate accessible color combinations that meet WCAG standards
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <ColorPaletteComponent />
        </div>
      </div>
    </div>
  );
}

export default WCAGColorPalette;