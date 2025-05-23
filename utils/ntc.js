/*
 * Name that Color JavaScript Library
 * By Chirag Mehta - http://chir.ag/projects/ntc
 * Released under the Creative Commons License
 */

const ntc = {
  init() {
    const colors = [
      ['000000', 'Black'],
      ['FFFFFF', 'White'],
      ['FF0000', 'Red'],
      ['00FF00', 'Lime'],
      ['0000FF', 'Blue'],
      ['FFFF00', 'Yellow'],
      ['00FFFF', 'Cyan'],
      ['FF00FF', 'Magenta'],
      ['C0C0C0', 'Silver'],
      ['808080', 'Gray'],
      ['800000', 'Maroon'],
      ['808000', 'Olive'],
      ['008000', 'Green'],
      ['800080', 'Purple'],
      ['008080', 'Teal'],
      ['000080', 'Navy'],
      // Add more color definitions here
      ['F0F8FF', 'AliceBlue'],
      ['FAEBD7', 'AntiqueWhite'],
      ['7FFFD4', 'Aquamarine'],
      ['F0FFFF', 'Azure'],
      ['F5F5DC', 'Beige'],
      ['FFE4C4', 'Bisque'],
      ['8A2BE2', 'BlueViolet'],
      ['A52A2A', 'Brown'],
      ['DEB887', 'BurlyWood'],
      ['5F9EA0', 'CadetBlue'],
      ['7FFF00', 'Chartreuse'],
      ['D2691E', 'Chocolate'],
      ['FF7F50', 'Coral'],
      ['6495ED', 'CornflowerBlue'],
      ['FFF8DC', 'Cornsilk'],
      ['DC143C', 'Crimson'],
      ['00008B', 'DarkBlue'],
      ['008B8B', 'DarkCyan'],
      ['B8860B', 'DarkGoldenRod'],
      ['A9A9A9', 'DarkGray'],
      ['006400', 'DarkGreen'],
      ['BDB76B', 'DarkKhaki'],
      ['8B008B', 'DarkMagenta'],
      ['556B2F', 'DarkOliveGreen'],
      ['FF8C00', 'DarkOrange'],
      ['9932CC', 'DarkOrchid'],
      ['8B0000', 'DarkRed'],
      ['E9967A', 'DarkSalmon'],
      ['8FBC8F', 'DarkSeaGreen'],
      ['483D8B', 'DarkSlateBlue'],
      ['2F4F4F', 'DarkSlateGray'],
      ['00CED1', 'DarkTurquoise'],
      ['9400D3', 'DarkViolet'],
      ['FF1493', 'DeepPink'],
      ['00BFFF', 'DeepSkyBlue'],
      ['696969', 'DimGray'],
      ['1E90FF', 'DodgerBlue'],
      ['B22222', 'FireBrick'],
      ['FFFAF0', 'FloralWhite'],
      ['228B22', 'ForestGreen'],
      ['DCDCDC', 'Gainsboro'],
      ['F8F8FF', 'GhostWhite'],
      ['FFD700', 'Gold'],
      ['DAA520', 'GoldenRod'],
      ['ADFF2F', 'GreenYellow'],
      ['F0FFF0', 'HoneyDew'],
      ['FF69B4', 'HotPink'],
      ['CD5C5C', 'IndianRed'],
      ['4B0082', 'Indigo'],
      ['FFFFF0', 'Ivory'],
      ['F0E68C', 'Khaki'],
      ['E6E6FA', 'Lavender'],
      ['FFF0F5', 'LavenderBlush'],
      ['7CFC00', 'LawnGreen'],
      ['FFFACD', 'LemonChiffon'],
      ['ADD8E6', 'LightBlue'],
      ['F08080', 'LightCoral'],
      ['E0FFFF', 'LightCyan'],
      ['FAFAD2', 'LightGoldenRodYellow'],
      ['90EE90', 'LightGreen'],
      ['FFB6C1', 'LightPink'],
      ['FFA07A', 'LightSalmon'],
      ['20B2AA', 'LightSeaGreen'],
      ['87CEFA', 'LightSkyBlue'],
      ['778899', 'LightSlateGray'],
      ['B0C4DE', 'LightSteelBlue'],
      ['FFFFE0', 'LightYellow'],
      ['32CD32', 'LimeGreen'],
      ['FAF0E6', 'Linen'],
      ['66CDAA', 'MediumAquaMarine'],
      ['0000CD', 'MediumBlue'],
      ['BA55D3', 'MediumOrchid'],
      ['9370DB', 'MediumPurple'],
      ['3CB371', 'MediumSeaGreen'],
      ['7B68EE', 'MediumSlateBlue'],
      ['00FA9A', 'MediumSpringGreen'],
      ['48D1CC', 'MediumTurquoise'],
      ['C71585', 'MediumVioletRed'],
      ['191970', 'MidnightBlue'],
      ['F5FFFA', 'MintCream'],
      ['FFE4E1', 'MistyRose'],
      ['FFE4B5', 'Moccasin'],
      ['FFDEAD', 'NavajoWhite'],
      ['000080', 'Navy'],
      ['FDF5E6', 'OldLace'],
      ['6B8E23', 'OliveDrab'],
      ['FFA500', 'Orange'],
      ['FF4500', 'OrangeRed'],
      ['DA70D6', 'Orchid'],
      ['EEE8AA', 'PaleGoldenRod'],
      ['98FB98', 'PaleGreen'],
      ['AFEEEE', 'PaleTurquoise'],
      ['DB7093', 'PaleVioletRed'],
      ['FFEFD5', 'PapayaWhip'],
      ['FFDAB9', 'PeachPuff'],
      ['CD853F', 'Peru'],
      ['FFC0CB', 'Pink'],
      ['DDA0DD', 'Plum'],
      ['B0E0E6', 'PowderBlue'],
      ['BC8F8F', 'RosyBrown'],
      ['4169E1', 'RoyalBlue'],
      ['8B4513', 'SaddleBrown'],
      ['FA8072', 'Salmon'],
      ['F4A460', 'SandyBrown'],
      ['2E8B57', 'SeaGreen'],
      ['FFF5EE', 'SeaShell'],
      ['A0522D', 'Sienna'],
      ['87CEEB', 'SkyBlue'],
      ['6A5ACD', 'SlateBlue'],
      ['708090', 'SlateGray'],
      ['FFFAFA', 'Snow'],
      ['00FF7F', 'SpringGreen'],
      ['4682B4', 'SteelBlue'],
      ['D2B48C', 'Tan'],
      ['D8BFD8', 'Thistle'],
      ['FF6347', 'Tomato'],
      ['40E0D0', 'Turquoise'],
      ['EE82EE', 'Violet'],
      ['F5DEB3', 'Wheat'],
      ['F5F5F5', 'WhiteSmoke'],
      ['9ACD32', 'YellowGreen']
    ];

    this.names = colors.map(c => ({ name: c[1], hex: `#${c[0]}` }));
  },

  name(color) {
    if (!this.names) {
      this.init();
    }

    // Convert input to hex format if it's RGB
    if (color.startsWith('rgb')) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        color = '#' + [rgb[0], rgb[1], rgb[2]].map(x => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
      }
    }

    // Normalize hex color
    color = color.toUpperCase();
    if (color.length === 4) {
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }

    // Find closest color
    let minDistance = Infinity;
    let closestColor = this.names[0];

    const r1 = parseInt(color.substr(1, 2), 16);
    const g1 = parseInt(color.substr(3, 2), 16);
    const b1 = parseInt(color.substr(5, 2), 16);

    this.names.forEach(namedColor => {
      const hex = namedColor.hex;
      const r2 = parseInt(hex.substr(1, 2), 16);
      const g2 = parseInt(hex.substr(3, 2), 16);
      const b2 = parseInt(hex.substr(5, 2), 16);

      const distance = Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = namedColor;
      }
    });

    return [
      closestColor.hex,
      closestColor.name,
      closestColor.hex === color
    ];
  }
};

export default ntc; 