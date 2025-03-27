# ColorSrc

A powerful tool for converting between multiple color formats. Built with Next.js, Shadcn UI, and Framer Motion.

[![Demo](https://img.shields.io/badge/Live%20Demo-colorsrc.yorukot.me-blue?style=for-the-badge)](https://colorsrc.yorukot.me)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-green?style=for-the-badge)](https://github.com/yorukot/colorsrc)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<p align="center">
  <img src="asset/colorsrc-demo.gif" alt="ColorSrc demo" width="650" />
</p>

## Overview

ColorSrc is a modern web application for converting between various color formats used in web development and design. It provides accurate conversions with an intuitive interface to streamline workflow for developers and designers.

<p align="center">
  <img src="asset/colorsrc-overview.png" alt="ColorSrc Overview" width="600" />
</p>

## Features

- **Multiple Format Support**: HEX, RGB, HSL, OKLAB, OKLCH
- **Batch Conversion**: Process multiple colors at once
- **CSS Variables**: Preserve variable names during conversion  
- **Alpha Support**: Full transparency channel handling
- **Auto-Detection**: Automatic identification of input color formats
- **Simplified Output**: Option to display just values without format names
- **Progressive Web App**: Available for offline use

## Usage

1. **Select Formats**:
   - Choose your source format (or use Auto Detect)
   - Select your target format
   - Use the swap button (↔️) to quickly switch between formats

2. **Input Colors**:
   - Enter one or more color values
   - Support for multiple lines and CSS variables
   - Auto-detection works as you type

3. **Conversion**:
   - Click "Convert" to process the input
   - Results appear in the output section
   - Use the "Copy" button to copy all results to clipboard

4. **Simplified Output**:
   - Toggle the "Simplified output" checkbox to remove format names
   - Example: `0.63 0.25 20` instead of `oklch(0.63 0.25 20)`

## Color Format Support

### HEX
Standard hexadecimal notation used in CSS and design tools.
- **Supported Formats**:
  - `#RGB`
  - `#RGBA`
  - `#RRGGBB`
  - `#RRGGBBAA`
- **Example**: `#ff0044`, `#f04`, `#ff0044cc`

### HSL
Hue, Saturation, Lightness format that's intuitive for humans.
- **Supported Formats**:
  - `hsl(h s% l%)`
  - `hsl(h s% l% / a)`
  - `h s% l%` (raw values)
- **Example**: `hsl(344 100% 50%)`, `hsl(344 100% 50% / 0.5)`, `344 100% 50%`

### OKLAB
Perceptually uniform LAB color space for more accurate color manipulation.
- **Supported Formats**:
  - `oklab(l a b)`
  - `oklab(l a b / a)`
  - `l a b` (raw values)
- **Example**: `oklab(0.63 0.24 0.09)`, `oklab(0.63 0.24 0.09 / 0.8)`, `0.63 0.24 0.09`

### OKLCH
Perceptual color space with intuitive cylindrical coordinates.
- **Supported Formats**:
  - `oklch(l c h)`
  - `oklch(l c h / a)`
  - `l c h` (raw values)
- **Example**: `oklch(0.63 0.25 20)`, `oklch(0.63 0.25 20 / 0.9)`, `0.63 0.25 20`

### RGB
Classic Red, Green, Blue format widely used in web and design.
- **Supported Formats**:
  - `rgb(r g b)`
  - `rgb(r g b / a)`
  - `r g b` (raw values)
- **Example**: `rgb(255 0 68)`, `rgb(255 0 68 / 0.5)`, `255 0 68`

## Examples

### Converting CSS Variables

```css
/* Input (HSL) */
--primary: 220 100% 50%;
--secondary: 280 75% 60%;

/* Output (OKLCH) */
--primary: oklch(0.57 0.23 260);
--secondary: oklch(0.65 0.20 305);
```

### Color Palette Conversion with Alpha

```css
/* Input */
--overlay: rgba(0, 0, 0, 0.5);
--glass: hsla(200, 100%, 50%, 0.2);

/* Output */
--overlay: oklch(0.00 0.00 0 / 50%);
--glass: oklch(0.63 0.20 233 / 20%);
```

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Setup

```bash
# Clone repository
git clone https://github.com/yorukot/colorsrc.git
cd colorsrc

# Install dependencies
pnpm install  # or npm/yarn

# Start development server
pnpm dev      # or npm run dev/yarn dev

# Open http://localhost:3000
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Colorizr](https://github.com/gilbarbara/colorizr) - Color conversion algorithms
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide Icons](https://lucide.dev/) - Icons
- [Next.js](https://nextjs.org/) - Framework

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/yorukot">Yorukot</a>
</p>