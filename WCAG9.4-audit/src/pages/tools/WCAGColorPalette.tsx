import { WCAGColorPalette as ColorPaletteComponent } from '../../components/WCAGColorPalette';

export function WCAGColorPalette() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="content-container">
        <ColorPaletteComponent />
      </div>
    </div>
  );
}

export default WCAGColorPalette;