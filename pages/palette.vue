<template>
  <section class="section">
    <div class="m-2">
      <h1 class="text-xl">rndrfero's Typography Contrast Palette Tool</h1>
    </div>

    <div class="m-2">
      <ul>
        <li>L = luminance</li>
        <li>E = color difference metric - Delta E in the CIELAB color space</li>
      </ul>
    </div>

    <div class="flex m-2 text-2xl">
      <div>
        Threshold L: {{ thresholdL }} - Threshold E: {{ thresholdE }} &rarr;
        {{ count }} combinations
      </div>
    </div>

    <div class="flex m-2">
      <div class="mx-2">
        <input
          v-model="thresholdL"
          type="range"
          :min="0.0"
          :max="1.0"
          :step="0.01"
          class="slider"
        />
      </div>

      <div class="mx-2">
        <input
          v-model="thresholdE"
          type="range"
          :min="0.0"
          :max="200.0"
          :step="1"
          class="slider"
        />
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 m-2">
      <div v-for="(row, key) in grid" :key="key" class="p-2">
        <div class="">
          <!-- <h2 class="title"> </h2> -->
          <div class="font-bold mb-2">{{ row.name }} - {{ row.color }}</div>
          <div>
            <!-- text: <input v-model="colors[key].isText" type="checkbox" /> bg:
            <input v-model="colors[key].isBackground" type="checkbox" /> -->
          </div>

          <div
            v-for="(cell, key2) in row.colors"
            :key="key2"
            :style="{ color: cell.color, backgroundColor: row.color }"
          >
            <div v-if="cell.pass" class="inner text-sm my-1 p-1">
              Hello there - {{ cell.name }} on {{ row.name }}
              <!-- Hello there dear folks! - {{ cell.color.color }} -
              {{ cell.deltaE.toFixed(2) }} -
              {{ cell.deltaL.toFixed(2) }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <code class="whitespace-pre">{{ code }}</code>
    </div>
  </section>
</template>

<script>
// caflou light colors - new
// "Light Gray": "#E9EBEE",
// "Light Red": "#F1D2D2",
// "Light Orange": "#F1E0D2",
// "Light Yellow": "#F1EED3",
// "Light Green": "#E1F1D3",
// "Light Teal": "#D2F0E4",
// "Light Blue": "#D2E7F0",
// "Light Purple": "#D1D5F0",
// "Light Pink": "#E7D2F0",
// caflou old colors

// caflou colors - old
// "#eff1f4";
// "#cbecdd";
// "#c5d3f2";
// "#fac7d2";

// "#fffea8";
// "#c2cf96";
// "#dbc5b6";
// "#caf8fc";
// "#fdd386";
// "#f8a3b5";

import { isProxy, toRaw } from "vue";
import tinycolor from "tinycolor2";

export default {
  async asyncData(context) {
    await context.app.$cms.init(context);
  },
  data: () => {
    return {
      thresholdL: 0.47,
      thresholdE: 100,
      inputColors: [
        { name: "Black", color: "#000000", isText: true, isBackground: false },
        { name: "White", color: "#FFFFFF", isText: true, isBackground: false },

        // original palette
        { name: "Gray", color: "#eff1f4", isText: false, isBackground: true },
        { name: "Green", color: "#cbecdd", isText: true, isBackground: true },
        { name: "Blue", color: "#c5d3f2", isText: true, isBackground: true },
        { name: "Pink", color: "#fac7d2", isText: true, isBackground: true },

        { name: "Yellow", color: "#fffea8", isText: true, isBackground: true },
        { name: "Olive", color: "#c2cf96", isText: true, isBackground: true },
        { name: "Brown", color: "#dbc5b6", isText: true, isBackground: true },
        { name: "Cyan", color: "#caf8fc", isText: true, isBackground: true },
        { name: "Orange", color: "#fdd386", isText: true, isBackground: true },
        { name: "Rose", color: "#f8a3b5", isText: true, isBackground: true },

        // adding saturated dark text:
        // {
        //   name: "DkGreen",
        //   color: "#008700",
        //   isText: true,
        //   isBackground: false,
        // },
        // {
        //   name: "DkRed",
        //   color: "#b50000",
        //   isText: true,
        //   isBackground: false,
        // },
        // {
        //   name: "DkBlue",
        //   color: "#0015b5",
        //   isText: true,
        //   isBackground: false,
        // },

        // -----------------------

        // {
        //   name: "Dark Gray",
        //   color: "#666666",
        //   isText: false,
        //   isBackground: true,
        // },

        // {
        //   name: "Old Light Gray",
        //   color: "#eff1f4",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Green",
        //   color: "#cbecdd",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Blue",
        //   color: "#c5d3f2",
        //   isText: true,
        //   isBackground: true,
        // },
        // // {
        // //   name: "Old Light Red",
        // //   color: "#fac7d2",
        // //   isText: true,
        // //   isBackground: true,
        // // },
        // {
        //   name: "Old Light Yellow",
        //   color: "#fffea8",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Yellow Plus",
        //   color: "#fcfb0f",
        //   isText: true,
        //   isBackground: false,
        // },
        // {
        //   name: "Old Light Olive",
        //   color: "#c2cf96",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Brown",
        //   color: "#dbc5b6",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Cyan",
        //   color: "#caf8fc",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Orange",
        //   color: "#fdd386",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Light Pink",
        //   color: "#f8a3b5",
        //   isText: true,
        //   isBackground: true,
        // },
        // // DARK
        // {
        //   name: "Old Dark Gray",
        //   color: "#B3B5B9",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Green",
        //   color: "#8CC3C5",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Blue",
        //   color: "#86A8D2",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Yellow",
        //   color: "#CCCF76",
        //   isText: true,
        //   isBackground: false,
        // },
        // {
        //   name: "Old Dark Olive",
        //   color: "#85A96B",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Brown",
        //   color: "#A69488",
        //   isText: false,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Cyan",
        //   color: "#8AE0E9",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Orange",
        //   color: "#CCA45C",
        //   isText: true,
        //   isBackground: true,
        // },
        // {
        //   name: "Old Dark Pink",
        //   color: "#C67A8A",
        //   isText: true,
        //   isBackground: false,
        // },

        // black: "#333333",
        // white: "#FFFFFF",

        // black: "#333333",
        // white: "#FFFFFF",
        // blue: '#5AABD8',
        // blueAlt: '#00ADD8',
        // dark: '#06587E',
        // green: '#488D34',
        // yellow: '#F7A501',
        // yellowAlt: '#B97B00',
        // orange: '#ED5C03',
        // orangeAlt: '#DE2A1B',
        // pink: '#FF9F93',
        // pinkAlt: '#F96D5C',
      ],
      bulma: [
        "light",
        "dark",
        "primary",
        "info",
        "link",
        "success",
        "warning",
        "danger",
      ],
    };
  },

  computed: {
    tinycolor() {
      return tinycolor;
    },
    grid() {
      const ret = [];

      // this.count = 0;

      this.inputColors.forEach(({ name, color, isBackground }) => {
        if (!isBackground) {
          return;
        }

        const row = { name, color, colors: [] };

        this.inputColors.forEach((x) => {
          if (!x.isText) {
            return;
          }
          const color2 = x.color;

          const deltaE = this.calculateDeltaE(color, color2);
          const deltaL = this.calculateDeltaL(color, color2);
          const pass = this.compare(color, color2);

          row.colors.push({
            color: color2,
            name: x.name,
            deltaE,
            deltaL,
            pass,
          });
        });
        ret.push(row);
      });

      return ret;
    },
    count() {
      return this.grid.reduce((total, row) => {
        return total + row.colors.filter((cell) => cell.pass).length;
      }, 0);
    },
    code() {
      let ret = "";

      this.inputColors.forEach(({ name, color, isBackground }) => {
        if (!isBackground) {
          return;
        }

        this.inputColors.forEach((x) => {
          const color2 = x.color;

          const pass = this.compare(color, color2);
          if (!x.isText || !pass) {
            return;
          }

          ret +=
            "{backgroundColor: '" + color + "', color: '" + color2 + "' },";
          ret += " // " + x.name + " on " + name + "\n";
        });
      });

      return ret;
    },
  },

  methods: {
    compare(col1, col2) {
      return (
        // this.calculateDeltaE(col1, col2) > this.thresholdE
        //  &&
        this.calculateDeltaL(col1, col2) > this.thresholdL
      );
      // return (
      //   Math.abs(
      //     this.tinycolor(col1).getLuminance() -
      //       this.tinycolor(col2).getLuminance()
      //   ) > this.threshold
      // );
    },

    // Helper: Convert sRGB component to linear value
    pivotRgb(n) {
      n = n / 255;
      return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    },

    pivotXyz(n) {
      return n > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116;
    },

    // Convert RGB to XYZ using the D65 illuminant
    rgbToXyz(rgb) {
      const r = this.pivotRgb(rgb.r);
      const g = this.pivotRgb(rgb.g);
      const b = this.pivotRgb(rgb.b);

      // Observer = 2°, Illuminant = D65
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

      return { x, y, z };
    },

    // Convert XYZ to LAB
    xyzToLab(xyz) {
      // Reference white D65
      const refX = 0.95047;
      const refY = 1.0;
      const refZ = 1.08883;

      const x = this.pivotXyz(xyz.x / refX);
      const y = this.pivotXyz(xyz.y / refY);
      const z = this.pivotXyz(xyz.z / refZ);

      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);

      return { l, a, b };
    },

    rgbToLab(rgb) {
      const xyz = this.rgbToXyz(rgb);
      return this.xyzToLab(xyz);
    },

    calculateDeltaE(color1, color2) {
      // Get the RGB values using tinycolor
      const rgb1 = tinycolor(color1).toRgb();
      const rgb2 = tinycolor(color2).toRgb();

      const lab1 = this.rgbToLab(rgb1);
      const lab2 = this.rgbToLab(rgb2);

      // Compute Delta E as the Euclidean distance in LAB space
      const deltaE = Math.sqrt(
        Math.pow(lab1.l - lab2.l, 2) +
          Math.pow(lab1.a - lab2.a, 2) +
          Math.pow(lab1.b - lab2.b, 2)
      );

      return deltaE;
    },

    calculateDeltaL(color1, color2) {
      return Math.abs(
        this.tinycolor(color1).getLuminance() -
          this.tinycolor(color2).getLuminance()
      );
    },

    // Example usage:
    // const deltaEValue = calculateDeltaE('#FF5733', '#33A1FF');
    // console.log('Delta E:', deltaEValue);
  },
};
</script>

<style lang="scss">
// .outer {
//   padding: 1rem;
// }
// .inner {
//   padding: 0.3rem;
//   &.intro {
//     background: white;
//     color: black;
//     position: relative;
//     left: -1rem;
//   }
// }
</style>

<!-- <template>
  <div id="app">
    <h1>Hello, World!</h1>
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  text-align: center;
  margin-top: 50px;
}
</style> -->
