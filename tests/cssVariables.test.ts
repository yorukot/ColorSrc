import { convertColor } from '../lib/colorConversion';

describe('CSS Variable Tests', () => {
  describe('Alpha handling in CSS variables', () => {
    test('Should preserve alpha when converting CSS variable with OKLCH to RGB', () => {
      const input = '--destructive-foreground: oklch(0.93 0.03 25/70%);';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--destructive-foreground');
      expect(result).toContain('/ 70%');
      expect(result).not.toBe('--destructive-foreground: rgb(252 225 222);'); // 沒有 alpha 的結果
      expect(result).toBe('--destructive-foreground: rgb(252 225 222 / 70%);');
    });

    test('Should preserve alpha when converting CSS variable with HSL to RGB', () => {
      const input = '--button-hover: hsl(220 100% 50% / 50%);';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--button-hover');
      expect(result).toContain('/ 50%');
    });

    test('Should preserve alpha when converting CSS variable with RGB to OKLCH', () => {
      const input = '--text-primary: rgb(33 33 33 / 80%);';
      const result = convertColor(input, 'auto', 'oklch');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--text-primary');
      expect(result).toContain('/ 80%');
    });

    test('Should handle CSS variable with multi-word names', () => {
      const input = '--my-fancy-color: oklch(0.93 0.03 25/70%);';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toBe('--my-fancy-color: rgb(252 225 222 / 70%);');
    });
  });

  describe('CSS variable format detection', () => {
    test('Should correctly detect OKLCH in CSS variable', () => {
      const input = '--primary: oklch(0.7 0.2 240);';
      const result = convertColor(input, 'auto', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--primary');
    });

    test('Should correctly detect RGB in CSS variable', () => {
      const input = '--primary: rgb(0 0 255);';
      const result = convertColor(input, 'auto', 'oklch');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--primary');
    });
  });

  describe('CSS variable with commas', () => {
    test('Should support comma format in CSS variables', () => {
      const input = '--primary: rgb(0, 0, 255, 0.5);';
      const result = convertColor(input, 'auto', 'oklch');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--primary');
      expect(result).toContain('/ 50%');
    });

    test('Should output comma format when useCommas is true', () => {
      const input = '--primary: rgb(0 0 255);';
      const result = convertColor(input, 'auto', 'rgb', false, true);
      
      expect(result).not.toBeNull();
      expect(result).toBe('--primary: rgb(0, 0, 255);');
    });
  });
}); 