import { describe, expect, test } from '@jest/globals';
import { convertColor } from '../lib/colorConversion';

describe('Alpha Format Tests', () => {
  describe('Different alpha formats in input', () => {
    test('Should handle slash percentage format (/ 70%)', () => {
      const input = 'oklch(0.93 0.03 25 / 70%)';
      const result = convertColor(input, 'oklch', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toContain('/ 70%');
    });

    test('Should handle slash without space percentage format (/70%)', () => {
      const input = 'oklch(0.93 0.03 25/70%)';
      const result = convertColor(input, 'oklch', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toContain('70%');
    });

    test('Should handle decimal alpha format (0.5)', () => {
      const input = 'rgb(255, 0, 0, 0.5)';
      const result = convertColor(input, 'rgb', 'oklch');
      
      expect(result).not.toBeNull();
      expect(result).toContain('50%');
    });

    test('Should handle legacy rgba format', () => {
      const input = 'rgba(255, 0, 0, 0.25)';
      const result = convertColor(input, 'rgb', 'hsl');
      
      expect(result).not.toBeNull();
      expect(result).toContain('25%');
    });

    test('Should handle legacy hsla format', () => {
      const input = 'hsla(220, 100%, 50%, 0.75)';
      const result = convertColor(input, 'hsl', 'rgb');
      
      expect(result).not.toBeNull();
      expect(result).toContain('75%');
    });
  });

  describe('Decimal and percentage alpha conversions', () => {
    test('Should convert decimal alpha to percentage in output', () => {
      const input = 'rgba(255, 0, 0, 0.333)';
      const result = convertColor(input, 'rgb', 'hsl');
      
      expect(result).not.toBeNull();
      expect(result).toContain('33%'); // 0.333 = 33%
    });

    test('Should handle edge case alpha values', () => {
      // Very small alpha
      const input1 = 'rgba(255, 0, 0, 0.01)';
      const result1 = convertColor(input1, 'rgb', 'hsl');
      
      expect(result1).not.toBeNull();
      expect(result1).toContain('1%');
      
      // Very large alpha
      const input2 = 'rgba(255, 0, 0, 0.99)';
      const result2 = convertColor(input2, 'rgb', 'hsl');
      
      expect(result2).not.toBeNull();
      expect(result2).toContain('99%');
    });
  });

  describe('Alpha with different format separators', () => {
    test('Should handle alpha with space-separated format', () => {
      const input = 'rgb(255 0 0 / 50%)';
      const result = convertColor(input, 'rgb', 'hsl');
      
      expect(result).not.toBeNull();
      expect(result).toContain('/ 50%');
    });

    test('Should handle alpha with comma-separated format', () => {
      const input = 'rgb(255, 0, 0, 0.5)';
      const result = convertColor(input, 'rgb', 'hsl');
      
      expect(result).not.toBeNull();
      expect(result).toContain('50%');
    });

    test('Should keep using commas with alpha when useCommas is true', () => {
      const input = 'rgb(255, 0, 0, 0.5)';
      const result = convertColor(input, 'rgb', 'rgb', false, true);
      
      expect(result).not.toBeNull();
      expect(result).toMatch(/rgb\(255, 0, 0 \/ 50%\)/);
    });
  });
}); 