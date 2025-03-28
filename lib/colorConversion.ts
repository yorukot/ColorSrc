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
      const alphaPercentMatch = colorValue.match(/^(oklch|oklab|rgb|hsl)\((.+?)\s*\/\s*(\d+(?:\.\d+)?)%\)$/i);
      if (alphaPercentMatch) {
        // Convert percentage to decimal for library compatibility
        const [, format, values, percent] = alphaPercentMatch;
        const alphaDecimal = parseFloat(percent) / 100;
        const reformattedColor = `${format}(${values} ${alphaDecimal})`;
        
        // Check if reformatted color is valid
        if (isValidColor(reformattedColor)) {
          return format.toLowerCase() as ColorFormat;
        }
      }
      
      // Handle rgba and hsla formats with decimal alpha
      const alphaDecimalMatch = colorValue.match(/^(rgba?|hsla?)\((.+?),\s*(\d*\.\d+|\d+)\)$/i);
      if (alphaDecimalMatch) {
        const [, format, values, alpha] = alphaDecimalMatch;
        const baseFormat = format.toLowerCase().startsWith('rgb') ? 'rgb' : 'hsl';
        const reformattedColor = `${baseFormat}(${values.replace(/,/g, ' ')}, ${alpha})`;
        
        if (isValidColor(reformattedColor)) {
          return baseFormat as ColorFormat;
        }
      }
      
      return null;
    }
    
    // Check for hex format (including hex with alpha)
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
function formatHSL(hsl: HSL, simplified = false, useCommas = false): string {
  const separator = useCommas ? ', ' : ' ';
  
  // Only include alpha if it exists and is not 0 or extremely close to 0
  const includeAlpha = hsl.a !== undefined && hsl.a !== 1 && hsl.a > 0.001;
  
  if (simplified) {
    return `${Math.round(hsl.h)}${separator}${Math.round(hsl.s)}%${separator}${Math.round(hsl.l)}%${includeAlpha ? ` / ${(hsl.a! * 100).toFixed(0)}%` : ''}`;
  }
  
  if (includeAlpha) {
    return `hsl(${Math.round(hsl.h)}${separator}${Math.round(hsl.s)}%${separator}${Math.round(hsl.l)}% / ${(hsl.a! * 100).toFixed(0)}%)`;
  }
  return `hsl(${Math.round(hsl.h)}${separator}${Math.round(hsl.s)}%${separator}${Math.round(hsl.l)}%)`;
}

function formatRGB(rgb: RGB, simplified = false, useCommas = false): string {
  const separator = useCommas ? ', ' : ' ';
  
  // Only include alpha if it exists and is not 0 or extremely close to 0
  const includeAlpha = rgb.a !== undefined && rgb.a !== 1 && rgb.a > 0.001;
  
  if (simplified) {
    return `${Math.round(rgb.r)}${separator}${Math.round(rgb.g)}${separator}${Math.round(rgb.b)}${includeAlpha ? ` / ${(rgb.a! * 100).toFixed(0)}%` : ''}`;
  }
  
  if (includeAlpha) {
    return `rgb(${Math.round(rgb.r)}${separator}${Math.round(rgb.g)}${separator}${Math.round(rgb.b)} / ${(rgb.a! * 100).toFixed(0)}%)`;
  }
  return `rgb(${Math.round(rgb.r)}${separator}${Math.round(rgb.g)}${separator}${Math.round(rgb.b)})`;
}

function formatOKLAB(oklab: OKLAB, simplified = false, useCommas = false): string {
  const separator = useCommas ? ', ' : ' ';
  
  // Only include alpha if it exists and is not 0 or extremely close to 0
  const includeAlpha = oklab.alpha !== undefined && oklab.alpha !== 1 && oklab.alpha > 0.001;
  
  if (simplified) {
    return `${oklab.l.toFixed(2)}${separator}${oklab.a.toFixed(2)}${separator}${oklab.b.toFixed(2)}${includeAlpha ? ` / ${(oklab.alpha! * 100).toFixed(0)}%` : ''}`;
  }
  
  if (includeAlpha) {
    return `oklab(${oklab.l.toFixed(2)}${separator}${oklab.a.toFixed(2)}${separator}${oklab.b.toFixed(2)} / ${(oklab.alpha! * 100).toFixed(0)}%)`;
  }
  return `oklab(${oklab.l.toFixed(2)}${separator}${oklab.a.toFixed(2)}${separator}${oklab.b.toFixed(2)})`;
}

function formatOKLCH(oklch: OKLCH, simplified = false, useCommas = false): string {
  const separator = useCommas ? ', ' : ' ';
  
  // Only include alpha if it exists and is not 0 or extremely close to 0
  const includeAlpha = oklch.alpha !== undefined && oklch.alpha !== 1 && oklch.alpha > 0.001;
  
  if (simplified) {
    return `${oklch.l.toFixed(2)}${separator}${oklch.c.toFixed(2)}${separator}${Math.round(oklch.h)}${includeAlpha ? ` / ${(oklch.alpha! * 100).toFixed(0)}%` : ''}`;
  }
  
  if (includeAlpha) {
    return `oklch(${oklch.l.toFixed(2)}${separator}${oklch.c.toFixed(2)}${separator}${Math.round(oklch.h)} / ${(oklch.alpha! * 100).toFixed(0)}%)`;
  }
  return `oklch(${oklch.l.toFixed(2)}${separator}${oklch.c.toFixed(2)}${separator}${Math.round(oklch.h)})`;
}

// Function to convert alpha value (0-1) to hex string (00-FF)
function alphaToHex(alpha: number): string {
  // Ensure alpha is between 0 and 1
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  // Convert to 0-255 range and then to hex
  const alphaInt = Math.round(clampedAlpha * 255);
  const alphaHex = alphaInt.toString(16).padStart(2, '0').toUpperCase();
  return alphaHex;
}

// Function to extract alpha from hex color (if it's in 8-digit format)
function extractAlphaFromHex(hex: string): number | undefined {
  // If it's an 8-digit hex (like #RRGGBBAA)
  if (hex.startsWith('#') && hex.length === 9) {
    const alphaHex = hex.substring(7, 9);
    const alpha = parseInt(alphaHex, 16) / 255;
    return alpha;
  }
  // If it's a 4-digit hex (like #RGBA)
  else if (hex.startsWith('#') && hex.length === 5) {
    const alphaHex = hex.substring(4, 5);
    // For 4-digit hex, we repeat the digit (e.g., '8' becomes '88')
    const alpha = parseInt(alphaHex + alphaHex, 16) / 255;
    return alpha;
  }
  return undefined;
}

// Function to handle alpha percentage format
function handleAlphaPercentage(colorString: string): string {
  // Match both formats: "/ 70%" and "/70%"
  const alphaPercentMatch = colorString.match(/^(oklch|oklab|rgb|hsl)\((.+?)\s*\/\s*(\d+(?:\.\d+)?)%\)$/i);
  if (alphaPercentMatch) {
    // Convert percentage to decimal for library compatibility
    const [, format, values, percent] = alphaPercentMatch;
    const alphaDecimal = parseFloat(percent) / 100;
    return `${format}(${values} ${alphaDecimal})`;
  }
  return colorString;
}

// Function to extract alpha value from a color string if present
function extractAlphaFromString(colorString: string): number | undefined {
  // Check for hex with alpha first
  if (colorString.startsWith('#')) {
    return extractAlphaFromHex(colorString);
  }
  
  // Check for alpha in format "/ 70%" or "/70%"
  const alphaPercentMatch = colorString.match(/\/\s*(\d+(?:\.\d+)?)%\)$/i);
  if (alphaPercentMatch) {
    return parseFloat(alphaPercentMatch[1]) / 100;
  }
  
  // Check for alpha value at the end like "oklch(...) 0.7)" or "rgba(..., 0.7)"
  const alphaDecimalMatch = colorString.match(/[,\s](\d*\.\d+|\d+)\)$/);
  if (alphaDecimalMatch && !colorString.includes('%') && parseFloat(alphaDecimalMatch[1]) <= 1) {
    return parseFloat(alphaDecimalMatch[1]);
  }
  
  return undefined;
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

// Convert RGB color to HEX with support for alpha
function rgbToHexWithAlpha(rgb: RGB): string {
  const { r, g, b, a } = rgb;
  const redHex = Math.round(r).toString(16).padStart(2, '0');
  const greenHex = Math.round(g).toString(16).padStart(2, '0');
  const blueHex = Math.round(b).toString(16).padStart(2, '0');
  
  // If alpha is defined and not 1, add it to the hex color
  if (a !== undefined && a !== 1 && a > 0.001) {
    const alphaHex = alphaToHex(a);
    return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
  }
  
  return `#${redHex}${greenHex}${blueHex}`;
}

// Generic color conversion function
export function convertColor(
  input: string, 
  sourceFormat: ColorFormat, 
  targetFormat: ColorFormat,
  simplified = false,
  useCommas = false
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

    // Check for "raw" HSL format with alpha like "234 71.43% 10.98% / 50%"
    const rawHslAlphaMatch = !colorValue.startsWith('hsl') && colorValue.match(/^(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%\s*\/\s*(\d+(?:\.\d+)?)%$/);
    if (rawHslAlphaMatch) {
      const [, h, s, l, a] = rawHslAlphaMatch;
      colorValue = `hsl(${h} ${s}% ${l}% / ${a}%)`;
      if (sourceFormat === 'auto') {
        sourceFormat = 'hsl';
      }
    }

    // Try to extract alpha value from original string before processing
    const stringAlphaValue = extractAlphaFromString(colorValue);

    // Handle colors with alpha percentage notation
    const processedColorValue = handleAlphaPercentage(colorValue);
    
    // Check if color has alpha component (for preservation during conversion)
    const hasAlpha = processedColorValue.includes('/') || 
                    processedColorValue.includes(' / ') ||
                    processedColorValue.match(/rgba?\(/i) ||
                    processedColorValue.match(/hsla?\(.+?,.+?,.+?,.+?\)/i) ||
                    processedColorValue.match(/oklch\(.+?\s+\d+\.?\d*\)$/i) ||
                    processedColorValue.match(/oklab\(.+?\s+\d+\.?\d*\)$/i);

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

    // Explicitly extract alpha value if it exists in the parsed color
    let alphaValue: number | undefined;
    if ((parsedColor as any).a !== undefined) {
      alphaValue = (parsedColor as any).a;
    } else if ((parsedColor as any).alpha !== undefined) {
      alphaValue = (parsedColor as any).alpha;
    } else if (stringAlphaValue !== undefined) {
      // Use alpha value extracted from string if not found in parsed color
      alphaValue = stringAlphaValue;
    }
    
    // Convert to target format
    let result: string | HSL | RGB | OKLAB | OKLCH | null = null;

    // Conversion matrix for all format combinations
    if (actualSourceFormat === 'hex') {
      // First extract alpha from hex if it exists (8-digit or 4-digit hex)
      if (!alphaValue || alphaValue === 1) {
        alphaValue = extractAlphaFromHex(processedColorValue);
      }
      
      if (targetFormat === 'hsl') result = hex2hsl(processedColorValue);
      else if (targetFormat === 'oklab') result = hex2oklab(processedColorValue);
      else if (targetFormat === 'oklch') result = hex2oklch(processedColorValue);
      else if (targetFormat === 'rgb') result = hex2rgb(processedColorValue);
      else result = processedColorValue; // hex to hex
      
      // For hex format, also transfer the alpha value if it exists in the original hex
      if (result && typeof result !== 'string' && alphaValue !== undefined && alphaValue !== 1 && alphaValue > 0.001) {
        if (targetFormat === 'hsl') {
          (result as HSL).a = alphaValue;
        } else if (targetFormat === 'rgb') {
          (result as RGB).a = alphaValue;
        } else if (targetFormat === 'oklab') {
          (result as OKLAB).alpha = alphaValue;
        } else if (targetFormat === 'oklch') {
          (result as OKLCH).alpha = alphaValue;
        }
      }
    } 
    else if (actualSourceFormat === 'hsl') {
      if (targetFormat === 'hex') {
        // When converting to hex, use the custom function that supports alpha
        const hslColor = parsedColor as HSL;
        // Ensure alpha is correctly transferred before RGB conversion
        if (alphaValue !== undefined && alphaValue !== 1 && alphaValue > 0.001) {
          hslColor.a = alphaValue;
        }
        const rgbResult = hsl2rgb(hslColor);
        result = rgbToHexWithAlpha(rgbResult);
      }
      else if (targetFormat === 'oklab') result = hsl2oklab(parsedColor as HSL);
      else if (targetFormat === 'oklch') result = hsl2oklch(parsedColor as HSL);
      else if (targetFormat === 'rgb') result = hsl2rgb(parsedColor as HSL);
      else result = parsedColor; // hsl to hsl
    }
    else if (actualSourceFormat === 'oklab') {
      if (targetFormat === 'hex') {
        // When converting to hex, use the custom function that supports alpha
        const oklabColor = parsedColor as OKLAB;
        
        // Ensure alpha is correctly transferred before RGB conversion
        if (alphaValue !== undefined && alphaValue !== 1 && alphaValue > 0.001) {
          oklabColor.alpha = alphaValue;
        }
        
        // Debug information if we're in development
        if (process.env.NODE_ENV !== 'production') {
          console.debug('OKLAB with alpha conversion:', oklabColor);
        }
        
        const rgbResult = oklab2rgb(oklabColor);
        
        // Make sure alpha gets transferred to the RGB result
        if (oklabColor.alpha !== undefined && oklabColor.alpha !== 1 && oklabColor.alpha > 0.001) {
          (rgbResult as RGB).a = oklabColor.alpha;
        }
        
        result = rgbToHexWithAlpha(rgbResult);
      }
      else if (targetFormat === 'hsl') result = oklab2hsl(parsedColor as OKLAB);
      else if (targetFormat === 'oklch') result = oklab2oklch(parsedColor as OKLAB);
      else if (targetFormat === 'rgb') result = oklab2rgb(parsedColor as OKLAB);
      else result = parsedColor; // oklab to oklab
    }
    else if (actualSourceFormat === 'oklch') {
      if (targetFormat === 'hex') {
        // When converting to hex, use the custom function that supports alpha
        const oklchColor = parsedColor as OKLCH;
        
        // Ensure alpha is correctly transferred before RGB conversion
        if (alphaValue !== undefined && alphaValue !== 1 && alphaValue > 0.001) {
          oklchColor.alpha = alphaValue;
        }
        
        // Debug information if we're in development
        if (process.env.NODE_ENV !== 'production') {
          console.debug('OKLCH with alpha conversion:', oklchColor);
        }
        
        const rgbResult = oklch2rgb(oklchColor);
        
        // Make sure alpha gets transferred to the RGB result
        if (oklchColor.alpha !== undefined && oklchColor.alpha !== 1 && oklchColor.alpha > 0.001) {
          (rgbResult as RGB).a = oklchColor.alpha;
        }
        
        result = rgbToHexWithAlpha(rgbResult);
      }
      else if (targetFormat === 'hsl') result = oklch2hsl(parsedColor as OKLCH);
      else if (targetFormat === 'oklab') result = oklch2oklab(parsedColor as OKLCH);
      else if (targetFormat === 'rgb') result = oklch2rgb(parsedColor as OKLCH);
      else result = parsedColor; // oklch to oklch
    }
    else if (actualSourceFormat === 'rgb') {
      if (targetFormat === 'hex') {
        // When converting to hex, use the custom function that supports alpha
        const rgbWithAlpha = parsedColor as RGB;
        // Ensure alpha is correctly transferred
        if (alphaValue !== undefined && alphaValue !== 1 && alphaValue > 0.001) {
          rgbWithAlpha.a = alphaValue;
        }
        result = rgbToHexWithAlpha(rgbWithAlpha);
      }
      else if (targetFormat === 'hsl') result = rgb2hsl(parsedColor as RGB);
      else if (targetFormat === 'oklab') result = rgb2oklab(parsedColor as RGB);
      else if (targetFormat === 'oklch') result = rgb2oklch(parsedColor as RGB);
      else result = parsedColor; // rgb to rgb
    }

    // Make sure alpha value is properly transferred to the result if it exists
    if (result && typeof result !== 'string' && alphaValue !== undefined && alphaValue !== 1 && alphaValue > 0.001) {
      if (targetFormat === 'hsl') {
        (result as HSL).a = alphaValue;
      } else if (targetFormat === 'rgb') {
        (result as RGB).a = alphaValue;
      } else if (targetFormat === 'oklab') {
        (result as OKLAB).alpha = alphaValue;
      } else if (targetFormat === 'oklch') {
        (result as OKLCH).alpha = alphaValue;
      }
    }

    // Format the result
    let formattedResult: string;
    if (typeof result === 'string') {
      formattedResult = result;
    } else if (result) {
      if (targetFormat === 'hsl') formattedResult = formatHSL(result as HSL, simplified, useCommas);
      else if (targetFormat === 'rgb') formattedResult = formatRGB(result as RGB, simplified, useCommas);
      else if (targetFormat === 'oklab') formattedResult = formatOKLAB(result as OKLAB, simplified, useCommas);
      else if (targetFormat === 'oklch') formattedResult = formatOKLCH(result as OKLCH, simplified, useCommas);
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
  simplified = false,
  useCommas = false
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
    
    const converted = convertColor(trimmedLine, sourceFormat, targetFormat, simplified, useCommas);
    
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