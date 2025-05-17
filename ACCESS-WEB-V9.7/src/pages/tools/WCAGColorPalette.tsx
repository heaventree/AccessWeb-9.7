import { WCAGColorPaletteTemp as ColorPaletteComponent } from '../../components/WCAGColorPaletteTemp';

export function WCAGColorPalette() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-[130px] pb-[80px]">
      <div className="content-container">
        <ColorPaletteComponent />
      </div>
    </div>
  );
}

export default WCAGColorPalette;