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

    // HEX with alpha to RGB test
    test('Should preserve alpha when converting from 8-digit HEX to RGB', () => {
      const input = '#FF0000AA'; // Red with ~67% alpha (AA = 170/255)
      const result = convertColor(input, 'hex', 'rgb');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('67%');
    });

    // HEX with alpha to OKLCH test
    test('Should preserve alpha when converting from 8-digit HEX to OKLCH', () => {
      const input = '#00FF0080'; // Green with 50% alpha (80 = 128/255)
      const result = convertColor(input, 'hex', 'oklch');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      expect(result).toContain('50%');
    });

    // 4-digit HEX with alpha test
    test('Should handle 4-digit HEX with alpha', () => {
      const input = '#F008'; // Full red with 50% alpha (8 = 8/15)
      const result = convertColor(input, 'hex', 'hsl');
      
      expect(result).not.toBeNull();
      expect(hasAlpha(result)).toBe(true);
      // Alpha value should be close to 53% (8/15 * 100)
      expect(result).toContain('53%');
    });

    // RGB to HEX with alpha test
    test('Should include alpha when converting from RGB with alpha to HEX', () => {
      const input = 'rgb(0 128 255 / 40%)';
      const result = convertColor(input, 'rgb', 'hex');
      
      expect(result).not.toBeNull();
      // 8-digit hex with 40% alpha (approx 102/255 = 66)
      expect(result!.length).toBe(9); // #RRGGBBAA format
      // Check if the last two characters represent alpha close to 40%
      const alphaHex = result!.substring(7, 9);
      const alphaValue = parseInt(alphaHex, 16);
      expect(alphaValue).toBeCloseTo(102, 0); // 40% of 255 = ~102
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

  describe('OKLCH to HEX conversion tests', () => {
    test('Should convert basic OKLCH to HEX correctly', () => {
      const input = 'oklch(0.7 0.2 240)';
      const result = convertColor(input, 'oklch', 'hex');
      
      expect(result).not.toBeNull();
      expect(result).toBe('#00a9ff');
    });
    
    test('Should convert OKLCH with percentage alpha to HEX correctly', () => {
      const input = 'oklch(0.7 0.2 240 / 50%)';
      const result = convertColor(input, 'oklch', 'hex');
      
      expect(result).not.toBeNull();
      expect(result).toBe('#00a9ff80');
      expect(result?.length).toBe(9); // Should include alpha
    });
    
    test('Should convert OKLCH with decimal alpha to HEX correctly', () => {
      const input = 'oklch(0.7 0.2 240 0.7)';
      const result = convertColor(input, 'oklch', 'hex');
      
      expect(result).not.toBeNull();
      expect(result?.length).toBe(9); // Should be 8-digit hex
      // Check if alpha value is approximately correct (0.7 * 255 ≈ 179 = B3 in hex)
      const alphaHex = result!.substring(7, 9);
      const alphaValue = parseInt(alphaHex, 16);
      expect(alphaValue).toBeCloseTo(179, 0);
    });
    
    test('Should convert CSS variable with OKLCH to HEX correctly', () => {
      const input = '--button-color: oklch(0.7 0.2 240 / 50%);';
      const result = convertColor(input, 'auto', 'hex');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--button-color:');
      expect(result).toContain('80'); // The 50% alpha value
    });
    
    test('Should convert OKLCH with low alpha to HEX correctly', () => {
      const input = 'oklch(0.7 0.2 240 / 10%)';
      const result = convertColor(input, 'oklch', 'hex');
      
      expect(result).not.toBeNull();
      const alphaHex = result!.substring(7, 9);
      const alphaValue = parseInt(alphaHex, 16);
      expect(alphaValue).toBeCloseTo(26, 0); // 10% of 255 ≈ 26
    });
    
    test('Should convert OKLCH with high alpha to HEX correctly', () => {
      const input = 'oklch(0.7 0.2 240 / 99%)';
      const result = convertColor(input, 'oklch', 'hex');
      
      expect(result).not.toBeNull();
      const alphaHex = result!.substring(7, 9);
      const alphaValue = parseInt(alphaHex, 16);
      expect(alphaValue).toBeCloseTo(252, 0); // 99% of 255 ≈ 252
    });
  });
  
  describe('OKLAB to HEX conversion tests', () => {
    test('Should convert basic OKLAB to HEX correctly', () => {
      const input = 'oklab(0.7 0.0 0.2)';
      const result = convertColor(input, 'oklab', 'hex');
      
      expect(result).not.toBeNull();
      expect(result?.length).toBe(7); // Should be standard hex without alpha
    });
    
    test('Should convert OKLAB with percentage alpha to HEX correctly', () => {
      const input = 'oklab(0.7 0.0 0.2 / 50%)';
      const result = convertColor(input, 'oklab', 'hex');
      
      expect(result).not.toBeNull();
      expect(result?.length).toBe(9); // Should include alpha
      const alphaHex = result!.substring(7, 9);
      const alphaValue = parseInt(alphaHex, 16);
      expect(alphaValue).toBeCloseTo(128, 0); // 50% of 255 ≈ 128
    });
    
    test('Should convert OKLAB with decimal alpha to HEX correctly', () => {
      const input = 'oklab(0.7 0.0 0.2 0.7)';
      const result = convertColor(input, 'oklab', 'hex');
      
      expect(result).not.toBeNull();
      expect(result?.length).toBe(9); // Should be 8-digit hex
      const alphaHex = result!.substring(7, 9);
      const alphaValue = parseInt(alphaHex, 16);
      expect(alphaValue).toBeCloseTo(179, 0); // 0.7 * 255 ≈ 179
    });
    
    test('Should convert CSS variable with OKLAB to HEX correctly', () => {
      const input = '--button-color: oklab(0.7 0.0 0.2 / 50%);';
      const result = convertColor(input, 'auto', 'hex');
      
      expect(result).not.toBeNull();
      expect(result).toContain('--button-color:');
      expect(result?.length).toBeGreaterThan(20); // Long enough to include variable and hex color with alpha
    });
  });
}); 