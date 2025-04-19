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

    <!-- COLORS -->

    <div class="m-2">
      <div class="font-bold mb-2">Colors</div>
      <div class="flex flex-wrap gap-2">
        <div v-for="(color, key) in colors" :key="key" class="p-2 w-full max-w-[300px]">
          <div class="font-bold mb-2">{{ colorName(color.value) }} - {{ color.value }}</div>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="color.isText" />
              <span>Text</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="color.isBackground" />
              <span>Background</span>
            </label>
          </div>
        </div>
      </div>  
    </div>

    <!-- COLOR COMBINATIONS -->

    <div class="flex flex-wrap gap">
      <div v-for="(row, key) in grid" :key="key" class="p-2 w-full max-w-[300px]">
          <div
            v-for="(textColor, key2) in row.colors"
            :key="key2"
            :style="{ color: textColor, backgroundColor: row.color }"
          >
            <div class="inner text-sm my-1 p-1">
              {{ colorName(textColor) }} on {{ colorName(row.color) }}
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
import { isProxy, toRaw } from "vue";
import tinycolor from "tinycolor2";
import ntc from '~/utils/ntc';
import { calculateDeltaL } from '~/utils/ColorMath';

export default {
  async asyncData(context) {
    await context.app.$cms.init(context);
  },
  data: () => {
    return {
      thresholdL: 0.3,
      thresholdE: 100,
      colors: [
        { value: "#333333", isText: true, isBackground: true }, // black
        { value: "#FFFFFF", isText: true, isBackground: true }, // white
        { value: "#5AABD8", isText: true, isBackground: true }, // blue
        { value: "#00ADD8", isText: true, isBackground: true }, // blueAlt
        { value: "#06587E", isText: true, isBackground: true }, // dark
        { value: "#488D34", isText: true, isBackground: true }, // green
        { value: "#F7A501", isText: true, isBackground: true }, // yellow
        { value: "#B97B00", isText: true, isBackground: true }, // yellowAlt
        { value: "#ED5C03", isText: true, isBackground: true }, // orange
        { value: "#DE2A1B", isText: true, isBackground: true }, // orangeAlt
        { value: "#FF9F93", isText: true, isBackground: true }, // pink
        { value: "#F96D5C", isText: true, isBackground: true }, // pinkAlt
      ]      
    };
  },

  computed: {
    backgroundColors() {
      return this.colors.filter(({ isBackground }) => isBackground);
    },
    textColors() {
      return this.colors.filter(({ isText }) => isText);
    },
    grid() {
      return this.backgroundColors
        .map(({ value }) => {
          const row = { color: value, colors: [] };
          
          this.textColors.forEach((x) => {
            if (this.compare(value, x.value)) {
              row.colors.push(x.value);
            }
          });
          return row;
        })
        .filter(row => row.colors.length > 0);
    },
    count() {
      return this.grid.reduce((total, row) => {
        return total + row.colors.filter((cell) => cell.pass).length;
      }, 0);
    },
    code() {
      let ret = "";

      this.backgroundColors.forEach(({ value }) => {
        this.textColors.forEach((inputColor) => {
          if (!this.compare(value, inputColor.value)) {
            return;
          }

          ret += `{backgroundColor: '${value}', color: '${inputColor.value}' },`
          ret += `// ${this.colorName(value)} on ${this.colorName(inputColor.value)}\n`;
        });
      });

      return ret;
    },
  },

  methods: {
    compare(col1, col2) {
      return calculateDeltaL(col1, col2) > this.thresholdL;
    },
    colorName(color) { return ntc.name(color)[1]; },
  },
};
</script>

<style lang="scss">
</style>

