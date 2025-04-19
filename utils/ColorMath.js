import tinycolor from 'tinycolor2';

// Helper: Convert sRGB component to linear value
export function pivotRgb(n) {
  n = n / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
}

export function pivotXyz(n) {
  return n > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116;
}

// Convert RGB to XYZ using the D65 illuminant
export function rgbToXyz(rgb) {
  const r = pivotRgb(rgb.r);
  const g = pivotRgb(rgb.g);
  const b = pivotRgb(rgb.b);

  // Observer = 2°, Illuminant = D65
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return { x, y, z };
}

// Convert XYZ to LAB
export function xyzToLab(xyz) {
  // Reference white D65
  const refX = 0.95047;
  const refY = 1.0;
  const refZ = 1.08883;

  const x = pivotXyz(xyz.x / refX);
  const y = pivotXyz(xyz.y / refY);
  const z = pivotXyz(xyz.z / refZ);

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return { l, a, b };
}

export function rgbToLab(rgb) {
  const xyz = rgbToXyz(rgb);
  return xyzToLab(xyz);
}

export function calculateDeltaE(color1, color2) {
  // Get the RGB values using tinycolor
  const rgb1 = tinycolor(color1).toRgb();
  const rgb2 = tinycolor(color2).toRgb();

  const lab1 = rgbToLab(rgb1);
  const lab2 = rgbToLab(rgb2);

  // Compute Delta E as the Euclidean distance in LAB space
  const deltaE = Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );

  return deltaE;
}

export function calculateDeltaL(color1, color2) {
  return Math.abs(
    tinycolor(color1).getLuminance() -
    tinycolor(color2).getLuminance()
  );
} 