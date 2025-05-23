<template>
  <section class="m-2">
    <div class="my-4">
      <div class="font-bold mb-2 text-2xl">rndrfero's Readable Palette Checker</div>
    </div>

    <div class="my-2 max-w-[600px]">
      A typography color testing tool that validates text-background combinations in your palette for optimal readability. 
    </div>
    <div class="my-2 max-w-[600px]">
       Test your custom color schemes to ensure text is clear and easy to read for everyone.
    </div>

    <!-- COLORS -->

    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">The Palette</div>
      <div class="flex flex-wrap gap-2">
        <div v-for="(color, key) in colors" :key="key" class="p-2 w-full max-w-[300px] border border-gray-300 rounded bg-gray-100">
          <div class="mb-2 flex items-center gap-2">            
            <input 
              type="color" 
              v-model="color.value"
              class="w-8 h-8 rounded cursor-pointer"
            >
            <input 
              type="text" 
              v-model="color.value"
              class="w-20 px-1 rounded border border-gray-300 bg-white"
              pattern="^#[0-9A-Fa-f]{6}$"
              title="Hex color code (e.g. #FF0000)"
            >
            <span class="font-bold">{{ colorName(color.value) }}</span>
            <button 
              @click="removeColor(key)"
              class="ml-auto text-red-500 hover:text-red-700 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove color"
              :disabled="!canRemoveColors"
            >
              ×
            </button>
          </div>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="color.isText" >
              <span>Text</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="color.isBackground" >
              <span>Background</span>
            </label>
          </div>
        </div>

        <!-- Add new color -->
        <div class="p-2 w-full max-w-[300px] border border-gray-300 rounded bg-gray-100 border-dashed flex items-center justify-center">
          <button 
            @click="addColor"
            class="text-green-500 hover:text-green-700 text-3xl"
            title="Add random color"
          >
            +
          </button>
        </div>
      </div>  
    </div>

    <!-- PARAMETERS -->

    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">Luminance contrast</div>
      <div>
        Luminance delta threshold: 
        <input
          v-model="thresholdL"
          type="range"
          :min="0.0"
          :max="1.0"
          :step="0.01"
          class="slider"
        >
        {{ thresholdL }}
      </div>
    </div>

    <!-- COLOR COMBINATIONS -->
     
    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">Combinations: {{ count }}</div>

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
    </div>

    <div class="my-8">
      <div class="font-bold mb-2 text-2xl">Javascript code</div>
      <textarea 
        class="w-full h-48 p-2 font-mono text-xs bg-gray-100 border border-gray-300 rounded"
        readonly
        v-model="code"
      ></textarea>
    </div>
  </section>
</template>

<script>
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
        { value: "#333333", isText: true, isBackground: true }, 
        { value: "#FFFFFF", isText: true, isBackground: false },
        { value: "#00ADD8", isText: true, isBackground: true }, 
        { value: "#06587E", isText: true, isBackground: true }, 
        { value: "#488D34", isText: true, isBackground: true }, 
        { value: "#F7A501", isText: true, isBackground: true }, 
        { value: "#ED5C03", isText: true, isBackground: true }, 
        { value: "#DE2A1B", isText: true, isBackground: true }, 
        { value: "#FF9F93", isText: true, isBackground: true }, 
        { value: "#F96D5C", isText: true, isBackground: true }, 
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
    canRemoveColors() {
      return this.colors.length >= 4;
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
        return total + row.colors.length;
      }, 0);
    },
    code() {
      let ret = "const palette = [\n";

      this.backgroundColors.forEach(({ value }) => {
        this.textColors.forEach((inputColor) => {
          if (!this.compare(value, inputColor.value)) {
            return;
          }

          ret += `  // ${this.colorName(value)} on ${this.colorName(inputColor.value)}\n`;
          ret += `  { backgroundColor: '${value}', color: '${inputColor.value}' },\n`;
        });
      });

      return ret + "];";
    },
  },

  methods: {
    compare(col1, col2) {
      return calculateDeltaL(col1, col2) > this.thresholdL;
    },
    colorName(color) { return ntc.name(color)[1]; },
    removeColor(index) {
      this.colors.splice(index, 1);
    },
    addColor() {
      this.colors.push({
        value: tinycolor.random().toHexString(),
        isText: true,
        isBackground: true
      });
    },
  },
};
</script>

<style lang="scss">
</style>

