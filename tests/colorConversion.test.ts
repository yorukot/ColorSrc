import { ColorFormat, convertColor } from '../lib/colorConversion';

describe('Color Conversion Tests', () => {
  // Helper function to check if a color string has alpha
  function hasAlpha(colorString: string | null): boolean {
    if (!colorString) return false;
    
    return colorString.includes(' / ') || 
           colorString.includes('/ ') ||
           colorString.match(/rgba?\(/i) !== null ||
           colorString.match(/hsla?\(/i) !== null ||
           (colorString.match(/\d+(\.\d+)?%\)$/) !== null && colorString.includes('/')) ||
           colorString.match(/[, ]\d+(\.\d+)?\)$/) !== null;
  }
  
  describe('Alpha preservation tests', () => {
    test('Should preserve alpha when converting from OKLCH with percentage alpha to RGB', () => {
      const input = 'oklch(0.93 0.03 25/70%)';
      const result = convertColor(input, 'oklch', 'rgb');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('70%');
    });

    test('Should preserve alpha when converting CSS variable with OKLCH to RGB', () => {
      const input = '--destructive-foreground: oklch(0.93 0.03 25/70%);';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('--destructive-foreground');
      expect(result).toContain('70%');
    });

    test('Should preserve alpha when converting from RGB with decimal alpha to OKLCH', () => {
      const input = 'rgb(255, 0, 0, 0.5)';
      const result = convertColor(input, 'rgb', 'oklch');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('50%');
    });

    test('Should preserve alpha when converting from HSL with percentage alpha to OKLCH', () => {
      const input = 'hsl(220 100% 50% / 50%)';
      const result = convertColor(input, 'hsl', 'oklch');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('50%');
    });

    test('Should preserve alpha when converting from RGB with percentage alpha to HSL', () => {
      const input = 'rgb(255 0 0 / 40%)';
      const result = convertColor(input, 'rgb', 'hsl');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('40%');
    });
  });
  
  describe('Format detection tests', () => {
    test('Should auto-detect OKLCH format with alpha', () => {
      const input = 'oklch(0.93 0.03 25/70%)';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
    });

    test('Should auto-detect HSL format with alpha', () => {
      const input = 'hsl(220 100% 50% / 50%)';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
    });
  });
  
  describe('Comma separator tests', () => {
    test('Should use spaces by default', () => {
      const input = 'rgb(255, 0, 0)';
      const result = convertColor(input, 'rgb', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toBe('rgb(255 0 0)');
    });

    test('Should use commas when useCommas is true', () => {
      const input = 'rgb(255 0 0)';
      const result = convertColor(input, 'rgb', 'rgb', false, true);
      
      expect(result).not.toBeNull();
      expect(result).toBe('rgb(255, 0, 0)');
    });

    test('Should use commas with alpha when useCommas is true', () => {
      const input = 'rgb(255 0 0 / 50%)';
      const result = convertColor(input, 'rgb', 'rgb', false, true);
      
      expect(result).not.toBeNull();
      expect(result).toMatch(/rgb\(255, 0, 0 \/ 50%\)/);
    });
  });
}); 