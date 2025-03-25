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

    <div class="flex m-2 text-xl">
      <div>
        Threshold L: {{ thresholdL }} - Threshold E: {{ thresholdE }} &rarr;
        {{ count }}
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
      <div
        v-for="(row, key) in grid"
        :key="key"
        :style="{ backgroundColor: row.color }"
        class="p-2"
      >
        <div class="">
          <!-- <h2 class="title"> </h2> -->
          <div class="font-bold mb-2">{{ row.color }}</div>

          <div
            v-for="(cell, key2) in row.colors"
            :key="key2"
            :style="{ color: cell.color }"
          >
            <div v-if="cell.pass" class="inner">
              Hello there dear folks! - {{ cell.color }} -
              {{ cell.deltaE.toFixed(2) }} -
              {{ cell.deltaL.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { isProxy, toRaw } from 'vue';
import tinycolor from 'tinycolor2';

export default {
  async asyncData(context) {
    await context.app.$cms.init(context);
  },
  data: () => {
    return {
      thresholdL: 0.1,
      thresholdE: 100,
      inputColors: {
        black: '#333333',
        white: '#FFFFFF',
        blue: '#5AABD8',
        blueAlt: '#00ADD8',
        dark: '#06587E',
        green: '#488D34',
        yellow: '#F7A501',
        yellowAlt: '#B97B00',
        orange: '#ED5C03',
        orangeAlt: '#DE2A1B',
        pink: '#FF9F93',
        pinkAlt: '#F96D5C',
      },
      bulma: [
        'light',
        'dark',
        'primary',
        'info',
        'link',
        'success',
        'warning',
        'danger',
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

      Object.values(this.inputColors).forEach(bg => {
        const row = { color: bg, colors: [] };

        Object.values(this.inputColors).forEach(color => {
          const deltaE = this.calculateDeltaE(bg, color);
          const deltaL = this.calculateDeltaL(bg, color);
          const pass = this.compare(bg, color);

          row.colors.push({
            color,
            deltaE,
            deltaL,
            pass,
          });

          // if (pass) {
          //   this.count++;
          // }
        });
        ret.push(row);
      });

      return ret;
    },
    count() {
      return this.grid.reduce((total, row) => {
        return total + row.colors.filter(cell => cell.pass).length;
      }, 0);
    },
  },

  methods: {
    compare(col1, col2) {
      return (
        this.calculateDeltaE(col1, col2) > this.thresholdE &&
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
