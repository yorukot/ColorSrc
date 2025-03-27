// Comprehensive color format conversion utilities using Colorizr
import { formatCSS, hex2hsl, hex2oklab, hex2oklch, hex2rgb, hsl2hex, hsl2oklab, hsl2oklch, hsl2rgb, 
  oklab2hex, oklab2hsl, oklab2oklch, oklab2rgb, oklch2hex, oklch2hsl, oklch2oklab, oklch2rgb, 
  parseCSS, rgb2hex, rgb2hsl, rgb2oklab, rgb2oklch, isValidColor } from 'colorizr';

// Color format types
export type ColorFormat = 'hex' | 'hsl' | 'oklab' | 'oklch' | 'rgb' | 'auto';

// Type definitions
export type HSL = {
  h: number;
  s: number;
  l: number;
  a?: number;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type OKLAB = {
  l: number;
  a: number;
  b: number;
  alpha?: number;
};

export type OKLCH = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

// Function to detect the format of a color string
export function detectColorFormat(colorString: string): ColorFormat | null {
  try {
    const trimmed = colorString.trim();
    
    // Handle CSS variables
    const cssVarMatch = trimmed.match(/^(--[\w-]+):\s*(.+?);?$/);
    let colorValue = cssVarMatch ? cssVarMatch[2].trim() : trimmed;
    
    // Check for "raw" HSL format like "234 71.43% 10.98%"
    const rawHslMatch = !colorValue.startsWith('hsl') && colorValue.match(/^(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%$/);
    if (rawHslMatch) {
      // Convert to standard HSL format for processing
      colorValue = `hsl(${rawHslMatch[1]} ${rawHslMatch[2]}% ${rawHslMatch[3]}%)`;
    }
    
    // Check if it's a valid color at all
    if (!isValidColor(colorValue)) {
      // Specially handle alpha percentage format (like oklch(1 0 0 / 10%))
      const alphaPercentMatch = colorValue.match(/^(oklch|oklab|rgb|hsl)\((.+?)\s*\/\s*(\d+)%\)$/i);
      if (alphaPercentMatch) {
        // Convert percentage to decimal for library compatibility
        const [, format, values, percent] = alphaPercentMatch;
        const alphaDecimal = parseInt(percent) / 100;
        const reformattedColor = `${format}(${values} ${alphaDecimal})`;
        
        // Check if reformatted color is valid
        if (isValidColor(reformattedColor)) {
          return format.toLowerCase() as ColorFormat;
        }
      }
      
      return null;
    }
    
    // Check for hex format
    if (colorValue.startsWith('#') || /^[0-9A-Fa-f]{3,8}$/.test(colorValue)) {
      return 'hex';
    }
    
    // Check for HSL format
    if (colorValue.startsWith('hsl') || (colorValue.includes('%') && !colorValue.includes('rgb'))) {
      return 'hsl';
    }
    
    // Check for OKLAB format
    if (colorValue.startsWith('oklab')) {
      return 'oklab';
    }
    
    // Check for OKLCH format
    if (colorValue.startsWith('oklch')) {
      return 'oklch';
    }
    
    // Check for RGB format
    if (colorValue.startsWith('rgb') || (colorValue.split(/\s+/).length === 3 && !colorValue.includes('%'))) {
      return 'rgb';
    }
    
    // Try to infer from format
    try {
      // Try as decimal values with no units (might be oklab/oklch)
      const parts = colorValue.split(/\s+/);
      if (parts.length === 3) {
        const [first, second, third] = parts.map(parseFloat);
        
        // If first value is between 0-1, likely oklab/oklch
        if (!isNaN(first) && first >= 0 && first <= 1) {
          // Oklab typically has negative values for a/b
          if (!isNaN(second) && (second < 0 || second > 0.4)) {
            return 'oklab';
          } else {
            return 'oklch';
          }
        }
        
        // If all values are 0-255, likely RGB
        if (!isNaN(first) && !isNaN(second) && !isNaN(third) &&
            first >= 0 && first <= 255 && 
            second >= 0 && second <= 255 && 
            third >= 0 && third <= 255) {
          return 'rgb';
        }
      }
    } catch (error) {
      // Silently handle errors in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error detecting color format:', error);
      }
    }
    
    return null;
  } catch (error) {
    // Silently handle any errors in the entire detection process
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in format detection:', error);
    }
    return null;
  }
}

// Format output functions - depending on simplified mode
function formatHSL(hsl: HSL, simplified = false): string {
  if (simplified) {
    return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%${hsl.a !== undefined && hsl.a !== 1 ? ` / ${(hsl.a * 100).toFixed(0)}%` : ''}`;
  }
  
  if (hsl.a !== undefined && hsl.a !== 1) {
    return `hsl(${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}% / ${(hsl.a * 100).toFixed(0)}%)`;
  }
  return `hsl(${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%)`;
}

function formatRGB(rgb: RGB, simplified = false): string {
  if (simplified) {
    return `${Math.round(rgb.r)} ${Math.round(rgb.g)} ${Math.round(rgb.b)}${rgb.a !== undefined && rgb.a !== 1 ? ` / ${(rgb.a * 100).toFixed(0)}%` : ''}`;
  }
  
  if (rgb.a !== undefined && rgb.a !== 1) {
    return `rgb(${Math.round(rgb.r)} ${Math.round(rgb.g)} ${Math.round(rgb.b)} / ${(rgb.a * 100).toFixed(0)}%)`;
  }
  return `rgb(${Math.round(rgb.r)} ${Math.round(rgb.g)} ${Math.round(rgb.b)})`;
}

function formatOKLAB(oklab: OKLAB, simplified = false): string {
  if (simplified) {
    return `${oklab.l.toFixed(2)} ${oklab.a.toFixed(2)} ${oklab.b.toFixed(2)}${oklab.alpha !== undefined && oklab.alpha !== 1 ? ` / ${(oklab.alpha * 100).toFixed(0)}%` : ''}`;
  }
  
  if (oklab.alpha !== undefined && oklab.alpha !== 1) {
    return `oklab(${oklab.l.toFixed(2)} ${oklab.a.toFixed(2)} ${oklab.b.toFixed(2)} / ${(oklab.alpha * 100).toFixed(0)}%)`;
  }
  return `oklab(${oklab.l.toFixed(2)} ${oklab.a.toFixed(2)} ${oklab.b.toFixed(2)})`;
}

function formatOKLCH(oklch: OKLCH, simplified = false): string {
  if (simplified) {
    return `${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${Math.round(oklch.h)}${oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${(oklch.alpha * 100).toFixed(0)}%` : ''}`;
  }
  
  if (oklch.alpha !== undefined && oklch.alpha !== 1) {
    return `oklch(${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${Math.round(oklch.h)} / ${(oklch.alpha * 100).toFixed(0)}%)`;
  }
  return `oklch(${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${Math.round(oklch.h)})`;
}

// Function to handle alpha percentage format
function handleAlphaPercentage(colorString: string): string {
  const alphaPercentMatch = colorString.match(/^(oklch|oklab|rgb|hsl)\((.+?)\s*\/\s*(\d+)%\)$/i);
  if (alphaPercentMatch) {
    // Convert percentage to decimal for library compatibility
    const [, format, values, percent] = alphaPercentMatch;
    const alphaDecimal = parseInt(percent) / 100;
    return `${format}(${values} ${alphaDecimal})`;
  }
  return colorString;
}

// Function to validate color has the expected number of components
function validateColorComponentCount(value: string, format: ColorFormat): boolean {
  try {
    // Special case for hex format - hex doesn't need component counting
    if (format === 'hex') {
      // Hex validation is simpler - just check if it's a valid hex pattern
      return value.startsWith('#') || /^[0-9A-Fa-f]{3,8}$/.test(value);
    }
    
    // Remove the format prefix and any parentheses
    const cleanValue = value
      .replace(/^(hsl|rgb|oklab|oklch)\s*\(/, '')
      .replace(/\)$/, '')
      .trim();
    
    // Split by spaces, commas, or slashes
    const parts = cleanValue.split(/[\s,/]+/).filter(Boolean);
    
    // Count only the numeric components (ignore % symbols, etc)
    const numericParts = parts.filter(part => !isNaN(parseFloat(part.replace('%', ''))));
    
    // Expected component counts for each format
    const expectedComponentCount: Record<ColorFormat, number[]> = {
      'hex': [1], // Hex is just one string
      'hsl': [3, 4], // 3 for hsl, 4 with alpha
      'oklab': [3, 4], // 3 for oklab, 4 with alpha
      'oklch': [3, 4], // 3 for oklch, 4 with alpha
      'rgb': [3, 4], // 3 for rgb, 4 with alpha
      'auto': [1, 3, 4], // Allow any valid count for auto
    };
    
    return expectedComponentCount[format].includes(numericParts.length);
  } catch (error) {
    // If anything goes wrong during validation, fail safely
    return false;
  }
}

// Generic color conversion function
export function convertColor(
  input: string, 
  sourceFormat: ColorFormat, 
  targetFormat: ColorFormat,
  simplified = false
): string | null {
  try {
    // Handle CSS variables and extract the actual color value
    const cssVarMatch = input.trim().match(/^(--[\w-]+):\s*(.+?);?$/);
    let colorValue = cssVarMatch ? cssVarMatch[2].trim() : input.trim();
    const varName = cssVarMatch ? cssVarMatch[1] : null;

    // Check for "raw" HSL format like "234 71.43% 10.98%" and convert to standard format
    const rawHslMatch = !colorValue.startsWith('hsl') && colorValue.match(/^(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%$/);
    if (rawHslMatch) {
      colorValue = `hsl(${rawHslMatch[1]} ${rawHslMatch[2]}% ${rawHslMatch[3]}%)`;
      // Update sourceFormat to HSL if it's auto
      if (sourceFormat === 'auto') {
        sourceFormat = 'hsl';
      }
    }

    // Handle colors with alpha percentage notation
    const processedColorValue = handleAlphaPercentage(colorValue);

    // If sourceFormat is auto, detect the input format
    let actualSourceFormat = sourceFormat;
    if (sourceFormat === 'auto') {
      actualSourceFormat = detectColorFormat(processedColorValue) || 'hex';
    }

    // Validate that the color has the expected number of components for its format
    if (actualSourceFormat !== 'auto' && !validateColorComponentCount(processedColorValue, actualSourceFormat)) {
      return null; // Skip conversion if component count doesn't match expectations
    }

    // Parse the color value based on source format
    let parsedColor;
    try {
      // Ensure we don't pass 'auto' to parseCSS since it expects ColorType
      const formatForParsing = actualSourceFormat === 'auto' ? 'hex' : actualSourceFormat;
      parsedColor = parseCSS(processedColorValue, formatForParsing);
    } catch (error) {
      // Silently handle "invalid CSS string" errors
      if (error instanceof Error && 
         (error.message.includes('invalid CSS string') || 
          error.message.includes('Invalid CSS string'))) {
        return null;
      }
      // For other errors, don't log to console in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error parsing color:', error);
      }
      return null;
    }
    
    if (!parsedColor) return null;
    
    // Convert to target format
    let result: string | HSL | RGB | OKLAB | OKLCH | null = null;

    // Conversion matrix for all format combinations
    if (actualSourceFormat === 'hex') {
      if (targetFormat === 'hsl') result = hex2hsl(processedColorValue);
      else if (targetFormat === 'oklab') result = hex2oklab(processedColorValue);
      else if (targetFormat === 'oklch') result = hex2oklch(processedColorValue);
      else if (targetFormat === 'rgb') result = hex2rgb(processedColorValue);
      else result = processedColorValue; // hex to hex
    } 
    else if (actualSourceFormat === 'hsl') {
      if (targetFormat === 'hex') result = hsl2hex(parsedColor as HSL);
      else if (targetFormat === 'oklab') result = hsl2oklab(parsedColor as HSL);
      else if (targetFormat === 'oklch') result = hsl2oklch(parsedColor as HSL);
      else if (targetFormat === 'rgb') result = hsl2rgb(parsedColor as HSL);
      else result = parsedColor; // hsl to hsl
    }
    else if (actualSourceFormat === 'oklab') {
      if (targetFormat === 'hex') result = oklab2hex(parsedColor as OKLAB);
      else if (targetFormat === 'hsl') result = oklab2hsl(parsedColor as OKLAB);
      else if (targetFormat === 'oklch') result = oklab2oklch(parsedColor as OKLAB);
      else if (targetFormat === 'rgb') result = oklab2rgb(parsedColor as OKLAB);
      else result = parsedColor; // oklab to oklab
    }
    else if (actualSourceFormat === 'oklch') {
      if (targetFormat === 'hex') result = oklch2hex(parsedColor as OKLCH);
      else if (targetFormat === 'hsl') result = oklch2hsl(parsedColor as OKLCH);
      else if (targetFormat === 'oklab') result = oklch2oklab(parsedColor as OKLCH);
      else if (targetFormat === 'rgb') result = oklch2rgb(parsedColor as OKLCH);
      else result = parsedColor; // oklch to oklch
    }
    else if (actualSourceFormat === 'rgb') {
      if (targetFormat === 'hex') result = rgb2hex(parsedColor as RGB);
      else if (targetFormat === 'hsl') result = rgb2hsl(parsedColor as RGB);
      else if (targetFormat === 'oklab') result = rgb2oklab(parsedColor as RGB);
      else if (targetFormat === 'oklch') result = rgb2oklch(parsedColor as RGB);
      else result = parsedColor; // rgb to rgb
    }
    
    // Format the result
    let formattedResult: string;
    if (typeof result === 'string') {
      formattedResult = result;
    } else if (result) {
      if (targetFormat === 'hsl') formattedResult = formatHSL(result as HSL, simplified);
      else if (targetFormat === 'rgb') formattedResult = formatRGB(result as RGB, simplified);
      else if (targetFormat === 'oklab') formattedResult = formatOKLAB(result as OKLAB, simplified);
      else if (targetFormat === 'oklch') formattedResult = formatOKLCH(result as OKLCH, simplified);
      else if (targetFormat === 'hex' && typeof result === 'string') formattedResult = result;
      else formattedResult = String(result);
    } else {
      return null;
    }
    
    // If this was a CSS variable, reassemble it
    if (varName) {
      return `${varName}: ${formattedResult};`;
    }
    
    return formattedResult;
  } catch (error) {
    // Silently handle errors in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in color conversion:', error);
    }
    return null;
  }
}

// Process multi-line input
export function processMultiLineInput(
  input: string, 
  sourceFormat: ColorFormat, 
  targetFormat: ColorFormat,
  simplified = false
): Array<{
  original: string;
  converted: string | null;
  detectedFormat?: ColorFormat;
}> {
  const lines = input.split('\n');
  
  return lines.map(line => {
    // Store the original line with whitespace
    const originalLine = line;
    
    // Trim for processing only
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      return { original: originalLine, converted: null };
    }
    
    // If auto-detect is enabled, detect the format first
    let detectedFormat: ColorFormat | null = null;
    if (sourceFormat === 'auto') {
      detectedFormat = detectColorFormat(trimmedLine);
    }
    
    const converted = convertColor(trimmedLine, sourceFormat, targetFormat, simplified);
    
    // Preserve the original whitespace by counting leading spaces
    if (converted) {
      const leadingSpaces = line.length - line.trimStart().length;
      const leadingWhitespace = ' '.repeat(leadingSpaces);
      return { 
        original: originalLine, 
        converted: leadingWhitespace + converted,
        detectedFormat: detectedFormat || undefined
      };
    }
    
    return { 
      original: originalLine, 
      converted,
      detectedFormat: detectedFormat || undefined
    };
  });
} 